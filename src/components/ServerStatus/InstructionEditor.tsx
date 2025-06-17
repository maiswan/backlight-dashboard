import { useEffect, useState } from "react";
import type { Field, Instruction } from "../../instructions/instructionSchema";
import instructionSchema from '../../instructions/instructionSchema.json';

interface InstructionEditorProps {
    instruction: Instruction;
    setInstruction: (v: Instruction) => void
}

export default function InstructionEditor({ instruction, setInstruction }: InstructionEditorProps) {

    const [fields, setFields] = useState<Field[]>([]);
    const [data, setData] = useState<Record<string, unknown>>({});
    
    // Initialize
    useEffect(() => {
        const identifier = instruction.identifier as keyof typeof instructionSchema
        setFields(instructionSchema[identifier] as Field[]);
        setData(instruction);
    }, []);

    // Writeback
    useEffect(() => {
        setInstruction({
            ...data,
            identifier: instruction.identifier,
            id: instruction.id,
            z_index: instruction.z_index,
            is_enabled: instruction.is_enabled,
            targets: instruction.targets
        });
    }, [data]);

    const changeInstructionType = (instructionType: keyof typeof instructionSchema) => {
        setFields(instructionSchema[instructionType] as Field[]);
        setData({});
        setInstruction(({
            identifier: instructionType as keyof typeof instructionSchema,
            id: instruction.id,
            z_index: instruction.z_index,
            is_enabled: instruction.is_enabled,
            targets: instruction.targets
        }));
    }

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center mb-4">
                <div className="basis-1/8">Instruction</div>
                <select className="basis-1/3" value={instruction.identifier} onChange={(e) => changeInstructionType(e.target.value as keyof typeof instructionSchema)}>
                    {
                        Object.keys(instructionSchema).map(x => <option key={x}>{x}</option>)
                    }
                </select>
            </div>
            {
                fields.map(x =>
                    <div key={x.name} className="flex flex-row items-center">
                        <div className="basis-1/8 font-mono">{x.name}</div>
                        {
                            x.type === "color"
                                ? <input type="color" className="basis-1/3 h-10" value={data[x.name] as string} onChange={e => setData(prev => ({ ...prev, [x.name]: e.target.value }))} />
                                : <input type="number" className="basis-1/3" min={x.min} max={x.max} value={data[x.name] as number} onChange={e => setData(prev => ({ ...prev, [x.name]: e.target.value }))} />
                        }
                    </div>
                )
            }
        </div>    )
}