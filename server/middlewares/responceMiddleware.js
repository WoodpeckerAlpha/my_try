module.exports = function responseMiddleware(req, res, next) {
	res.sendResponse = function (statusCode = 200, payload = {}) {
		res.status(statusCode).json({...payload});
	};

	res.sendSuccessCode = function (statusCode = 200, message = "") {
		res.status(statusCode).json(message);
	};

	res.sendError = function (
		statusCode = 500,
		error = "Server error",
		message
	) {
		res.status(statusCode).json({status: statusCode, error, message});
	};

	next();
};
