import {FC, useEffect, createContext, useContext} from "react";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import ToDoStore from "../../../store/toDoStore";

interface ToDoState {
	toDoStore: ToDoStore;
}

const toDoStore = new ToDoStore();

export const ToDoContext = createContext<ToDoState>({toDoStore});

const TodoPage: FC = () => {
	const {toDoStore} = useContext(ToDoContext);

	useEffect(() => {
		const fetchBoards = async () => {
			try {
				await toDoStore.getAllBoards();
			} catch (error) {
				console.error("Error fetching boards:", error);
			}
		};

		fetchBoards();
	}, [toDoStore]);

	return (
		<div className="todo-page">
			<h1>Страница с задачами</h1>
			<p>Здесь будет список ваших задач</p>
			<Link to="/" className="back-link">
				Вернуться на главную
			</Link>

			{toDoStore.isLoading ? (
				<p>Загрузка...</p>
			) : (
				<div className="boards-list">
					{Object.keys(toDoStore.boards).length > 0 ? (
						Object.entries(toDoStore.boards).map(
							([boardId, board]) => (
								<div key={boardId}>
									Board ID: {boardId}, Title: {board.title}
								</div>
							)
						)
					) : (
						<p>Нет доступных досок</p>
					)}
				</div>
			)}
		</div>
	);
};

export default observer(TodoPage);
