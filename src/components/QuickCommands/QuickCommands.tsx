import { memo } from "react"
import type { CommandMode } from "../../types/command";
import Expandable from "../Expandable";
import CommandButton from "./CommandButton";

export const RGB_COMMAND: CommandMode = "color_static_rgb";
export const KELVIN_COMMAND: CommandMode = "color_static_kelvin";
export const ALPHA_COMMAND: CommandMode = "alpha_static";
export const GAMMA_COMMAND: CommandMode = "gamma_static";

function QuickCommands() {
    return (
        <Expandable title="Presets" isInitiallyExpanded={false}>
            <h3>Color</h3>
            <div className="flex flex-row flex-wrap gap-1 mb-4">
                <CommandButton mode={RGB_COMMAND} parameters={{ red: 255, green: 255, blue: 255 }} color="whitesmoke" text="White"/>
                <CommandButton mode={RGB_COMMAND} parameters={{ red: 255, green: 0, blue: 0 }} color="orangered" text="Red"/>
                <CommandButton mode={RGB_COMMAND} parameters={{ red: 0, green: 255, blue: 0 }} color="forestgreen" text="Green"/>
                <CommandButton mode={RGB_COMMAND} parameters={{ red: 0, green: 0, blue: 255 }} color="dodgerblue" text="Blue"/>
                <div className="basis-full"></div>
                <CommandButton mode={KELVIN_COMMAND} parameters={{ kelvin: 2000 }} color="darkorange" text="2000K"/>
                <CommandButton mode={KELVIN_COMMAND} parameters={{ kelvin: 3000 }} color="khaki" text="3000K"/>
                <CommandButton mode={KELVIN_COMMAND} parameters={{ kelvin: 4000 }} color="whitesmoke" text="4000K"/>
                <CommandButton mode={KELVIN_COMMAND} parameters={{ kelvin: 5000 }} color="lightcyan" text="5000K"/>
                <CommandButton mode={KELVIN_COMMAND} parameters={{ kelvin: 6000 }} color="powderblue" text="6000K"/>
            </div>

            <h3>Alpha</h3>
            <div className="flex flex-row flex-wrap gap-1 mb-4">
                <CommandButton mode={ALPHA_COMMAND} parameters={{ alpha: 1.00 }} color="#FFFFFFFF" text="100%"/>
                <CommandButton mode={ALPHA_COMMAND} parameters={{ alpha: 0.75 }} color="#FFFFFFC8" text="75%"/>
                <CommandButton mode={ALPHA_COMMAND} parameters={{ alpha: 0.50 }} color="#FFFFFF92" text="50%"/>
                <CommandButton mode={ALPHA_COMMAND} parameters={{ alpha: 0.25 }} color="#FFFFFF5B" text="25%"/>
                <CommandButton mode={ALPHA_COMMAND} parameters={{ alpha: 0.00 }} color="#FFFFFF24" text="0%"/>
            </div>

            <h3>Gamma</h3>
            <div className="flex flex-row flex-wrap gap-1 mb-4">
                <CommandButton mode={GAMMA_COMMAND} parameters={{ gamma: 1.0 }} color="#FFFFFFFF" text="1.0"/>
                <CommandButton mode={GAMMA_COMMAND} parameters={{ gamma: 2.2 }} color="#FFFFFFC8" text="2.2"/>
                <CommandButton mode={GAMMA_COMMAND} parameters={{ gamma: 2.4 }} color="#FFFFFF92" text="2.4"/>
                <CommandButton mode={GAMMA_COMMAND} parameters={{ gamma: 2.6 }} color="#FFFFFF5B" text="2.6"/>
                <CommandButton mode={GAMMA_COMMAND} parameters={{ gamma: 2.8 }} color="#FFFFFF24" text="2.8"/>
            </div>
        </Expandable>
    )
}

export default memo(QuickCommands);
