import {AxiosResponse} from "axios";
import api from "../http";
import {IUser} from "../models/IUser";
import {USER_URL} from "../http";

export default class UserService {
	static fetchUsers(): Promise<
		AxiosResponse<{status: number; users: IUser[]}>
	> {
		return api.get<{status: number; users: IUser[]}>(`${USER_URL}/users`);
	}
}
