import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickCommands from '.';
import { TestContextWrapper } from '../contextTestHelper';
import userEvent from '@testing-library/user-event';

describe('QuickCommands', () => {

    const expectedButtonTexts = ["White", "Red", "Green", "Blue", "White ½", "Red ½", "Green ½", "Blue ½", "1.0", "0.8", "0.6", "0.4", "0.2", "0.0", "1.1", "1.8", "2.2", "2.4", "2.6", "2.8", "3000", "4000", "5000", "6000", "6500", "7000"];

    it('renders', async () => {
        render(<TestContextWrapper children={<QuickCommands />} />);

        for (const text of expectedButtonTexts) {
            const element = await screen.findByText(text);
            expect(element).toBeInTheDocument();
        }
    });

    it('expands', async () => {
        render(<TestContextWrapper children={<QuickCommands />} />);

        const expanderIcon = screen.getByTestId("expanderIcon");
        const expander = screen.getByTestId("expander");

        expect(expanderIcon).toHaveClass('rotate-90');
        expect(expander).toHaveClass('expandable');

        await userEvent.click(expanderIcon);

        expect(expander).toHaveClass('expandable');
        expect(expander).toHaveClass('expanded');
    });

    it('calls setInstructions', async () => {
        render(<TestContextWrapper children={<QuickCommands />} />);

        const instructionsLength = screen.getByTestId("instructionsLength");
            console.log(instructionsLength.textContent);

        // instructions.length should increment when a button is pressed
        for (let i = 0; i < expectedButtonTexts.length; i++) {
            const element = await screen.findByText(expectedButtonTexts[i]);
            await userEvent.click(element);
            expect(instructionsLength.textContent).toBe((i + 1).toString());
        }
    });
});
