import {BaseGame, GameState, Size} from "./Game";


export enum Input {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export const ColorArray = [
    'black',
    'blue',
    'red',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
];


export class Puzzle extends BaseGame {
    public static _instance?: Puzzle;
    private static size: Size = {width: 18, height: 18};
    private puzzle_state: number[];

    // mapping number 0 - 9 to color
    private static numberToColor(num: number): string {
        return ColorArray[num];
    }

    constructor() {
        if (Puzzle._instance) {
            throw new Error('Game is a singleton');
        }
        super(Puzzle.size);
        this.puzzle_state = [7, 2, 6, 5, 8, 3, 0, 1, 4];
        this.puzzle_state = [1, 2, 3, 4, 5, 6, 7, 0, 8];
    }

    public static get instance() {
        return Puzzle._instance ?? (Puzzle._instance = new Puzzle());
    }

    get state() {
        if (JSON.stringify(this.puzzle_state) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])) {
            return GameState.Won;
        } else {
            return GameState.Playing;
        }
    }

    public render() {
        let ctx = this.ctx;
        if (this.state === GameState.Playing) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "white";
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let num = this.puzzle_state[i * 3 + j];
                    let y = i * 6;
                    let x = j * 6;
                    // console.log('num: ' + num + ' x: ' + x + ' y: ' + y);
                    ctx.fillStyle = Puzzle.numberToColor(num);
                    ctx.fillRect(x, y, 6, 6);
                }
            }
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "10px Arial bold";
            ctx.fillText("WO", 0, 8);
            ctx.fillText("N", 0, 16);
        }
        this.setFavicon(this.canvas);
    }

    protected update(): boolean {
        let inputString = this.inputHandler.singleInput();
        if (inputString === null) {
            return false;
        }
        let input: Input | null = null;
        switch (inputString) {
            case 'ArrowUp':
                input = Input.UP;
                break;
            case 'ArrowDown':
                input = Input.DOWN;
                break;
            case 'ArrowLeft':
                input = Input.LEFT;
                break;
            case 'ArrowRight':
                input = Input.RIGHT;
                break;
        }
        if (input === null) return false;

        // [0 1 2]
        // [3 4 5]
        // [6 7 8]
        // 0 is the empty space
        console.log('input: ' + input + ' ' + typeof input);
        for (let i = 0; i < 3; i++) {
            console.log(this.puzzle_state[i * 3] + ' ' + this.puzzle_state[i * 3 + 1] + ' ' + this.puzzle_state[i * 3 + 2]);
        }

        // user input, move the element which is able to perform the move
        let emptyIndex = this.puzzle_state.indexOf(0);
        let emptyRow = Math.floor(emptyIndex / 3);
        let emptyCol = emptyIndex % 3;
        let moveIndex = -1;
        switch (input) {
            case Input.UP:
                if (emptyRow < 2) {
                    moveIndex = emptyIndex + 3;
                }
                break;
            case Input.DOWN:
                if (emptyRow > 0) {
                    moveIndex = emptyIndex - 3;
                }
                break;
            case Input.LEFT:
                if (emptyCol < 2) {
                    moveIndex = emptyIndex + 1;
                }
                break;
            case Input.RIGHT:
                if (emptyCol > 0) {
                    moveIndex = emptyIndex - 1;
                }
                break;
        }
        if (moveIndex !== -1) {
            let temp = this.puzzle_state[emptyIndex];
            this.puzzle_state[emptyIndex] = this.puzzle_state[moveIndex];
            this.puzzle_state[moveIndex] = temp;
        }
        return true;
        //
        // for (let i = 0; i < 3; i++) {
        //     for (let j = 0; j < 3; j++) {
        //     //    check if this element can perform the input
        //         switch (input) {
        //             case Input.UP:
        //                 if (i === 2) {
        //                     continue;
        //                 }
        //                 if (this.puzzle_state[i * 3 + j] === 0) {
        //                     this.puzzle_state[i * 3 + j] = this.puzzle_state[(i + 1) * 3 + j];
        //                     this.puzzle_state[(i + 1) * 3 + j] = 0;
        //                     return true;
        //                 }
        //                 break;
        //             case Input.DOWN:
        //                 if (i === 0) {
        //                     continue;
        //                 }
        //                 if (this.puzzle_state[i * 3 + j] === 0) {
        //                     this.puzzle_state[i * 3 + j] = this.puzzle_state[(i - 1) * 3 + j];
        //                     this.puzzle_state[(i - 1) * 3 + j] = 0;
        //                     return true;
        //                 }
        //                 break;
        //             case Input.LEFT:
        //                 if (j === 2) {
        //                     continue;
        //                 }
        //                 if (this.puzzle_state[i * 3 + j] === 0) {
        //                     this.puzzle_state[i * 3 + j] = this.puzzle_state[i * 3 + j + 1];
        //                     this.puzzle_state[i * 3 + j + 1] = 0;
        //                     return true;
        //                 }
        //                 break;
        //             case Input.RIGHT:
        //                 if (j === 0) {
        //                     continue;
        //                 }
        //                 if (this.puzzle_state[i * 3 + j] === 0) {
        //                     this.puzzle_state[i * 3 + j] = this.puzzle_state[i * 3 + j - 1];
        //                     this.puzzle_state[i * 3 + j - 1] = 0;
        //                     return true;
        //                 }
        //         }
        //     }
        // }
        //
        // let empty_index = this.puzzle_state.indexOf(0);
        // let empty_row = Math.floor(empty_index / 3);
        // let empty_col = empty_index % 3;
        //
        // console.log('empty_index: ' + empty_index);
        // console.log('empty_row: ' + empty_row);
        // console.log('empty_col: ' + empty_col);
        //
        // let can_move = false;
        // let chosen_row = Math.floor(input / 3);
        // let chosen_col = input % 3;
        // console.log('chosen_row: ' + chosen_row);
        // console.log('chosen_col: ' + chosen_col);
        //
        // console.log('[empty_row - 1, empty_row + 1].includes(chosen_row): ' + [empty_row - 1, empty_row + 1].includes(chosen_row));
        // console.log('[empty_col - 1, empty_col + 1].includes(chosen_col): ' + [empty_col - 1, empty_col + 1].includes(chosen_col));
        // if ([empty_row - 1, empty_row + 1].includes(chosen_row) && chosen_col === empty_col) {
        //     can_move = true;
        // } else if ([empty_col - 1, empty_col + 1].includes(chosen_col) && chosen_row === empty_row) {
        //     can_move = true;
        // }
        // console.log('can_move: ' + can_move);
        // if (!can_move) {
        //     return false;
        // }
        //
        // this.puzzle_state[empty_index] = this.puzzle_state[input];
        // this.puzzle_state[input] = 0;
        // return true;
    }
}
