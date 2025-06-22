import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import ServerInput from ".";
import { useState } from 'react';

describe('ServerInput', () => {
    it('renders', () => {
        const server = "foobar";

        render(<ServerInput server={server} setServer={vi.fn()} />);
        const input = screen.getByRole<HTMLInputElement>("textbox");
        expect(input.value).toBe(server);
    });

    it('calls setServer with input value when the "Reconnect" button is pressed', async () => {
            
        const expected_initial = "";
        const expected_final = "foobar";

        const TestWrapper = () => {
            const [server, setServer] = useState(expected_initial);

            return <>
                <ServerInput server={server} setServer={setServer}/>
                <div data-testid="server-value">{server}</div>
            </> 
        }

        render(<TestWrapper/>);
    
        const input = screen.getByRole("textbox");
        const reconnect = screen.getByRole("button");
        const actual = screen.getByTestId("server-value");

        // {server} should not change until button is pressed (debouncing)
        await userEvent.type(input, expected_final)
        expect(actual.textContent).toBe("");

        // {server} should update now
        await userEvent.click(reconnect);
        expect(actual.textContent).toBe(expected_final);
    });
});
