export interface Size {
    width: number;
    height: number;
}

export interface Image {
    img: HTMLImageElement;
    src: string;
}

export enum GameState {
    Title,
    Playing,
    Won,
    Lost
}

export const sleep = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, Math.ceil(time * 1000)));
};

export class InputQueue {
    private _queue: string[] = [];

    get queue() {
        return this._queue;
    }

    add(input: string) {
        this._queue.push(input);
    }

    shift() {
        return this._queue.shift();
    }

    clear() {
        this._queue = [];
    }
}

export class InputHandler {
    private _queue: InputQueue = new InputQueue();

    get queue() {
        return this._queue;
    }

    singleInput() {
        return this._queue.shift();
    }

    allInputs() {
        return this._queue.queue;
    }

    constructor() {
        window.addEventListener('keydown', (e) => {
            this._queue.add(e.key);
        })
    }
}

export abstract class BaseGame {
    canvas: HTMLCanvasElement = document.createElement('canvas');
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    size: Size;
    protected _assets: Record<string, any> = {};
    protected inputHandler: InputHandler;
    protected _state: GameState = GameState.Title;

    get state() {
        return this._state;
    }

    protected constructor(size: Size, inputHandler?: InputHandler) {
        this.size = size;
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        if (inputHandler) {
            this.inputHandler = inputHandler;
        } else {
            this.inputHandler = new InputHandler();
        }
    }

    public abstract render(): void;

    protected abstract update(): boolean;

    protected addImageAsset(src: string): HTMLImageElement {
        let newImage = new Image();
        this._assets[src] = newImage;
        return newImage;
    }

    protected getAsset(name: string) {
        return this._assets[name];
    }

    setFavicon = (canvas: HTMLCanvasElement) => {
        let favicon: HTMLLinkElement = document.getElementById('favicon') as HTMLLinkElement;
        favicon.href = canvas.toDataURL();
        window.history.replaceState(null, '', window.location.hash === "#1" ? "#0" : "#1");
    }

    startGameLoop() {
        window.setInterval(() => {
            let toUpdate = this.update();
            if (toUpdate) {
                this.render();
            }
        }, 100);
    }
}