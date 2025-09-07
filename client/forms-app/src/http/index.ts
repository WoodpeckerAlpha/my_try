import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = process.env.REACT_APP_API_URL; //при проде переделывать process.env.REACT_APP_API_URL, так же в самом файле делать "/api"
// export const API_URL = "localhost:5001/api/";
export const AUTH_URL = "auth";
export const USER_URL = "users";

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    console.log("Запрос:", {
        method: config.method,
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
    });
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

    return config;
});

api.interceptors.response.use(
    (config) => {
        return config;
    },

    async (error) => {
        const originalRequest = error.config;

        // console.log("❌ Ошибка запроса:", {
        //     method: originalRequest?.method,
        //     url: `${originalRequest?.baseURL}${originalRequest?.url}`,
        //     headers: originalRequest?.headers,
        //     data: originalRequest?.data,
        //     status: error.response?.status,
        // });
        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.get<AuthResponse>(
                    `${API_URL}/${AUTH_URL}/refresh`,
                    { withCredentials: true }
                );
                console.log(response);
                localStorage.setItem("token", response.data.accessToken);
                return api.request(originalRequest);
            } catch (e) {
                console.log("НЕ АВТОРИЗОВАН");
            }
        }
        throw error;
    }
);

export default api;
