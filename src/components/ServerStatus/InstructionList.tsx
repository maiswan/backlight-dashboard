import DraggableInstruction from "./DraggableInstruction";
import { useCallback } from "react";
import { type Instruction } from "../../instructions/instructionSchema";
import { useInstructionsContext } from "../../InstructionsContext";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export default function InstructionList() {

    const { instructions, setInstructions } = useInstructionsContext();

    const moveInstruction = useCallback((from: number, to: number) => {
        setInstructions(prev => arrayMove(prev, from, to));
    }, []);

    const deleteInstruction = useCallback((instruction: Instruction) => {
        setInstructions(prev => prev.filter(x => x.id !== instruction.id))
    }, []);

    const setInstruction = useCallback((instruction: Instruction) => {
        setInstructions(prev => prev.map(x =>
            x.id === instruction.id ? instruction : x
        ));
    }, []);

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={(event) => {
                const { active, over } = event;
                if (over == null || active.id === over.id) { return; }
                const oldIndex = instructions.findIndex(x => x.id === active.id);
                const newIndex = instructions.findIndex(x => x.id === over.id);
                moveInstruction(oldIndex, newIndex);
            }}
        >
            <SortableContext items={instructions}>
                <div className="flex flex-col-reverse gap-y-1">
                    {instructions.map((x, index) => (
                        <DraggableInstruction key={x.id} instruction={x} index={index} maxIndex={instructions.length - 1} moveInstruction={moveInstruction} deleteInstruction={deleteInstruction} setInstruction={setInstruction} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}