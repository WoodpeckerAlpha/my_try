import {AxiosResponse} from "axios";
import api from "../../http";
// import {AllBoardResponse} from "../../models/response/ToDoResponse/ToDoResponse";
import {TODO_URL, BOARDS_URL} from "../../http/ToDoRouters";

export default class BoardService {
	static async getAllBoards(): Promise<AxiosResponse<any>> {
		return api.get<any>(`${TODO_URL}/${BOARDS_URL}/boards`);
	}

	static async setBoardTitle(
		boardId: any,
		newTitle: string
	): Promise<AxiosResponse<any>> {
		return api.post<any>(`${TODO_URL}/${BOARDS_URL}/board/${boardId}`, {
			boardId,
			newTitle,
		});
	}
}
