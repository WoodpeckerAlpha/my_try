import {FC, useState, useEffect} from "react";
import {Link} from "react-router-dom";
import TaskService from "../../../services/ToDo/todoService";
import {TaskResponse} from "../../../models/response/TasksResponse/TaskResponse";
import BoardCard from "./components/BoardsCard";

const TodoPage: FC = () => {
	const [boards, setBoards] = useState<TaskResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function getTasks() {
		try {
			setLoading(true);
			const response = await TaskService.getAllTask();
			console.log("Response data:", response.data);

			setBoards(response.data);
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
		console.log();
	}, []);

	if (loading) {
		return <div>Загрузка...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!boards) {
		return <div>Нет данных о досках</div>;
	}

	return (
		<div className="todo-page">
			<h1>Страница с задачами</h1>
			<p>Здесь будет список ваших задач</p>
			<div className="boardsPlate">
				{boards.map((board) => (
					<div key={board.id} className="boardCard">
						<BoardCard board={board} />
					</div>
				))}
			</div>
			<Link to="/" className="back-link">
				Вернуться на главную
			</Link>
		</div>
	);
};

export default TodoPage;
