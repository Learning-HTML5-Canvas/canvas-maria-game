import { DimensionType, GraphicOthers, Vector2 } from "./types";
import World from "./World";

export default class Graphic {
    ctx: CanvasRenderingContext2D;
    position: Vector2;
    width: number;
    height: number;
    color: string;
    image: HTMLImageElement | undefined;
    constructor(position: Vector2, dimension: DimensionType, others: GraphicOthers, world: World) {
        this.ctx = world.ctx;
        this.position = position;
        this.width = dimension.width;
        this.height = dimension.height;
        this.color = others.color || "";
        this.image = others.image;
    }

    draw() {
        if (this.image) {
            this.ctx.save()
            this.ctx.drawImage(this.image, this.position.x, this.position.y)
            this.ctx.restore();
        } else {
            this.ctx.save()
            this.ctx.beginPath();
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.restore();
        }

    }
}