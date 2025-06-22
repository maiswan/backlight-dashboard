import kelvin2rgb from "./kelvin2rgb";
import { useState } from "react";
import { useInstructionsContext } from "../../InstructionsContext";

export default function QuickCommands() {

    const { addInstructionFromTemplate } = useInstructionsContext();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className="flex flex-row gap-2 pb-2 mb-0 items-center" onClick={() => setIsExpanded(prev => !prev)}>
                <div data-testid="expanderIcon" className={`${isExpanded ? "rotate-180" : "rotate-90"} transition-transform duration-200`}>&#9650;</div>
                <h2 className="mb-0!">Quick Commands</h2>
            </div>
            <div data-testid="expander" className={`flex flex-wrap gap-1 expandable ${isExpanded ? 'expanded' : ''}`}>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 255, green: 255, blue: 255 })}>
                    <div className="bg-white h-[1rem] w-[1rem] rounded-full" />
                    <div className="">White</div>
                </button>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 255, green: 0, blue: 0 })}>
                    <div className="bg-red-500 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">Red</div>
                </button>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 0, green: 255, blue: 0 })}>
                    <div className="bg-green-500 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">Green</div>
                </button>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 0, green: 0, blue: 255 })}>
                    <div className="bg-blue-500 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">Blue</div>
                </button>
                <div className="basis-full h-0" />
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 127, green: 127, blue: 127 })}>
                    <div className="bg-white/50 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">White &#189;</div>
                </button>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 127, green: 0, blue: 0 })}>
                    <div className="bg-red-500/50 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">Red &#189;</div>
                </button>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 0, green: 127, blue: 0 })}>
                    <div className="bg-green-500/50 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">Green &#189;</div>
                </button>
                <button className="basis-24/100 flex flex-row items-center gap-x-2"
                    onClick={() => addInstructionFromTemplate({ identifier: "color_static_rgb", red: 0, green: 0, blue: 127 })}>
                    <div className="bg-blue-500/50 h-[1rem] w-[1rem] rounded-full" />
                    <div className="">Blue &#189;</div>
                </button>
                <div className="basis-full">Alpha &alpha;</div>
                {
                    [1, 0.8, 0.6, 0.4, 0.2, 0].map(x => <button key={x} className="basis-16/100 flex flex-row items-center gap-x-2"
                        onClick={() => addInstructionFromTemplate({ identifier: "alpha_static", alpha: x })}>
                        <div className="bg-white h-[1rem] w-[1rem] rounded-full" style={{ opacity: x }} />
                        <div className="">{x.toFixed(1)}</div>
                    </button>)
                }

                <div className="basis-full">Gamma &gamma;</div>
                {
                    [1.1, 1.8, 2.2, 2.4, 2.6, 2.8].map(x => <button key={x} className="basis-16/100 flex flex-row items-center gap-x-2"
                        onClick={() => addInstructionFromTemplate({ identifier: "gamma_static", gamma: x })}>
                        <div className="bg-white h-[1rem] w-[1rem] rounded-full" style={{ opacity: 1 - (x - 1) / 2.8 }} />
                        <div className="">{x.toFixed(1)}</div>
                    </button>)
                }

                <div className="basis-full">Color Temperature K</div>
                {
                    [3000, 4000, 5000, 6000, 6500, 7000].map(x => <button key={x} className="basis-16/100 flex flex-row items-center gap-x-2"
                        onClick={() => addInstructionFromTemplate({ identifier: "color_static_kelvin", kelvin: x })}>
                        <div className="bg-white h-[1rem] w-[1rem] rounded-full" style={{ backgroundColor: kelvin2rgb(x) }} />
                        <div className="">{x}</div>
                    </button>)
                }
            </div>
        </>
    )
}