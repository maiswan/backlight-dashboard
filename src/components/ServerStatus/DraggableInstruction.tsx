import { type Instruction, type InstructionTemplate } from "../../instructions/instructionSchema";
import InstructionEditor from "./InstructionEditor";
import { useCallback, useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useInstructionsContext } from "../../InstructionsContext";

type DraggableInstructionProps = {
    instruction: Instruction;
    index: number;
    maxIndex: number;
    moveInstruction: (from: number, to: number) => void;
    deleteInstruction: (instruction: Instruction) => void;
    setInstruction: (instruction: Instruction) => void;
};

const INSTRUCTION_MIN_KEY_COUNT = 5;
// [identifier, id, z_index, is_enabled, targets].length

const instructionTotemplate = (instruction: Instruction): InstructionTemplate => {
    const output = JSON.parse(JSON.stringify(instruction));
    delete output.id;
    delete output.z_index;
    delete output.is_enabled;
    delete output.targets;
    return output;
}

// for each template, check whether all properties' string values match with target
const contains = (templates: InstructionTemplate[], target: InstructionTemplate) => {
    return templates.some(template => {
        const keys = Object.keys(template);
        return keys.every(key => 
            String(template[key]) === String(target[key])
        );
    });
}

// https://zenn.dev/wintyo/articles/d39841c63cc9c9
export default function DraggableInstruction({ instruction, index, maxIndex, moveInstruction, deleteInstruction, setInstruction }: DraggableInstructionProps) {

    const {
        isDragging,
        setActivatorNodeRef,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: instruction.id });

    const { quickCommands, setQuickCommands } = useInstructionsContext();
    const [isEditorExpanded, setIsEditorVisible] = useState(false);
    
    // don't show the UUID (too long) and already-shown properties in frontend
    const summary = useMemo(() => {
        const identifier = instruction.identifier;
        const parameters = Object
            .entries(instruction)
            .filter(([k,]) => k !== "id")
            .filter(([k,]) => k !== "identifier")
            .filter(([k,]) => k !== "targets")
            .filter(([k,]) => k !== "z_index")
            .filter(([k,]) => k !== "is_enabled")
            .map(([k, v]) => `${k}=${v}`)
            .join(", ");
        return `${identifier}(${parameters})`;
    }, [instruction]);

    const isFavorite = useMemo(() => {
        const template = instructionTotemplate(instruction);
        return contains(quickCommands, template);
    }, [instruction, quickCommands]);

    const toggleInstruction = useCallback(() => {
        const newInstruction = {...instruction, is_enabled: !instruction.is_enabled};
        setInstruction(newInstruction);
    }, [instruction, setInstruction]);

    const toggleFavorites = useCallback(() => {
        const template = instructionTotemplate(instruction);

        if (isFavorite) {
            const templateJson = JSON.stringify(template);
            setQuickCommands(prev => prev.filter(x => JSON.stringify(x) !== templateJson));
            return;
        }
        
        setQuickCommands(prev => [...prev, template]);

    }, [instruction, isFavorite, setQuickCommands])

    return (
        <div ref={setNodeRef}
            className={`ItemWrapper ${isDragging ? '_active' : ''} instruction`}
            style={{ transform: CSS.Translate.toString(transform), transition }}>

            <div className={`flex flex-row items-center gap-x-4 pr-4 ${isEditorExpanded ? "border-b-1 border-neutral-500" : "border-transparent"} transition-border duration-200`} onClick={() => setIsEditorVisible(prev => !prev)}>

                <div ref={setActivatorNodeRef}
                    className={`mdi mdi-drag ${isDragging ? "cursor-grabbing" : "cursor-pointer"} self-stretch content-center p-4`}
                    {...attributes} {...listeners}
                >&#8942;&#8942;</div>
                <div className={`${isEditorExpanded ? "rotate-180" : "rotate-90"} transition-transform duration-200 mx-0`}>&#9650;</div>
                <div className="flex-1 font-mono">{summary}</div>
                <div className="flex flex-row gap-1" onClick={(e) => e.stopPropagation()}>
                    <button className={`min-w-24 ${isFavorite && "bg-fuchsia-200/20 border-fuchsia-200!"}`} disabled={Object.keys(instruction).length <= INSTRUCTION_MIN_KEY_COUNT} onClick={toggleFavorites}>Favorite</button>
                    <button className={`min-w-24 ${instruction.is_enabled && "bg-fuchsia-200/20 border-fuchsia-200!"}`} onClick={toggleInstruction}>{instruction.is_enabled ? "Enabled" : "Disabled"}</button>

                    {/* swap disabled and indicies property rule since flex-col-reverse */}
                    <button onClick={() => moveInstruction(index, index + 1)} disabled={index === maxIndex}>&uarr;</button>
                    <button onClick={() => moveInstruction(index, index - 1)} disabled={index === 0}>&darr;</button>
                    <button className="min-w-24" onClick={() => deleteInstruction(instruction)}>Remove</button>
                </div>
            </div>

            <div className={`expandable ${isEditorExpanded ? 'expanded' : ''}`}>
                <div className="ml-16 my-4">
                    <InstructionEditor instruction={instruction} setInstruction={setInstruction} />
                </div>
            </div>
        </div>
    );
}