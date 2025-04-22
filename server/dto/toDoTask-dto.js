module.exports = class TodoTaskDto {
	id;
	board;
	title;
	status;
	description;
	createdAt;
	finishedAt;

	constructor(model, options = {}) {
		this.id = model._id;
		this.title = model.title;
		this.status = model.status;
		this.description = model.description ?? null;
		this.createdAt = model.createdAt;
		this.finishedAt = model.finishedAt ?? null;

		if (
			typeof model.board === "object" &&
			model.board !== null &&
			"_id" in model.board
		) {
			this.board = {
				id: model.board._id,
				...(options.includeBoardTitle &&
					model.board.title && {title: model.board.title}),
			};
		} else {
			this.board = {id: model.board};
		}
	}
	toJSON() {
		return {
			id: this.id,
			title: this.title,
			status: this.status,
			description: this.description,
			createdAt: this.createdAt,
			finishedAt: this.finishedAt,
		};
	}
};
