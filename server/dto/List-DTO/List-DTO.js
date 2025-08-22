module.exports = class ListDTO {
	title;
	textField;
	id;

	constructor(model) {
		this.title = model.title;
		this.textField = model.textField;
		this.id = model._id;
	}
};
