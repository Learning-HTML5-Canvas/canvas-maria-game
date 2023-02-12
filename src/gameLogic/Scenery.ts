import Graphic from "./Graphic";
import backgroundImage from "@assets/background.png"
import hillsImage from "@assets/hills.png"
import World from "./World";
import { generateImage } from "./utils/chunks";
import { randomInitFromRange } from "./utils/mathCal";
import Platform from "./Platform";


export default class Scenery {
    static hillsXMovementSpeed: number = 3;
    private canvas: HTMLCanvasElement;
    private world: World;
    backgound: Graphic;
    hills: Graphic[] = [];
    constructor(world: World) {
        this.world = world;
        this.canvas = world.canvas
        this.backgound = new Graphic(
            { x: 0, y: 0 },
            { width: this.canvas.width, height: this.canvas.height + 100 },
            { image: generateImage(backgroundImage.src) },
            world
        )

        for (let i = 0; i < 10; i++) {
            const y = randomInitFromRange(10, Platform.yOffset + 200 - hillsImage.height);
            const x = hillsImage.width * i + 50
            this.hills.push(
                new Graphic(
                    { x, y },
                    { width: hillsImage.width, height: hillsImage.height },
                    { image: generateImage(hillsImage.src) },
                    world
                )
            )

        }
    }

    update() {
        this.backgound.draw();

        this.hills.forEach(hill => {
            hill.draw()
        })

    }
}