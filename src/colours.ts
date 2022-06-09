import { Color } from "three";
import { pick } from "./randomUtils";

export function randomColour(): Color {
    const palette = [
        "#1b325f",
        "#9cc4e4",
        "#e9f2f9",
        "#3a89c9",
        "#f26c4f"
    ]
    return new Color(pick(palette));
}