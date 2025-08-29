const ApiError = require("../exception/api-error");

class ValidateField {
	static requiredFields(data, requiredFields) {
		const errors = [];

		requiredFields.forEach((field) => {
			if (!data[field]) {
				errors.push({
					field,
					message: `${field} is required`,
				});
			}
		});

		if (errors.length > 0) {
			throw ApiError.BadRequest("Validation error", errors);
		}
	}

	static async uniqueField(model, field, value) {
		
		const existingRecord = await model.findOne({[field]: value});

		if (existingRecord) {
			throw ApiError.BadRequest(
				`${field} with value ${value} already exists`
			);
		}
	}
}

module.exports = ValidateField;
