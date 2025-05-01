import { AxiosResponse } from "axios";
import api from "../../http";
import { TaskResponse } from "../../models/response/TasksResponse/TaskResponse";
import { TODO_URL } from "../../http/index";

export default class TaskService {
    static async getAllTask(): Promise<AxiosResponse<TaskResponse>> {
        return api.get<TaskResponse>(`${TODO_URL}/task`);
    }

    static async updateTaskStatus(
        taskId: string,
        taskData: {
            title: string;
            description: string;
            status: "pending" | "in_progress" | "complete";
        }
    ): Promise<AxiosResponse<TaskResponse>> {
        return api.put<TaskResponse>(`${TODO_URL}/task`, {
            task: {
                taskId: taskId,
                ...taskData,
            },
        });
    }
}
