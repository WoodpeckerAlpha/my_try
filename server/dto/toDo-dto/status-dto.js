module.exports = class StatusDto {
    id;
    board;
    name;
    order;
    color;

    constructor(model) {
        this.id = model._id.toString();
        this.board = model.board;
        this.name = model.name;
        this.order = model.order;
        this.color = model.color;
    }
};
