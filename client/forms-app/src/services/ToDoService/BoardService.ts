import {AxiosResponse} from "axios";
import api from "../../http";
import {TODO_URL, BOARDS_URL} from "../../http/ToDoRouters";

import {AllBoardResponse} from "../../models/response/ToDoResponse/ToDoResponse";

export default class BoardService {
	static async getAllBoards(): Promise<AxiosResponse<AllBoardResponse>> {
		const apiResponse = await api.get<AllBoardResponse>(
			`${TODO_URL}/${BOARDS_URL}/boards`
		);
		

		return apiResponse;
	}

	static async setBoardTitle(
		boardId: any,
		newTitle: string
	): Promise<AxiosResponse<any>> {
		const apiResponse = api.post<any>(
			`${TODO_URL}/${BOARDS_URL}/updateBoardTitle`,
			{
				boardId,
				newTitle,
			}
		);

		return (await apiResponse).data;
	}
}
