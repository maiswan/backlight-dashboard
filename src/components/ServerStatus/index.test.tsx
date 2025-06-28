import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import ServerStatus from '.';
import { TestContextWrapper } from '../contextTestHelper';
import { vi } from 'vitest';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
    success: vi.fn(),
    error: vi.fn(),
}));


describe('ServerStatus', async () => {

    beforeAll(() => {
        // @ts-expect-error: Mock EventSource since it doesn't exist in Node.js
        global.EventSource = class {
            constructor() {}
            close() {}
            addEventListener() {}
            removeEventListener() {}
            onerror = null;
            onmessage = null;
            onopen = null;
        };
    });

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders', async () => {
        render(<TestContextWrapper children={<ServerStatus server=""/>}/>);
        expect(await screen.findByText("Last updated")).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Apply"})).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Add instruction"})).toBeInTheDocument();
    });

    it('adds a new instruction', async () => {
        render(<TestContextWrapper children={<ServerStatus server=""/>}/>);
        const add = screen.getByRole("button", { name: "Add instruction" });

        expect(screen.getByTestId("instructionsLength").textContent).toBe("0");
        await userEvent.click(add);
        expect(screen.getByTestId("instructionsLength").textContent).toBe("1");
    })
});