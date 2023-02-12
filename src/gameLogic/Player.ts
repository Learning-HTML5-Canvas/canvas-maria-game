
import Graphic from "./Graphic";
import Platform from "./Platform";
import Scenery from "./Scenery";
import { CharacterMovement, Vector2 } from "./types";
import World from "./World";
import spriteStandRightImg from '@assets/spriteStandRight.png'
import spriteRunRightImg from '@assets/spriteRunRight.png'
import spriteStandLeftImg from '@assets/spriteStandLeft.png'
import spriteRunLeftImg from '@assets/spriteRunLeft.png'
import { generateImage } from "./utils/chunks";

interface DirectionImgType {
    img: HTMLImageElement,
    cropWidth: number,
    width: number;
    status: "Run" | "Stand",
    direction: "Right" | "Left"
}

interface SpriteType {
    stand: {
        right: DirectionImgType,
        left: DirectionImgType,
    },
    run: {
        right: DirectionImgType,
        left: DirectionImgType,
    }
}

interface KeysType {
    Left: { pressed: boolean },
    Right: { pressed: boolean },
    lastPressed: Exclude<CharacterMovement, "Up" | "Down">
}
export default class Player extends Graphic {
    static xMovementSpeed: number;
    private canvas: HTMLCanvasElement;
    private canvasCenter: Vector2;
    private platforms: Platform[];
    private scenery: Scenery;
    private world: World;
    velocity: Vector2;
    gravity: number;
    frames: number;
    sprite: SpriteType;
    currentSprite: DirectionImgType;
    keys!: KeysType;
    constructor(world: World) {
        super({ x: 100, y: 100 }, { width: 66, height: 150 }, {}, world);
        Player.xMovementSpeed = 5;
        this.world = world;
        this.canvas = world.canvas;
        this.canvasCenter = world.canvasCenter;
        this.platforms = world.platforms
        this.scenery = world.scenery;
        this.velocity = { x: 0, y: 0 }
        this.gravity = 0.5;
        this.frames = 0;
        this.keys = {
            Right: { pressed: false },
            Left: { pressed: false },
            lastPressed: "Right"
        }
        const standCropWidth = 177;
        const standWidth = 66;
        const runCropWidth = 340.9;
        const runWidth = 127.875;
        this.sprite = {
            stand: {
                right:
                {
                    img: generateImage(spriteStandRightImg.src),
                    cropWidth: standCropWidth,
                    width: standWidth,
                    status: "Stand",
                    direction: "Right"
                },
                left:
                {
                    img: generateImage(spriteStandLeftImg.src),
                    cropWidth: standCropWidth,
                    width: standWidth,
                    status: "Stand",
                    direction: "Left"
                },
            },
            run: {
                right:
                {
                    img: generateImage(spriteRunRightImg.src),
                    cropWidth: runCropWidth,
                    width: runWidth,
                    status: "Run",
                    direction: "Right"
                },
                left:
                {
                    img: generateImage(spriteRunLeftImg.src),
                    cropWidth: runCropWidth,
                    width: runWidth,
                    status: "Run",
                    direction: "Left"
                },
            }
        }

        this.currentSprite = this.sprite.stand.right;

        this.startPlayerMovement = this.startPlayerMovement.bind(this);
        this.stopPlayerMovement = this.stopPlayerMovement.bind(this);
        window.addEventListener("keydown", this.startPlayerMovement);
        window.addEventListener("keyup", this.stopPlayerMovement)
    }

