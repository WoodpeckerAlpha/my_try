import { IList } from "../../ListsModel/IList";

export interface ListsResponse {
    data: { [key: string]: IList };
}
