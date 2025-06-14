export type InstructionRoot = {
    [instructionType: string]: Field[]
}

export interface Field {
    name: string
    type: "int" | "float" | "color"
    min?: number
    max?: number
}

export interface Instruction {
    identifier: string
    id: string
    z_index: number
    is_enabled: boolean
    targets: int[] | null | undefined
    [key: string]: unknown
}

// A InstructionTemplate represents the key elements of an instruction:
// - type
// - instruction-specific data
// The template ignores setup-specific properties like UUID, so it is suitable for storage for favorite instructions
export type InstructionTemplate = {
    identifier: string,
    [ key: string ]: unknown,
}