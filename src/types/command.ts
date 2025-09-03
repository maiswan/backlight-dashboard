import CommandSchemaJson from "./commandSchema.json";

export const CommandSchema = CommandSchemaJson as Record<CommandMode, CommandField[]>; 

export interface CommandField {
    name: string
    type: "int" | "float"
    min?: number
    max?: number
    step?: number
}

export type CommandMode = keyof typeof CommandSchemaJson;
export const CommandModes = Object.keys(CommandSchemaJson) as CommandMode[];

export interface Command {
    mode: CommandMode;
    name: string;
    id: string;
    z_index: number;
    is_enabled: boolean;
    targets: string;
    [key: string]: unknown;
}

// A CommandTemplate represents the key elements of an command:
// - type
// - command-specific data
// The template ignores setup-specific properties like UUID, so it is suitable for storage for favorite commands
export type CommandTemplate = {
    mode: CommandMode,
    targets: string,
    [key: string]: unknown;
}
