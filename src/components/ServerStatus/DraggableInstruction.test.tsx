import { render, screen } from '@testing-library/react'
import DraggableInstruction from './DraggableInstruction'
import { vi } from 'vitest'
import { useState } from 'react'
import type { Instruction, InstructionTemplate } from '../../instructions/instructionSchema'
import { TestContextWrapper } from '../contextTestHelper'
import userEvent from '@testing-library/user-event'

const mockProps = {
    moveInstruction: vi.fn(),
    deleteInstruction: vi.fn(),
    setInstruction: vi.fn(),
}

const TestWrapper = () => {
    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [quickCommands, setQuickCommands] = useState<InstructionTemplate[]>([]);

    return (<TestContextWrapper instructions={instructions} setInstructions={setInstructions} quickCommands={quickCommands} setQuickCommands={setQuickCommands}>
        { instructions.length > 0 && instructions.map((x, index) => <DraggableInstruction key={index}
            index={index} maxIndex={instructions.length-1}
            instruction={x}
            {...mockProps}
        /> )}
    </TestContextWrapper>)
}

describe('DraggableInstruction', () => {

    const getAddRgbInstructionButton = () => screen.getByTestId("addRgbInstruction");
    
    it('renders instruction identifier and properties', async () => {
        render(<TestWrapper />);

        await userEvent.click(getAddRgbInstructionButton());

        expect(screen.getByText(/color_static_rgb\(/)).toBeInTheDocument(); // \( to avoid matching InstructionEditor
        expect(screen.getByText(/red=255/)).toBeInTheDocument();
        expect(screen.getByText(/green=127/)).toBeInTheDocument();
        expect(screen.getByText(/blue=1/)).toBeInTheDocument();
    });

    it('removes itsef when "Remove" is clicked', async () => {
        render(<TestWrapper />);

        await userEvent.click(getAddRgbInstructionButton());

        const remove = screen.getByText("Remove");
        await userEvent.click(remove);

        expect(mockProps.deleteInstruction).toHaveBeenCalled();
    });

    it('calls setInstruction when clicked once (twice)', async () => {
        render(<TestWrapper />);
        await userEvent.click(getAddRgbInstructionButton());

        const toggleButton = screen.getByRole("button", { name: "Enabled" });
        
        // disable
        await userEvent.click(toggleButton); 
        expect(mockProps.setInstruction).toHaveBeenCalledWith(expect.objectContaining({ is_enabled: false }));

        // re-enable
        await userEvent.click(toggleButton); 
        expect(mockProps.setInstruction).toHaveBeenCalledWith(expect.objectContaining({ is_enabled: true }));
        
    });

    it('enables/disables top/down move button at list ends', async () => {
        render(<TestWrapper />);
        await userEvent.click(getAddRgbInstructionButton());
        await userEvent.click(getAddRgbInstructionButton());
        await userEvent.click(getAddRgbInstructionButton());

        const ups = screen.getAllByRole<HTMLButtonElement>("button", {name : '↑'});
        const downs = screen.getAllByRole<HTMLButtonElement>("button", {name : '↓'});

        // Bottom
        expect(ups[0].disabled).toBe(false);
        expect(downs[0].disabled).toBe(true);

        // Middle
        expect(ups[1].disabled).toBe(false);
        expect(downs[1].disabled).toBe(false);

        // Top
        expect(ups[2].disabled).toBe(true);
        expect(downs[2].disabled).toBe(false);
    });

    it('calls moveInstruction with the correct indicies', async () => {
        render(<TestWrapper />);
        await userEvent.click(getAddRgbInstructionButton());
        await userEvent.click(getAddRgbInstructionButton());

        const ups = screen.getAllByRole<HTMLButtonElement>("button", {name : '↑'});
        const downs = screen.getAllByRole<HTMLButtonElement>("button", {name : '↓'});

        // Move bottom up
        await userEvent.click(ups[0]);
        expect(mockProps.moveInstruction).toHaveBeenCalledWith(0, 1);
        mockProps.moveInstruction.mockClear();

        // Move top down
        await userEvent.click(downs[1]);
        expect(mockProps.moveInstruction).toHaveBeenCalledWith(1, 0);
    })

    it('enables favorite state and calls setQuickCommands', async () => {
        render(<TestWrapper />);
        await userEvent.click(getAddRgbInstructionButton());
        await userEvent.click(screen.getByText('Favorite'));

        const actual = JSON.parse(screen.getByTestId("quickCommands").textContent ?? "");
        expect(actual).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    identifier: 'color_static_rgb',
                    red: 255,
                    green: 127,
                    blue: 1,
                })
            ])
        );
    });

    it('disables favorite state and calls setQuickCommands', async () => {
        render(<TestWrapper />);
        await userEvent.click(getAddRgbInstructionButton());
        await userEvent.click(screen.getByText('Favorite')); // enable
        await userEvent.click(screen.getByText('Favorite')); // disable

        const actual = screen.getByTestId("quickCommands").textContent;
        expect(actual).toEqual("[]");
    });

    it("expands/collapses the InstructionEditor", async () => {

        render(<TestWrapper />);
        await userEvent.click(getAddRgbInstructionButton());
        
        const expanderIcon = screen.getByTestId("expanderIcon");
        const expander = screen.getByTestId("expander");
    
        expect(expanderIcon).toHaveClass('rotate-90');
        expect(expander).toHaveClass('expandable');
    
        await userEvent.click(expanderIcon);
    
        expect(expander).toHaveClass('expandable');
        expect(expander).toHaveClass('expanded');
    })
});