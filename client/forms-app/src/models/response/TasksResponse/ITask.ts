export interface ITask {
	id: string;
	title: string;
	status: "pending" | "in_progress" | "complete";
	description: string;
	createdAt: Date;
	finishedAt: Date | null;
}

