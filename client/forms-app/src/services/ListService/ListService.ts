import { ListsResponse } from "../../models/response/ListsResponse/ListsResponse";
import { SuccessResponse } from "../../models/response/ListsResponse/SuccessResponse";

import {
    LIST_SERVICE_URL,
    LISTS_URL,
} from "../../http/Route/ListsRoutes/ListRoutes";

import api from "../../http/index";

export default class ListsService {
    static async getAllLists(): Promise<ListsResponse> {
        try {
            const response = await api.get<ListsResponse>(
                `${LISTS_URL}/${LIST_SERVICE_URL}/list`
            );

            return response.data;
        } catch (error: any) {
            const statusCode = error.response?.status || 500;
            const message =
                error.response?.data || error.message || "Getting failed";

            const updateError = new Error(message);
            (updateError as any).statusCode = statusCode;

            throw updateError;
        }
    }

    static async updateList(
        listId: string,
        textFieldContent: string
    ): Promise<SuccessResponse> {
        try {
            const response = await api.put<string>(
                `${LISTS_URL}/${LIST_SERVICE_URL}/list/${listId}`,
                { data: { textFieldContent } }
            );

            return {
                statusCode: response.status,
                message: response.data,
            };
        } catch (error: any) {
            const statusCode = error.response?.status || 500;
            const message =
                error.response?.data || error.message || "Update failed";

            const updateError = new Error(message);
            (updateError as any).statusCode = statusCode;

            throw updateError;
        }
    }

    static async deleteList(deletedListId: string): Promise<SuccessResponse> {
        try {
            const response = await api.delete<string>(
                `${LISTS_URL}/${LIST_SERVICE_URL}/list/${deletedListId}`
            );
            return {
                statusCode: response.status,
                message: response.data,
            };
        } catch (error: any) {
            const statusCode = error.response?.status || 500;
            const message =
                error.response?.data || error.message || "Delete failed";

            const updateError = new Error(message);
            (updateError as any).statusCode = statusCode;

            throw updateError;
        }
    }

    static async createList(data: { title: string }) {
        try {
            const response = await api.post(
                `${LISTS_URL}/${LIST_SERVICE_URL}/list`,
                { data }
            );
            return response.data;
        } catch (error: any) {
            const statusCode = error.response?.status || 500;
            const message =
                error.response?.data || error.message || "Create failed";

            const updateError = new Error(message);
            (updateError as any).statusCode = statusCode;

            throw updateError;
        }
    }
}
