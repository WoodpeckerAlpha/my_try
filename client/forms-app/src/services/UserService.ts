import { AxiosResponse } from "axios";
import api from "../http";
import { IUser } from "../models/IUser";
import { USER_URL } from "../http";

export default class UserService {
    static fetchUsers(): Promise<
        AxiosResponse<{ status: number; users: IUser[] }>
    > {
        return api.get<{ status: number; users: IUser[] }>(`${USER_URL}/users`);
    }

    static deleteAccount(
        password: string
    ): Promise<AxiosResponse<{ statusCode: number; message: String }>> {
        return api.post<{ statusCode: number; message: String }>(
            `${USER_URL}/user/delete`,
            { password }
        );
    }
}
