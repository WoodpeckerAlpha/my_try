module.exports = function responseMiddleware(req, res, next) {
	res.sendResponse = function (statusCode = 200, payload = {}) {
		res.status(statusCode).json({...payload});
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
