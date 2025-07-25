import {makeAutoObservable} from "mobx";

import {IBoards} from "../models/toDoModels/IBoards";

import BoardService from "../services/ToDoService/BoardService";

export default class ToDoStore {
	boards = {} as IBoards;
	isProcessing = false;
	isLoading = false;
	error: string | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setProcessing(bool: boolean) {
		this.isProcessing = bool;
	}

	setLoading(bool: boolean) {
		this.isLoading = bool;
	}

	async getAllBoards() {
		this.setLoading(true);
		this.error = null;

		try {
			const response = await BoardService.getAllBoards();
			console.log("API Response:", response);
			this.boards = response.data;
			console.log("Updated boards:", this.boards);
		} catch (error: any) {
			this.error = error.message || "Failed to fetch boards";
			console.error("Error in getAllBoards:", error);
		} finally {
			this.setLoading(false);
		}
	}
}
