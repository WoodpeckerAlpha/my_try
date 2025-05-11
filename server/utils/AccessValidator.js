const ApiError = require("../exception/api-error");

class AccessValidator {
    static async ensureOwnership(model, modelId, userId) {
        const existingRecord = await model.findById(modelId);

        if (!existingRecord) {
            throw ApiError.NotFound("Resource not found");
        }

        if (existingRecord.user.toString() !== userId.toString()) {
            throw ApiError.Forbidden("You do not have access to this resource");
        }

        return true;
    }
}

module.exports = AccessValidator;
