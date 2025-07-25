import {ITask} from "./ITask";

export interface IStatuses {
	[statusId: string]: ITask[];
}
