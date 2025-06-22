
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestContextWrapper } from "../contextTestHelper"
import InstructionList from "./InstructionList"
import userEvent from '@testing-library/user-event';

describe("InstructionList", async () => {

    const getAddRgbInstructionButton = () => screen.getByTestId("addRgbInstruction");

    it('renders', async () => {
        render(<TestContextWrapper><InstructionList/></TestContextWrapper>);

        let draggableInstructions = screen.queryAllByText("Remove");
        expect (draggableInstructions.length).toBe(0);

        const add = getAddRgbInstructionButton();
        await userEvent.click(add);
        await userEvent.click(add); // add two instructions

        draggableInstructions = screen.queryAllByText("Remove");
        expect (draggableInstructions.length).toBe(2);
    });

    it('moves instructions up/down', async() => {
        render(<TestContextWrapper><InstructionList/></TestContextWrapper>);

        const add = getAddRgbInstructionButton();
        await userEvent.click(add);
        await userEvent.click(add); // add two instructions

        const ups = screen.getAllByRole<HTMLButtonElement>("button", {name : '↑'});
        const downs = screen.getAllByRole<HTMLButtonElement>("button", {name : '↓'});

        // Move bottom up and back down
        let initialJson = screen.getByTestId("instructions").textContent;
        await userEvent.click(ups[0]);
        expect(screen.getByTestId("instructions").textContent).not.toBe(initialJson);
        await userEvent.click(downs[0]);
        expect(screen.getByTestId("instructions").textContent).toBe(initialJson);

        // Move top down and back up
        initialJson = screen.getByTestId("instructions").textContent;
        await userEvent.click(downs[1]);
        expect(screen.getByTestId("instructions").textContent).not.toBe(initialJson);
        await userEvent.click(ups[1]);
        expect(screen.getByTestId("instructions").textContent).toBe(initialJson);
    });

    it('toggles instructions', async() => {
        render(<TestContextWrapper><InstructionList/></TestContextWrapper>);

        const add = getAddRgbInstructionButton();
        await userEvent.click(add);

        await userEvent.click(screen.getByText("Enabled"));
        let actual = JSON.parse(screen.getByTestId("instructions").textContent ?? "");
        expect(actual).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    is_enabled: false
                })
            ])
        );

        await userEvent.click(screen.getByText("Disabled"));
        actual = JSON.parse(screen.getByTestId("instructions").textContent ?? "");
        expect(actual).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    is_enabled: true
                })
            ])
        );
    });

    it('toggles favorites', async() => {
        render(<TestContextWrapper><InstructionList/></TestContextWrapper>);

        const add = getAddRgbInstructionButton();
        await userEvent.click(add);

        const quickCommandsLength = screen.getByTestId("quickCommandsLength");
        expect(quickCommandsLength.textContent).toBe("0");

        await userEvent.click(screen.getByText("Favorite"));
        expect(quickCommandsLength.textContent).toBe("1");

        await userEvent.click(screen.getByText("Favorite"));
        expect(quickCommandsLength.textContent).toBe("0");        
    });

    it('deletes instruction', async() => {
        render(<TestContextWrapper><InstructionList/></TestContextWrapper>);

        const add = getAddRgbInstructionButton();
        await userEvent.click(add);

        const remove = screen.getByText("Remove");
        await userEvent.click(remove);

        const instructionsLength = screen.getByTestId("instructionsLength");
        expect(instructionsLength.textContent).toBe("0");  
    });

});
