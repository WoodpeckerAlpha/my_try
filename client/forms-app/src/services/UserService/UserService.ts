import {AxiosResponse} from "axios";
import api from "../../http";
import {IUser} from "../../models/IUser";
import {USER_URL} from "../../http";
import {SuccessResponse} from "../../models/response/ListsResponse/SuccessResponse";

export default class UserService {
	static fetchUsers(): Promise<
		AxiosResponse<{status: number; users: IUser[]}>
	> {
		return api.get<{status: number; users: IUser[]}>(`${USER_URL}/users`);
	}

	static deleteAccount(
		password: string
	): Promise<AxiosResponse<{statusCode: number; message: String}>> {
		return api.post<{statusCode: number; message: String}>(
			`${USER_URL}/user/delete`,
			{password}
		);
	}

	static async sendVerificationCode(): Promise<SuccessResponse> {
		try {
			const response = await api.post(`${USER_URL}/user/sendCode`);
			return {statusCode: response.status, message: response.data};
		} catch (error: any) {
			const statusCode = error.response?.status || 500;
			const message =
				error.response?.data ||
				error.message ||
				"Send verification failed";

			const updateError = new Error(message);
			(updateError as any).statusCode = statusCode;

			throw updateError;
		}
	}

	static async changePassword(
		passSecond: string,
		newPassword: string
	): Promise<SuccessResponse> {
		try {
			const response = await api.post(`${USER_URL}/user/changePassword`, {
				passSecond,
				newPassword,
			});
			return {
				statusCode: response.status,
				message: response.data.message,
			};
		} catch (error: any) {
			const message =
				error.response?.data ||
				error.message ||
				"Changing password failed";

			throw new Error(message);
		}
	}
}
