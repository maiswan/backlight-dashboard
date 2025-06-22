import { useCallback, useEffect } from "react";
import useHttpEndpoint from "../../hooks/useHttpEndpoint";
import { v4 as uuidv4 } from "uuid";
import { useInstructionsContext } from "../../InstructionsContext";
import useSseEndpoint from "../../hooks/useSseEndpoint";
import InstructionList from "./InstructionList";

export default function ServerStatus({ server }: { server: string }) {

    const { instructions, setInstructions } = useInstructionsContext();
    const { postResetInstruction } = useHttpEndpoint(server);

    const { instructions: serverInstructions, lastPing } = useSseEndpoint(server);

    useEffect(() => {
        setInstructions(serverInstructions);
    }, [serverInstructions]);

    const newInstruction = () => {
        setInstructions(prev => [...prev, {
            identifier: "gamma_static",
            z_index: 0,
            id: uuidv4(),
            is_enabled: true,
            targets: null,
        }]);
    }

    const postInstructions = useCallback(async () => {
        await postResetInstruction(instructions);
    }, [instructions, postResetInstruction]);

    return (
        <>
            <h2>Server Status</h2>
            <p className="mb-4">Last updated {lastPing?.toISOString()}</p>
            <InstructionList/>
            <div className="flex flex-row gap-1 [&>button]:min-w-48 justify-end">
                <button onClick={postInstructions}>Apply</button>
                <button onClick={newInstruction}>Add instruction</button>
            </div>
        </>
    )
}