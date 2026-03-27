// const userService = require("./user-service");
// const UserModel = require("../../models/user-model");
// const bcrypt = require("bcrypt");
// const mailService = require("../mail-service");
// const tokenService = require("../token-service");
// const ListService = require("../list-services/list-service");
// const UserDto = require("../../dto/user-dto");
// const uuid = require("uuid");
// const ApiError = require("../../exception/api-error");

// // Мокаем все зависимости
// jest.mock("../../models/user-model");
// jest.mock("bcrypt");
// jest.mock("../mail-service");
// jest.mock("../token-service");
// jest.mock("../list-services/list-service");
// jest.mock("../../dto/user-dto");
// jest.mock("uuid");
// jest.mock("../../exception/api-error");

// describe("UserService", () => {

// 	beforeEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	describe("registration", () => {
// 		const email = "test@example.com";
// 		const password = "password123";
// 		const hashedPassword = "hashedPassword";
// 		const activationLink = "test-activation-link";
// 		const userId = "507f1f77bcf86cd799439011";
// 		const mockUser = {
// 			_id: userId,
// 			id: userId,
// 			email,
// 			password: hashedPassword,
// 			activationLink,
// 			isActivated: false,
// 		};
// 		const mockUserDto = {id: userId, email, isActivated: false};
// 		const mockTokens = {
// 			accessToken: "access-token",
// 			refreshToken: "refresh-token",
// 		};

// 		it("should successfully register a new user", async () => {
// 			// Arrange
// 			UserModel.findOne.mockResolvedValue(null);
// 			bcrypt.hash.mockResolvedValue(hashedPassword);
// 			uuid.v4.mockReturnValue(activationLink);
// 			UserModel.create.mockResolvedValue(mockUser);
// 			mailService.sendActivationMail.mockResolvedValue(true);
// 			UserDto.mockImplementation(() => mockUserDto);
// 			tokenService.generateToken.mockReturnValue(mockTokens);
// 			tokenService.saveToken.mockResolvedValue(true);

// 			// Act
// 			const result = await userService.registration(email, password);

// 			// Assert
// 			expect(UserModel.findOne).toHaveBeenCalledWith({
// 				email: email.toLowerCase(),
// 			});
// 			expect(bcrypt.hash).toHaveBeenCalledWith(password, 3);
// 			expect(uuid.v4).toHaveBeenCalled();
// 			expect(UserModel.create).toHaveBeenCalledWith({
// 				email: email.toLowerCase(),
// 				password: hashedPassword,
// 				activationLink,
// 			});
// 			expect(mailService.sendActivationMail).toHaveBeenCalledWith(
// 				email,
// 				`${process.env.API_URL}/api/activate/${activationLink}`
// 			);
// 			expect(tokenService.saveToken).toHaveBeenCalledWith(
// 				userId,
// 				mockTokens.refreshToken
// 			);
// 			expect(result).toEqual({...mockTokens, user: mockUserDto});
// 		});

// 		it("should throw error if user already exists", async () => {
// 			// Arrange
// 			const existingUser = {email};
// 			UserModel.findOne.mockResolvedValue(existingUser);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.registration(email, password)
// 			).rejects.toThrow();
// 			expect(UserModel.findOne).toHaveBeenCalledWith({
// 				email: email.toLowerCase(),
// 			});
// 			expect(UserModel.create).not.toHaveBeenCalled();
// 		});

// 		it("should convert email to lowercase", async () => {
// 			// Arrange
// 			const uppercaseEmail = "TEST@EXAMPLE.COM";
// 			UserModel.findOne.mockResolvedValue(null);
// 			bcrypt.hash.mockResolvedValue(hashedPassword);
// 			uuid.v4.mockReturnValue(activationLink);
// 			UserModel.create.mockResolvedValue(mockUser);
// 			UserDto.mockImplementation(() => mockUserDto);
// 			tokenService.generateToken.mockReturnValue(mockTokens);
// 			tokenService.saveToken.mockResolvedValue(true);

// 			// Act
// 			await userService.registration(uppercaseEmail, password);

// 			// Assert
// 			expect(UserModel.findOne).toHaveBeenCalledWith({
// 				email: uppercaseEmail.toLowerCase(),
// 			});
// 			expect(UserModel.create).toHaveBeenCalledWith(
// 				expect.objectContaining({email: uppercaseEmail.toLowerCase()})
// 			);
// 		});
// 	});

