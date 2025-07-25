import {IBoard} from "./IBoard";

export interface IBoards {
	[boardId: string]: IBoard;
}
