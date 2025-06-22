import { useCallback, useState, type ReactNode } from "react";
import { InstructionsContext } from "../InstructionsContext";
import type { Instruction, InstructionTemplate } from "../instructions/instructionSchema";
import { v4 as uuidv4 } from "uuid";
type TestContextWrapperProps = {
    children: ReactNode;
    instructions?: Instruction[];
    setInstructions?: React.Dispatch<React.SetStateAction<Instruction[]>>;
    quickCommands?: InstructionTemplate[];
    setQuickCommands?: React.Dispatch<React.SetStateAction<InstructionTemplate[]>>;
};

export const TestContextWrapper = ({
    children,
    instructions: instructionsProp,
    setInstructions: setInstructionsProp,
    quickCommands: quickCommandsProp,
    setQuickCommands: setQuickCommandsProp,
}: TestContextWrapperProps) => {
    const [internalInstructions, internalSetInstructions] = useState<Instruction[]>([]);
    const [internalQuickCommands, internalSetQuickCommands] = useState<InstructionTemplate[]>([]);

    const instructions = instructionsProp ?? internalInstructions;
    const setInstructions = setInstructionsProp ?? internalSetInstructions;
    const quickCommands = quickCommandsProp ?? internalQuickCommands;
    const setQuickCommands = setQuickCommandsProp ?? internalSetQuickCommands;

    const addInstructionFromTemplate = useCallback((template: InstructionTemplate) => {
        const instruction: Instruction = {
            id: uuidv4(),
            z_index: 0,
            is_enabled: true,
            targets: null,
            ...template
        }

        setInstructions(prev => [...prev, instruction]);
    }, [setInstructions]);

    // mock
    const addRgbQuickCommand = useCallback(() => {
        const instruction: InstructionTemplate = {
            identifier: "color_static_rgb",
            red: 255,
            green: 127,
            blue: 1,
        }        
        setQuickCommands(prev => [...prev, instruction]);
    }, []);

    const addRgbInstruction = useCallback(() => {
        const instruction: Instruction = {
            identifier: "color_static_rgb",
            id: uuidv4(),
            targets: null,
            z_index: 0,
            is_enabled: true,
            red: 255,
            green: 127,
            blue: 1,
        }        
        setInstructions(prev => [...prev, instruction]);
    }, []);

    return (
        <InstructionsContext.Provider value={{ instructions, setInstructions, quickCommands, setQuickCommands, addInstructionFromTemplate }}>
            <>
                {children}
                <div data-testid="instructions">{JSON.stringify(instructions)}</div>
                <div data-testid="instructionsLength">{instructions.length}</div>
                <div data-testid="quickCommands">{JSON.stringify(quickCommands)}</div>
                <div data-testid="quickCommandsLength">{quickCommands.length}</div>
                <button data-testid="addRgbQuickCommand" onClick={addRgbQuickCommand}>addRgbQuickCommand</button>
                <button data-testid="addRgbInstruction" onClick={addRgbInstruction}>addRgbInstruction</button>
            </>
        </InstructionsContext.Provider>
    );
}