// 	describe("activate", () => {
// 		const activationLink = "test-link";
// 		const mockUser = {
// 			isActivated: false,
// 			save: jest.fn().mockResolvedValue(true),
// 		};

// 		it("should activate user with valid link", async () => {
// 			// Arrange
// 			UserModel.findOne.mockResolvedValue(mockUser);

// 			// Act
// 			await userService.activate(activationLink);

// 			// Assert
// 			expect(UserModel.findOne).toHaveBeenCalledWith({activationLink});
// 			expect(mockUser.isActivated).toBe(true);
// 			expect(mockUser.save).toHaveBeenCalled();
// 		});

// 		it("should throw error if activation link is invalid", async () => {
// 			// Arrange
// 			UserModel.findOne.mockResolvedValue(null);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.activate(activationLink)
// 			).rejects.toThrow();
// 			expect(UserModel.findOne).toHaveBeenCalledWith({activationLink});
// 			expect(mockUser?.save).not.toHaveBeenCalled();
// 		});
// 	});

// 	describe("login", () => {
// 		const email = "test@example.com";
// 		const password = "password123";
// 		const userId = "507f1f77bcf86cd799439011";
// 		const mockUser = {
// 			_id: userId,
// 			id: userId,
// 			email,
// 			password: "hashedPassword",
// 			isActivated: true,
// 		};
// 		const mockUserDto = {id: userId, email, isActivated: true};
// 		const mockTokens = {
// 			accessToken: "access-token",
// 			refreshToken: "refresh-token",
// 		};

// 		it("should successfully login user", async () => {
// 			// Arrange
// 			UserModel.findOne.mockResolvedValue(mockUser);
// 			bcrypt.compare.mockResolvedValue(true);
// 			UserDto.mockImplementation(() => mockUserDto);
// 			tokenService.generateToken.mockReturnValue(mockTokens);
// 			tokenService.saveToken.mockResolvedValue(true);

// 			// Act
// 			const result = await userService.login(email, password);

// 			// Assert
// 			expect(UserModel.findOne).toHaveBeenCalledWith({
// 				email: email.toLowerCase(),
// 			});
// 			expect(bcrypt.compare).toHaveBeenCalledWith(
// 				password,
// 				mockUser.password
// 			);
// 			expect(tokenService.saveToken).toHaveBeenCalledWith(
// 				userId,
// 				mockTokens.refreshToken
// 			);
// 			expect(result).toEqual({...mockTokens, user: mockUserDto});
// 		});

// 		it("should throw error if user not found", async () => {
// 			// Arrange
// 			UserModel.findOne.mockResolvedValue(null);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(userService.login(email, password)).rejects.toThrow();
// 		});

// 		it("should throw error if password is incorrect", async () => {
// 			// Arrange
// 			UserModel.findOne.mockResolvedValue(mockUser);
// 			bcrypt.compare.mockResolvedValue(false);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(userService.login(email, password)).rejects.toThrow();
// 			expect(bcrypt.compare).toHaveBeenCalledWith(
// 				password,
// 				mockUser.password
// 			);
// 		});
// 	});

// 	describe("logout", () => {
// 		const refreshToken = "refresh-token";

// 		it("should successfully logout user", async () => {
// 			// Arrange
// 			const mockRemovedToken = {refreshToken};
// 			tokenService.removeToken.mockResolvedValue(mockRemovedToken);

// 			// Act
// 			const result = await userService.logout(refreshToken);

// 			// Assert
// 			expect(tokenService.removeToken).toHaveBeenCalledWith(refreshToken);
// 			expect(result).toEqual(mockRemovedToken);
// 		});
// 	});

// 	describe("refresh", () => {
// 		const refreshToken = "valid-refresh-token";
// 		const userId = "507f1f77bcf86cd799439011";
// 		const mockUserData = {id: userId, email: "test@example.com"};
// 		const mockUser = {
// 			_id: userId,
// 			id: userId,
// 			email: "test@example.com",
// 			isActivated: true,
// 		};
// 		const mockUserDto = {
// 			id: userId,
// 			email: "test@example.com",
// 			isActivated: true,
// 		};
// 		const mockTokens = {
// 			accessToken: "new-access-token",
// 			refreshToken: "new-refresh-token",
// 		};

