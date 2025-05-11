module.exports = class BoardDto {
    id;
    title;
    user;
    statuses;

    constructor(model) {
        this.id = model._id;
        this.title = model.title;
        this.user = model.user;

        if (Array.isArray(model.statuses)) {
            this.statuses = model.statuses.map((status) => ({
                id: status._id,
                name: status.name,
                order: status.order,
                color: status.color,
            }));
        } else {
            this.statuses = model.statuses;
        }
    }
};
