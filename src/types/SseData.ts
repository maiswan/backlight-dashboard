import type { Command } from "./command";

export type SseData = {
    led_count: number,
    pixel_order: string,
    gpio_pin: number,
    fps: number,
    commands: Command[],
}