// 		it("should successfully refresh tokens", async () => {
// 			// Arrange
// 			tokenService.validateRefreshToken.mockReturnValue(mockUserData);
// 			tokenService.findToken.mockResolvedValue({refreshToken});
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			UserDto.mockImplementation(() => mockUserDto);
// 			tokenService.generateToken.mockReturnValue(mockTokens);
// 			tokenService.saveToken.mockResolvedValue(true);

// 			// Act
// 			const result = await userService.refresh(refreshToken);

// 			// Assert
// 			expect(tokenService.validateRefreshToken).toHaveBeenCalledWith(
// 				refreshToken
// 			);
// 			expect(tokenService.findToken).toHaveBeenCalledWith(refreshToken);
// 			expect(UserModel.findById).toHaveBeenCalledWith(mockUserData.id);
// 			expect(tokenService.generateToken).toHaveBeenCalledWith({
// 				...mockUserDto,
// 			});
// 			expect(result).toEqual({...mockTokens, user: mockUserDto});
// 		});

// 		it("should throw UnauthorizedError if no refresh token", async () => {
// 			// Arrange
// 			ApiError.UnauthorizedError.mockImplementation(
// 				() => new Error("Unauthorized")
// 			);

// 			// Act & Assert
// 			await expect(userService.refresh(null)).rejects.toThrow();
// 			expect(tokenService.validateRefreshToken).not.toHaveBeenCalled();
// 		});

// 		it("should throw UnauthorizedError if token is invalid", async () => {
// 			// Arrange
// 			tokenService.validateRefreshToken.mockReturnValue(null);
// 			tokenService.findToken.mockResolvedValue({refreshToken});
// 			ApiError.UnauthorizedError.mockImplementation(
// 				() => new Error("Unauthorized")
// 			);

// 			// Act & Assert
// 			await expect(userService.refresh(refreshToken)).rejects.toThrow();
// 		});

// 		it("should throw UnauthorizedError if token not found in DB", async () => {
// 			// Arrange
// 			tokenService.validateRefreshToken.mockReturnValue(mockUserData);
// 			tokenService.findToken.mockResolvedValue(null);
// 			ApiError.UnauthorizedError.mockImplementation(
// 				() => new Error("Unauthorized")
// 			);

// 			// Act & Assert
// 			await expect(userService.refresh(refreshToken)).rejects.toThrow();
// 		});
// 	});

// 	describe("getAllUsers", () => {
// 		it("should return all users with only email field", async () => {
// 			// Arrange
// 			const mockUsers = [
// 				{email: "user1@example.com"},
// 				{email: "user2@example.com"},
// 			];
// 			const mockSelect = jest.fn().mockReturnValue(mockUsers);
// 			UserModel.find.mockReturnValue({select: mockSelect});

// 			// Act
// 			const result = await userService.getAllUsers();

// 			// Assert
// 			expect(UserModel.find).toHaveBeenCalled();
// 			expect(mockSelect).toHaveBeenCalledWith("email -_id");
// 			expect(result).toEqual(mockUsers);
// 		});
// 	});

// 	describe("deleteAccount", () => {
// 		const userId = "507f1f77bcf86cd799439011";
// 		const password = "password123";
// 		const mockUser = {
// 			_id: userId,
// 			password: "hashedPassword",
// 		};

// 		it("should successfully delete user account", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			bcrypt.compare.mockResolvedValue(true);
// 			tokenService.deleteTokens.mockResolvedValue(true);
// 			ListService.deleteAllListsForUser.mockResolvedValue(true);
// 			UserModel.deleteOne.mockResolvedValue({deletedCount: 1});

// 			// Act
// 			const result = await userService.deleteAccount(userId, password);

// 			// Assert
// 			expect(UserModel.findById).toHaveBeenCalledWith(userId);
// 			expect(bcrypt.compare).toHaveBeenCalledWith(
// 				password,
// 				mockUser.password
// 			);
// 			expect(tokenService.deleteTokens).toHaveBeenCalledWith(userId);
// 			expect(ListService.deleteAllListsForUser).toHaveBeenCalledWith(
// 				userId
// 			);
// 			expect(UserModel.deleteOne).toHaveBeenCalledWith({_id: userId});
// 			expect(result).toEqual({message: "Аккаунт успешно удален"});
// 		});

