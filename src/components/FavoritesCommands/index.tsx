import type { Instruction, InstructionTemplate } from "../../instructions/instructionSchema";
import { v4 as uuidv4 } from "uuid";
import { useCallback, type Dispatch, type SetStateAction } from "react";

interface FavoritesCommandsProps {
    quickCommands: InstructionTemplate[]
    setQuickCommands: Dispatch<SetStateAction<InstructionTemplate[]>>
    setInstructions: Dispatch<SetStateAction<Instruction[]>>;
}

export default function QuickCommands({ quickCommands, setQuickCommands, setInstructions }: FavoritesCommandsProps) {

    const removeInstruction = useCallback((template: InstructionTemplate) => {
        setQuickCommands(prev => prev.filter(x => x !== template));
    }, []);

    const addInstruction = useCallback((template: InstructionTemplate) => {
        const instruction: Instruction = {
            id: uuidv4(),
            z_index: 0,
            is_enabled: true,
            targets: null,
            ...template
        }

        setInstructions(prev => [...prev, instruction]);
    }, [setInstructions]);

    return (
        <>
            <h2>Favorites</h2>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
                {[... new Set(quickCommands)].map((x, index) =>
                    <div className="flex flex-row">
                        <button key={index} onClick={() => addInstruction(x)}>
                        <div className="">
                            {x.identifier}({
                                Object.entries(x).map(([k, v], index) => k !== "identifier" && <span key={index}>{k}={v as string}{index !== Object.entries(x).length - 1 && ", "}</span>)
                            })
                        </div>
                    </button>
                    <button onClick={() => removeInstruction(x)} className="">X</button>
                    </div>
                )}
            </div>
        </>
    )
}