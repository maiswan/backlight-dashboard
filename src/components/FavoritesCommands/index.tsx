import type { InstructionTemplate } from "../../instructions/instructionSchema";
import { useCallback } from "react";
import { useInstructionsContext } from "../../InstructionsContext";


export default function QuickCommands() {

    const { quickCommands, setQuickCommands, addInstructionFromTemplate } = useInstructionsContext();

    const removeInstruction = useCallback((template: InstructionTemplate) => {
        setQuickCommands(prev => prev.filter(x => x !== template));
    }, []);

    return (
        <>
            <h2>Favorites</h2>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
                {[... new Set(quickCommands)].map((x, index) =>
                    <div className="flex flex-row">
                        <button key={index} onClick={() => addInstructionFromTemplate(x)}>
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