    startPlayerMovement({ key }: KeyboardEvent) {
        if (key === "w" || key === "ArrowUp") {
            // prevent player from jumping too high out of screen
            if (this.position.y < -50) {
                this.velocity.y = 0;
            } else {
                this.velocity.y -= 15;
            }

        } else if (key === "s" || key === "ArrowDown") {

        } else if (key === "a" || key === "ArrowLeft") {
            this.keys.Left.pressed = true;
            this.keys.lastPressed = "Left";
        } else if (key === "d" || key === "ArrowRight") {
            this.keys.Right.pressed = true;
            this.keys.lastPressed = "Right"
        }

    }
    stopPlayerMovement({ key }: KeyboardEvent) {

        if (key === "w" || key === "ArrowUp") {

        } else if (key === "s" || key === "ArrowDown") {

        } else if (key === "a" || key === "ArrowLeft") {
            this.keys.Left.pressed = false;
            this.keys.lastPressed = "Left";
        } else if (key === "d" || key === "ArrowRight") {
            this.keys.Right.pressed = false;
            this.keys.lastPressed = "Right"
        }

    }

    draw() {
        this.ctx.drawImage(
            this.currentSprite.img,
            this.currentSprite.cropWidth * this.frames,
            0,
            this.currentSprite.cropWidth,
            400,
            this.position.x,
            this.position.y,
            this.currentSprite.width,
            this.height
        )

    }

    update() {

        // Handle Player vertical Movements E.g Jumps
        if ((this.position.y + this.height + this.velocity.y) >= this.canvas.height) {
            this.world.restartGame();
        } else {
            this.velocity.y += this.gravity;
        }

        // Handle Player horizontal Movements 
        if (this.keys.Right.pressed && this.position.x + this.width + this.velocity.x <= this.canvasCenter.x) {
            this.velocity.x = Math.abs(Player.xMovementSpeed);
        } else if (this.keys.Left.pressed && this.position.x + this.velocity.x >= 100) {
            this.velocity.x = - Player.xMovementSpeed;
        } else {// stop moving player and start moving the backgrounds to create the illusion of movement
            this.velocity.x = 0;

            // move background to create Horizontal parallax(illusion of movement) effect 
            if (this.keys.Right.pressed && this.world.scrollOffset < this.world.gameEndDistance) {
                this.world.scrollOffset += Math.abs(Player.xMovementSpeed);
                this.platforms.forEach(platform => {
                    platform.position.x -= Math.abs(Player.xMovementSpeed);
                })

                this.scenery.hills.forEach(hill => {
                    hill.position.x -= Math.abs(Scenery.hillsXMovementSpeed)
                })
            } else if (this.keys.Left.pressed && this.world.scrollOffset > 0) {
                this.world.scrollOffset -= Math.abs(Player.xMovementSpeed);
                this.platforms.forEach(platform => {
                    platform.position.x += Math.abs(Player.xMovementSpeed);
                })

                this.scenery.hills.forEach(hill => {
                    hill.position.x += Math.abs(Scenery.hillsXMovementSpeed)
                })
            }
        }



        // Checks if a user has landed on a platform, (Platform collision detection)
        this.platforms.forEach(platform => {
            if (
                this.position.y + this.height <= platform.position.y &&
                this.position.y + this.height + this.velocity.y >= platform.position.y &&
                this.position.x + this.width >= platform.position.x &&
                this.position.x <= platform.position.x + platform.width
            ) {
                this.velocity.y = 0;
            }
        })


        // checks if player has gotten to the end of the game
        if (this.world.scrollOffset >= this.world.gameEndDistance) {
            console.log("End Game")
        }

        // Toggle Animation sprint type E.g Running Standing either left or right
        if (this.keys.Right.pressed) {
            this.currentSprite = this.sprite.run.right
        } else if (this.keys.Left.pressed) {
            this.currentSprite = this.sprite.run.left
        } else if (this.keys.lastPressed === "Right") {
            this.currentSprite = this.sprite.stand.right
        } else if (this.keys.lastPressed === "Left") {
            this.currentSprite = this.sprite.stand.left
        }

        // Increase frames to animate image
        this.frames++
        if (this.frames > 28 && this.currentSprite.status === "Stand") this.frames = 0;
        if (this.frames > 30 && this.currentSprite.status === "Run") this.frames = 0;

        // update user positions
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y

        this.draw();
    }

    dispose() {
        window.removeEventListener("keydown", this.startPlayerMovement)
        window.removeEventListener("keyup", this.stopPlayerMovement)
    }
}