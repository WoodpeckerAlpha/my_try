export interface ITask {
	title: string;
	description: string;
	createAt: Date;
	finishAt: Date | null | undefined;
}
