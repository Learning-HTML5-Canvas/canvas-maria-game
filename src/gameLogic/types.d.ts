export interface Vector2 {
    x: number;
    y: number;
}

export interface DimensionType {
    width: number;
    height: number;
    color?: string
}

export interface GraphicOthers {
    color?: string,
    image?: HTMLImageElement
}

export type CharacterMovement = "Left" | "Right" | "Up" | "Down" | "None"