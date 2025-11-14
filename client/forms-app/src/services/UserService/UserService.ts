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

	static sendVerificationCode(): Promise<SuccessResponse> {
		try {
			const response = await api.get(`${USER_URL}/sendCode`);
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
}
