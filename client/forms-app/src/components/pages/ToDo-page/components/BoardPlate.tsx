import {useState, useEffect} from "react";
import EmptyTextPlate from "./EmptyTextPlate";
import BoardService from "../../../../services/ToDoService/BoardService";

const BoardPlate = ({initialBoard, onBoardUpdate}) => {
	// Инициализируем состояние с защитой от undefined
	const [currentBoard, setCurrentBoard] = useState(() => {
		return {
			boardId: initialBoard?.boardId || "",
			title: initialBoard?.title ?? null, // Используем ?? для null/undefined
		};
	});

	useEffect(() => {
		if (initialBoard) {
			setCurrentBoard({
				boardId: initialBoard.boardId || "",
				title: initialBoard.title ?? null,
			});
		}
	}, [initialBoard]);

	const handleSaveBoardTitle = async (newTitle) => {
		try {
			const updatedBoard = await BoardService.setBoardTitle(
				currentBoard.boardId,
				newTitle
			);

			setCurrentBoard(updatedBoard);

			if (onBoardUpdate) {
				onBoardUpdate(updatedBoard);
			}
		} catch (error) {
			console.error("Ошибка при сохранении:", error);
		}
	};

	return (
		<div className="board-plate">
			{currentBoard.title == null ? (
				<EmptyTextPlate
					initialText=""
					onSave={handleSaveBoardTitle}
					placeholder="Добавьте название доски"
					className="board-title"
				/>
			) : (
				<h3>{currentBoard.title}</h3>
			)}
		</div>
	);
};

export default BoardPlate;
