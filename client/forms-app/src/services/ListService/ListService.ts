import { AxiosResponse } from "axios";
import { ListsResponse } from "../../models/response/ListsResponse/ListResponse";
import {
    LIST_SERVICE_URL,
    LISTS_URL,
} from "../../http/Route/ListsRoutes/ListRoutes";

import api from "../../http/index";

export default class ListsService {
    static async getAllLists(): Promise<ListsResponse> {
        const response = await api.get<ListsResponse>(
            `${LISTS_URL}/${LIST_SERVICE_URL}/list`
        );

        return response.data;
    }
}
