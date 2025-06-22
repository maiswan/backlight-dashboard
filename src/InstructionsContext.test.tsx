import { useInstructionsContext } from "./InstructionsContext";
import { render } from "@testing-library/react";

describe('InstructionContext', async () => {
    it('throws an exception when used outside a provider', async () => {
        const TestWrapper = () => {
            const context = useInstructionsContext();
            return <div data-testid="output">{JSON.stringify(context.instructions)}</div>;
        }

        expect(() => render(<TestWrapper/>)).toThrow();
    });
});