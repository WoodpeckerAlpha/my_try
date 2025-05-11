module.exports = class BoardFullDto {
    id;
    title;
    user;
    statuses;

    constructor(model, tasksByStatus = {}) {
        this.id = model._id;
        this.title = model.title;
        this.user = model.user;

        this.statuses = Array.isArray(model.statuses)
            ? model.statuses.map((status) => ({
                  id: status._id,
                  name: status.name,
                  order: status.order,
                  color: status.color,
                  tasks: tasksByStatus[status._id] || [],
              }))
            : model.statuses;
    }
};
