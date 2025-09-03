import toast from "react-hot-toast";
import type { Command } from "../types/command";

const UNPROCESSABLE_ENTITY = 422;
const COMMAND_PATH = "api/v2/commands";

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

    const putCommands = async (commands: Command[]) => {

        const ordered = commands.map((x, index) => ({
            ...x,
            z_index: index * 10 // reset z-index based on UI display order
        }));

        try {
            const response = await fetch(`${server}/${COMMAND_PATH}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ordered)
            })

            if (response.ok) {
                toast.success("Commands applied");
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

    return { putCommands };
}