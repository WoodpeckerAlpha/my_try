import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Task from "./components/task";

import TaskService from "../../../services/ToDo/todoService";

import { IBoard } from "../../../models/response/TasksResponse/IBoard";

const TodoPage: FC = () => {
    const [boards, setBoards] = useState<IBoard[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function getTasks() {
        try {
            setLoading(true);
            const response = await TaskService.getAllTask();

            setBoards(response.data.data.boards);

            setError(null);
        } catch (e) {
            console.error("Error fetching tasks:", e);
            setError("Failed to load tasks");
            setBoards(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTasks();
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="todo-page">
            <h1>Страница с задачами</h1>
            <p>Здесь будет список ваших задач</p>
            <div className="boards-container">
                {boards && boards?.length > 0 ? (
                    boards.map((board) => (
                        <div key={board.id} className="board-card">
                            <h2>{board.title}</h2>
                            <div className="task-wrapper">
                                {board.tasks && board.tasks.length > 0 ? (
                                    board.tasks.map((task) => (
                                        <Task key={task.id} {...task} />
                                    ))
                                ) : (
                                    <p>Нет задач</p>
                                )}
                            </div>{" "}
                        </div>
                    ))
                ) : (
                    <p>Нет доступных досок</p>
                )}
            </div>
            <Link to="/" className="back-link">
                Вернуться на главную
            </Link>
        </div>
    );
};

export default TodoPage;
