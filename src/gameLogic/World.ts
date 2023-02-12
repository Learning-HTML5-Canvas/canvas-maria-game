import Platform from "./Platform";
import Player from "./Player";
import { Vector2 } from "./types";
import platformImage from "@assets/platform.png"
import { generateImage } from "./utils/chunks";
import Scenery from "./Scenery";

export default class World {
    canvas!: HTMLCanvasElement;
    canvasCenter!: Vector2;
    ctx!: CanvasRenderingContext2D;
    scrollOffset: number;
    gameEndDistance: number;
    player!: Player;
    scenery!: Scenery;
    platforms: Platform[] = []
    constructor() {
        this.scrollOffset = 0;
        this.gameEndDistance = 10000;
        this.canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!
        this.canvas.width = window.innerWidth < 1024 ? window.innerWidth * 0.8 : 1024;
        this.canvas.height = 576;
        this.canvasCenter = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        }



        this.startGame();
        this.onResize = this.onResize.bind(this);

        window.addEventListener("resize", this.onResize);


    }

    startGame() {
        this.platforms = []
        this.scenery = new Scenery(this);
        this.player = new Player(this);


        for (let i = 0; i < 20; i++) {

            let x = i > 0 ? (i * platformImage.width) - 3 : i * platformImage.width;
            const y = Platform.yOffset;


            if (i > 0 && i % 2 === 0) {
                x += Platform.xSpawnOffset;
            }

            if (i > 1 && i % 2 === 1) {
                x += Platform.xSpawnOffset * 2
            }

            this.platforms.push(
                new Platform(
                    { x, y },
                    { width: platformImage.width, height: platformImage.height },
                    generateImage(platformImage.src),
                    this
                )
            )
        }
    }


    restartGame() {
        this.startGame()
    }




    onResize() {
        this.canvas.width = window.innerWidth < 1024 ? window.innerWidth * 0.8 : 1024;

        this.canvasCenter = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.scenery.update();
        this.player.update();
        this.platforms.forEach(platform => {
            platform.update()
        })
    }

    dispose() {
        this.player.dispose()
        window.removeEventListener("resize", this.onResize);
    }
}