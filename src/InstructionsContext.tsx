import { createContext, useContext } from "react";
import type { Instruction, InstructionTemplate } from "./instructions/instructionSchema";

export type InstructionsContextType = {
    instructions: Instruction[];
    setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
    quickCommands: InstructionTemplate[];
    setQuickCommands: React.Dispatch<React.SetStateAction<InstructionTemplate[]>>;
    addInstructionFromTemplate: (v: InstructionTemplate) => void;
};

export const InstructionsContext = createContext<InstructionsContextType | undefined>(undefined);

export function useInstructionsContext() {
    const context = useContext(InstructionsContext);
    if (!context) throw new Error("useInstructionsContext must be used within InstructionsProvider");
    return context;
}