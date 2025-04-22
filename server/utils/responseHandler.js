function success(res, data, statusCode = 200) {
	res.status(statusCode).json({
		success: true,
		data,
	});
}

function error(res, message, statusCode = 200) {
	res.status(statusCode).json({
		success: false,
		error: message,
	});
}
 
module.exports{success, error}
