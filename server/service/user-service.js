const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const ListService = require("./list-services/list-service");
const UserDto = require("../dto/user-dto");
const uuid = require("uuid");
const ApiError = require("../exception/api-error");

class UserService {
	async registration(email, password) {
		email = email.toLowerCase();
		const candidate = await UserModel.findOne({email});
		if (candidate) {
			throw ApiError.BadRequest(
				`Пользователь с почтовым адресом ${email} уже существует`
			);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

		const user = await UserModel.create({
			email,
			password: hashPassword,
			activationLink,
		});
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		);

		const userDto = new UserDto(user); // id, email, isActivated
		const tokens = tokenService.generateToken({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {...tokens, user: userDto};
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({activationLink});
		if (!user) {
			throw ApiError.BadRequest("Неккоректная ссылка активации");
		}
		user.isActivated = true;
		await user.save();
		console.log(user);
	}

	async login(email, password) {
		email = email.toLowerCase();
		const user = await UserModel.findOne({email});
		if (!user) {
			throw ApiError.BadRequest(
				"Пользователь с таким email не был найден"
			);
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			throw ApiError.BadRequest("Некорректный пароль");
		}

		const userDto = new UserDto(user);

		const tokens = tokenService.generateToken({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		console.log(userDto);

		return {...tokens, user: userDto};
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}

		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);

		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}

		const user = await UserModel.findById(userData.id);
		const userDto = new UserDto(user);

		const tokens = tokenService.generateToken({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {...tokens, user: userDto};
	}

	async getAllUsers() {
		const users = await UserModel.find().select("email -_id");
		return users;
	}

	async deleteAccount(userId, password) {
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw ApiError.NotFound("Пользователь не найден");
			}

			const isPassEquals = await bcrypt.compare(password, user.password);
			if (!isPassEquals) {
				throw ApiError.BadRequest("Некорректный пароль");
			}

			await tokenService.deleteTokens(userId);
			await ListService.deleteAllListsForUser(userId);

			const deletedData = await UserModel.deleteOne({_id: userId});

			if (!deletedData) {
				throw ApiError.NotFound("Пользоваталь не найден");
			}

			return {message: "Аккаунт успешно удален"};
		} catch (error) {}
	}

	async sendVerificationCode(userId) {
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw ApiError.NotFound("User not found");
			}

			if (!user.activationLink) {
				throw ApiError.NotFound("Activation link not found");
			}

			const message = await mailService.sendActivationMail(
				user.email,
				`${process.env.API_URL}/api/activate/${user.activationLink}`
			);
			if (message.success == false) {
				throw ApiError.BadRequest("Ошибка отправки письма на адрес");
			}
			return message.message;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while sending verification code:", error);
			throw ApiError.InternalError(
				"Something went wrong while sending verification code"
			);
		}
	}

	async changePassword(userId, oldPassword, newPassword) {
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw ApiError.BadRequest(`Пользователь не найден`);
			}

			const isPassEquals = await bcrypt.compare(
				oldPassword,
				user.password
			);
			if (!isPassEquals) {
				throw ApiError.BadRequest("Некорректный пароль");
			}

			const hashPassword = await bcrypt.hash(newPassword, 3);

			user.password = hashPassword;
			await user.save();

			return {message: "Пароль успешно сменен"};
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while changing password:", error);
			throw ApiError.InternalError(
				"Something went wrong while changing password"
			);
		}
	}
}

module.exports = new UserService();
