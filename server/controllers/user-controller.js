const userService = require("../service/user-service");
const {validationResult} = require("express-validator");
const ApiError = require("../exception/api-error");
const {use} = require("react");

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			console.log(errors.array());
			if (!errors.isEmpty()) {
				return next(
					ApiError.BadRequest("Ошибка при валидации", errors.array())
				);
			}
			const {email, password} = req.body;
			const userData = await userService.registration(email, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.sendResponse(200, userData);
		} catch (e) {
			next(e);
		}
	}
	async login(req, res, next) {
		try {
			const {email, password} = req.body;
			const userData = await userService.login(email, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			return res.sendResponse(200, userData);
		} catch (e) {
			next(e);
		}
	}
	async logout(req, res, next) {
		try {
			const {refreshToken} = req.cookies;
			const token = await userService.logout(refreshToken);
			res.clearCookie("refreshToken");
			return res.sendResponse(200, token);
		} catch (e) {
			next(e);
		}
	}
	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;
			await userService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (e) {
			next(e);
		}
	}

	async refresh(req, res, next) {
		try {
			const {refreshToken} = req.cookies;
			const userData = await userService.refresh(refreshToken);

			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			return res.sendResponse(200, userData);
		} catch (e) {
			next(e);
		}
	}
	async getUsers(req, res, next) {
		try {
			const users = await userService.getAllUsers();

			return res.sendResponse(200, {users});
		} catch (e) {
			next(e);
		}
	}

	async deleteAccount(req, res, next) {
		try {
			const userId = req.user.id;
			const password = req.body.password;

			const message = await userService.deleteAccount(userId, password);
			return res.sendSuccessCode(200, message);
		} catch (error) {
			next(error);
		}
	}

	async sendVerificationCode(req, res, next) {
		try {
			const userId = req.user.id;
			const message = await userService.sendVerificationCode(userId);

			return res.sendSuccessCode(200, message);
		} catch (error) {
			next(error);
		}
	}

	async changePassword(req, res, next) {
		try {
			const userId = req.user.id;
			const oldPassword = req.body.passSecond;
			const newPassword = req.body.newPassword;

			const message = await userService.changePassword(
				userId,
				oldPassword,
				newPassword
			);

			return res.sendSuccessCode(200, message);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
