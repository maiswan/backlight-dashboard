import toast from "react-hot-toast";
import type { Instruction } from "../instructions/instructionSchema";

const UNPROCESSABLE_ENTITY = 422;
const INSTRUCTION_PATH = "api/v1/instructions";

type FastApiErrorWrapper = {
    detail: FastApiError[]
}

type FastApiError = {
    input: string,
    loc: string[],
    msg: string,
}

const fastApiErrorToString = (json: FastApiError): string => {
    const loc = json.loc.slice(-2).join(".");
    const msg = json.msg;
    const input = json.input;

    return `${loc}: ${msg} (currently ${input})`;
}

export default function useHttpEndpoint(server: string) {

    const putInstructions = async (instructions: Instruction[]) => {

        const ordered = instructions.map((x, index) => ({
            ...x,
            z_index: index * 10 // reset z-index based on UI display order
        }));

        try {
            const response = await fetch(`${server}/${INSTRUCTION_PATH}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ordered)
            })

            if (response.ok) {
                toast.success("Instructions applied");
                return;
            }

            // There has been an error
            const json: FastApiErrorWrapper = await response.json();

            // Invalid input (HTTP 422)
            if (response.status === UNPROCESSABLE_ENTITY) {
                const errors = json?.detail.map(fastApiErrorToString);
                errors?.forEach(x => toast.error(x));
                return;
            }

            toast.error("Unknown error");
            console.error(json);
            return;

        } catch (error) {
            toast.error("Network error");
            console.error(error);
        }
    }

    return { putInstructions };
}