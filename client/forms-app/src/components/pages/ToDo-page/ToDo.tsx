import {FC, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import BoardService from "../../../services/ToDoService/BoardService";
import BoardPlate from "./components/BoardPlate";

const TodoPage: FC = () => {
	const [boards, setBoards] = useState<any[]>([]);

	useEffect(() => {
		const fetchBoards = async () => {
			try {
				const response = await BoardService.getAllBoards();
				setBoards(response.data.data);
			} catch (error) {
				console.log("error while fetching boards", error);
				throw error;
			}
		};
		fetchBoards();
	}, []);

	// useEffect(() => {
	// 	console.log("Состояние boards обновлено:", boards);
	// }, [boards]);

	return (
		<div className="todo-page">
			<h1>Страница с задачами</h1>
			<p>Здесь будет список ваших задач</p>
			<Link to="/" className="back-link">
				Вернуться на главную
			</Link>
			<div className="boards-list">
				{Object.keys(boards).length > 0 ? (
					Object.entries(boards).map(([key, board]) => (
						<BoardPlate key={key} board={board} />
					))
				) : (
					<p>Нет доступных досок</p>
				)}
			</div>
		</div>
	);
};

export default TodoPage;
