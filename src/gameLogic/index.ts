import World from "./World";

export default class MarioGame {
    static _instance: MarioGame | null;
    animationFrameId!: number;
    world!: World
    constructor() {
        if (MarioGame._instance instanceof MarioGame) {
            return MarioGame._instance
        }

        this.world = new World();

        this.update = this.update.bind(this);

        this.update()
    }



    update() {
        this.animationFrameId = window.requestAnimationFrame(this.update)

        this.world.update();
    }

    dispose() {
        this.world.dispose()
        window.cancelAnimationFrame(this.animationFrameId)
        MarioGame._instance = null;
    }
}