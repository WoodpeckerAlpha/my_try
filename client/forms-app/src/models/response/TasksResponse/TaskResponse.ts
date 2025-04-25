import {IBoard} from "./IBoard";

export interface TaskResponse {
	success: boolean;
	action: string;
	data: {
		boards: IBoard[];
	};
}
