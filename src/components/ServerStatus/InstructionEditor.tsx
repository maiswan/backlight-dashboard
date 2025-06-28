import { Fragment, useEffect, useState } from "react";
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
        <div className="grid grid-cols-[6rem_18rem_auto] gap-4">
            {/* Instruction type */}
            <div>Instruction</div>
            <select className="basis-1/3" value={instruction.identifier} onChange={(e) => changeInstructionType(e.target.value as keyof typeof instructionSchema)}>
                {
                    Object.keys(instructionSchema).map(x => <option key={x}>{x}</option>)
                }
            </select>
            <div></div>
            {/* Fields */}
            {
                fields.map(x =>
                    <Fragment key={x.name}>
                        <div className="font-mono">{x.name}</div>
                        <input className="font-mono" type="number" min={x.min} max={x.max} step={x.step} value={data[x.name] as number} onChange={e => setData(prev => ({ ...prev, [x.name]: e.target.value }))} />
                        <div className="font-mono">{x.min == null ? "(-∞" : `[${x.min}`}, {x.max == null ? "∞)" : `${x.max}]`}</div>
                    </Fragment>
                )
            }

        </div>

        // <div className="flex flex-col space-y-2">
        //     <div className="flex flex-row items-center mb-4 gap-4">
        //         <div>Instruction</div>
        //         <select className="basis-1/3" value={instruction.identifier} onChange={(e) => changeInstructionType(e.target.value as keyof typeof instructionSchema)}>
        //             {
        //                 Object.keys(instructionSchema).map(x => <option key={x}>{x}</option>)
        //             }
        //         </select>
        //         <div>Range</div>
        //     </div>
        //     {
        //         fields.map(x =>
        //             <div key={x.name} className="flex flex-row items-center gap-4 font-mono">
        //                 <div>{x.name}</div>
        //                 <input type="number" className="basis-1/3" min={x.min} max={x.max} step={x.step} value={data[x.name] as number} onChange={e => setData(prev => ({ ...prev, [x.name]: e.target.value }))} />
        //                 <div>{x.min == null ? "(-∞" : `[${x.min}`}, {x.max == null ? "∞)" : `${x.max}]`}</div>
        //             </div>
        //         )
        //     }
        // </div>
    );
}