import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NIL } from "uuid";
import { useState } from 'react';
import type { Instruction } from '../../instructions/instructionSchema';
import InstructionEditor from './InstructionEditor';

describe('InstructionEditor', () => {
    const kelvinInstruction: Instruction = {
        identifier: "color_static_kelvin",
        id: NIL,
        z_index: 12,
        targets: null,
        is_enabled: true,
        kelvin: 1200,
    }

    const KELVIN_MIN = "1000";
    const KELVIN_MAX = "12000";
    const KELVIN_STEP = "100";

    const NumberTestWrapper = () => {
        const [instruction, setInstruction] = useState(kelvinInstruction);

        return (<>
            <InstructionEditor instruction={instruction} setInstruction={setInstruction}/>
            <div data-testid="instruction">{JSON.stringify(instruction)}</div>
        </>);
    }

    it('renders number textbox', async () => {
        render(<NumberTestWrapper />);
        const instructionTypes = screen.getByRole<HTMLSelectElement>("combobox")
        expect(instructionTypes).toBeInTheDocument();
        expect(instructionTypes.options.length).toBeGreaterThan(0);

        const textbox = screen.getByRole<HTMLInputElement>("spinbutton");
        expect(textbox).toBeInTheDocument();
        expect(textbox.min).toBe(KELVIN_MIN);
        expect(textbox.max).toBe(KELVIN_MAX);
        expect(textbox.step).toBe(KELVIN_STEP);
    });

    it('updates fields', async () => {
        render(<NumberTestWrapper />);

        const textbox = screen.getByRole("spinbutton");
        await userEvent.clear(textbox);
        await userEvent.type(textbox, "2400");
        
        const instruction = JSON.parse((await screen.findByTestId("instruction")).textContent ?? "");
        expect(instruction).toEqual(
            expect.objectContaining({
                id: NIL,
                identifier: "color_static_kelvin",
                targets: null,
                is_enabled: true,
                z_index: 12,
            })
        )
    })

    it('changes instruction type', async () => {
        render(<NumberTestWrapper />);

        // Try to change to alpha_pulse
        const instructionTypeElement = screen.getByRole("combobox");
        await userEvent.selectOptions(instructionTypeElement, "alpha_pulse");
        expect(await screen.findByText("alpha_pulse")).toBeInTheDocument();
        
        const instruction = JSON.parse((await screen.findByTestId("instruction")).textContent ?? "");
        expect(instruction).toEqual(
            expect.objectContaining({
                id: NIL,
                identifier: "alpha_pulse",
                targets: null,
                is_enabled: true,
                z_index: 12,
            })
        )
    });
});
