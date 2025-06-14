import { useState, useEffect, useRef, useCallback, type Dispatch, type SetStateAction } from "react";
import type { Config } from "./config";
import toast from "react-hot-toast";
import DraggableInstruction from "./DraggableInstruction";
import type { Instruction, InstructionTemplate } from "../../instructions/instructionSchema";
import useHttpEndpoint from "../../hooks/useHttpEndpoint";
import { v4 as uuidv4 } from "uuid";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface ServerStatusProps {
    server: string,
    instructions: Instruction[],
    setInstructions: Dispatch<SetStateAction<Instruction[]>>;
    quickCommands: InstructionTemplate[];
    setQuickCommands: Dispatch<SetStateAction<InstructionTemplate[]>>;
}

export default function ServerStatus({ server, instructions, setInstructions, quickCommands, setQuickCommands }: ServerStatusProps) {
    const hasOfflineToast = useRef(false); // avoid spamming "server offline"
    const [lastPing, setLastPing] = useState<Date | null>(null);
    const { postResetInstruction } = useHttpEndpoint(server);

    useEffect(() => {
        setInstructions([]);
        const source = new EventSource(`${server}/state?stream=true`);

        source.onmessage = (e) => {
            try {
                const config: Config = JSON.parse(e.data);

                setInstructions(config.instructions);
                setLastPing(new Date())
            } catch {
                toast.error("Failed to parse server response");
            }
        };

        source.onopen = () => {
            toast.success("Connected to server.");
            hasOfflineToast.current = false;
        };

        source.onerror = () => {
            if (!hasOfflineToast.current) {
                hasOfflineToast.current = true;
                toast.error("Server offline.");
            }
        };

        return () => source.close();
    }, [server]);


    const moveInstruction = useCallback((from: number, to: number) => {
        setInstructions(prev => arrayMove(prev, from, to));
    }, []);

    const newInstruction = () => {
        setInstructions(prev => [...prev, {
            identifier: "gamma_static",
            z_index: instructions.length * 10,
            id: uuidv4(),
            is_enabled: true,
            targets: null,
        }]);
    }

    const deleteInstruction = useCallback((instruction: Instruction) => {
        setInstructions(prev => prev.filter(x => x.id !== instruction.id))
    }, []);

    const toggleInstruction = useCallback((instruction: Instruction) => {
        setInstructions(prev => prev.map(x =>
            x.id === instruction.id ? { ...x, is_enabled: !x.is_enabled } : x
        ));
    }, []);

    const setInstruction = useCallback((instruction: Instruction) => {
        setInstructions(prev => prev.map(x =>
            x.id === instruction.id ? instruction : x
        ));
    }, []);

    const postInstructions = useCallback(async () => {
        await postResetInstruction(instructions);
    }, [postResetInstruction, instructions]);

    return (
        <>
            <h2>Server Status</h2>
            <p className="mb-4">Last updated {lastPing?.toISOString()}</p>
            <div className="space-y-1">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={(event) => {
                        const { active, over } = event;
                        if (over == null || active.id === over.id) {
                            return;
                        }
                        const oldIndex = instructions.findIndex(x => x.id === active.id);
                        const newIndex = instructions.findIndex(x => x.id === over.id);
                        const newInstruction = arrayMove(instructions, oldIndex, newIndex);
                        setInstructions(newInstruction);
                    }}
                >
                    <SortableContext items={instructions}>
                        <div className="flex flex-col-reverse gap-y-1">
                            {instructions.map((x, index) => (
                            <DraggableInstruction key={x.id} instruction={x} index={index} maxIndex={instructions.length - 1} moveInstruction={moveInstruction} deleteInstruction={deleteInstruction} toggleInstruction={toggleInstruction} setInstruction={setInstruction} quickCommands={quickCommands} setQuickCommands={setQuickCommands} />
                        ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <div className="flex flex-row gap-1 [&>button]:min-w-48 justify-end">
                <button onClick={postInstructions}>Apply</button>
                <button onClick={newInstruction}>Add instruction</button>
            </div>
        </>
    )
}