// 		it("should throw error if user not found", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(null);
// 			ApiError.NotFound.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.deleteAccount(userId, password)
// 			).rejects.toThrow();
// 			expect(UserModel.deleteOne).not.toHaveBeenCalled();
// 		});

// 		it("should throw error if password is incorrect", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			bcrypt.compare.mockResolvedValue(false);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.deleteAccount(userId, password)
// 			).rejects.toThrow();
// 			expect(tokenService.deleteTokens).not.toHaveBeenCalled();
// 			expect(UserModel.deleteOne).not.toHaveBeenCalled();
// 		});
// 	});

// 	describe("sendVerificationCode", () => {
// 		const userId = "507f1f77bcf86cd799439011";
// 		const mockUser = {
// 			email: "test@example.com",
// 			activationLink: "test-link",
// 		};
// 		const activationUrl = `${process.env.API_URL}/api/activate/test-link`;

// 		it("should successfully send verification code", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			mailService.sendActivationMail.mockResolvedValue({
// 				success: true,
// 				message: "Email sent",
// 			});

// 			// Act
// 			const result = await userService.sendVerificationCode(userId);

// 			// Assert
// 			expect(UserModel.findById).toHaveBeenCalledWith(userId);
// 			expect(mailService.sendActivationMail).toHaveBeenCalledWith(
// 				mockUser.email,
// 				activationUrl
// 			);
// 			expect(result).toBe("Email sent");
// 		});

// 		it("should throw error if user not found", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(null);
// 			ApiError.NotFound.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.sendVerificationCode(userId)
// 			).rejects.toThrow();
// 		});

// 		it("should throw error if activation link not found", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue({
// 				email: "test@example.com",
// 				activationLink: null,
// 			});
// 			ApiError.NotFound.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.sendVerificationCode(userId)
// 			).rejects.toThrow();
// 		});

// 		it("should throw error if email sending fails", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			mailService.sendActivationMail.mockResolvedValue({success: false});
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.sendVerificationCode(userId)
// 			).rejects.toThrow();
// 		});
// 	});

// 	describe("changePassword", () => {
// 		const userId = "507f1f77bcf86cd799439011";
// 		const oldPassword = "oldPassword123";
// 		const newPassword = "newPassword123";
// 		const mockUser = {
// 			password: "hashedOldPassword",
// 			save: jest.fn().mockResolvedValue(true),
// 		};

// 		it("should successfully change password", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			bcrypt.compare.mockResolvedValue(true);
// 			bcrypt.hash.mockResolvedValue("hashedNewPassword");

// 			// Act
// 			const result = await userService.changePassword(
// 				userId,
// 				oldPassword,
// 				newPassword
// 			);

// 			// Assert
// 			expect(UserModel.findById).toHaveBeenCalledWith(userId);
// 			expect(bcrypt.compare).toHaveBeenCalledWith(
// 				oldPassword,
// 				mockUser.password
// 			);
// 			expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 3);
// 			expect(mockUser.password).toBe("hashedNewPassword");
// 			expect(mockUser.save).toHaveBeenCalled();
// 			expect(result).toEqual({message: "Пароль успешно сменен"});
// 		});

// 		it("should throw error if user not found", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(null);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.changePassword(userId, oldPassword, newPassword)
// 			).rejects.toThrow();
// 			expect(bcrypt.compare).not.toHaveBeenCalled();
// 			expect(mockUser.save).not.toHaveBeenCalled();
// 		});

// 		it("should throw error if old password is incorrect", async () => {
// 			// Arrange
// 			UserModel.findById.mockResolvedValue(mockUser);
// 			bcrypt.compare.mockResolvedValue(false);
// 			ApiError.BadRequest.mockImplementation(
// 				(message) => new Error(message)
// 			);

// 			// Act & Assert
// 			await expect(
// 				userService.changePassword(userId, oldPassword, newPassword)
// 			).rejects.toThrow();
// 			expect(bcrypt.hash).not.toHaveBeenCalled();
// 			expect(mockUser.save).not.toHaveBeenCalled();
// 		});
// 	});
// });
