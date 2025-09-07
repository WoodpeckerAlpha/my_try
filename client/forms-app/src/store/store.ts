import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import { AuthResponse } from "../models/response/AuthResponse";
import api, { API_URL, AUTH_URL } from "../http";
import UserService from "../services/UserService";

export default class Store {
    user: IUser | null = null;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser | null) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);

            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log((e as any).response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            console.log("регистрация");

            return true;
        } catch (e) {
            console.log((e as any).response?.data?.message);
            return false;
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response);
            localStorage.removeItem("token");
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log((e as any).response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await api.get<AuthResponse>(
                `${API_URL}${AUTH_URL}/refresh`,
                { withCredentials: true }
            );

            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            localStorage.removeItem("token");
            console.log((e as any).response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async deleteAccount(password: string) {
        this.setLoading(true);
        try {
            const response = await UserService.deleteAccount(password);
            if (response.status === 200) {
                localStorage.removeItem("token");
                this.setAuth(false);
                this.setUser(null);
            }
        } catch (error) {
            console.log((error as any).response?.data?.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
}
