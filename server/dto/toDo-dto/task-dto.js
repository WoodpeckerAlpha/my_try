module.exports = class TodoTaskDto {
    id;
    board;
    title;
    status;
    description;
    createdAt;
    finishedAt;

    constructor(model) {
        this.id = model._id;
        this.board = model.board;
        this.title = model.title;
        this.description = model.description || null;
        this.createdAt = model.createdAt;
        this.finishedAt = model.finishedAt || null;

        if (model.status && typeof model.status === "object") {
            this.status = {
                id: model.status._id,
                name: model.status.name,
                order: model.status.order,
                color: model.status.color,
            };
        } else {
            this.status = model.status;
        }
    }
};
