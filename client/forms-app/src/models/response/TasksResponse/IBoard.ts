import {ITask} from "./ITask";

export interface IBoard {
	id: string;
	title: string;
	tasks: ITask[];
}
