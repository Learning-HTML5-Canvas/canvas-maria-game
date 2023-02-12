import Graphic from "./Graphic";
import { DimensionType, Vector2 } from "./types";
import World from "./World";


export default class Platform extends Graphic {
    static xSpawnOffset: number = 200;
    static yOffset: number = 455;
    constructor(position: Vector2, dimension: DimensionType, image: HTMLImageElement, world: World) {
        super(position, dimension, { image: image }, world);
    }


    update() {

        this.draw()
    }
}