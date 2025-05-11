class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;

        Object.setPrototypeOf(this, ApiError.prototype);

        this.stack = new Error().stack;
    }

    static UnauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован");
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static NotFound(message) {
        return new ApiError(404, message);
    }

    static InternalError(message) {
        return new ApiError(500, message);
    }

    static Forbidden(message) {
        return new ApiError(403, message);
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            errors: this.errors,
        };
    }
}

module.exports = ApiError;
