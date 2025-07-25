import {useState, useEffect} from "react";
import EmptyTextPlate from "./EmptyTextPlate";
import BoardService from "../../../../services/ToDoService/BoardService";

const BoardPlate = ({boardId, initialBoard, onBoardUpdate}: any) => {
	const [currentBoard, setCurrentBoard] = useState(() => {
		return {
			boardId: boardId || "",
			title: initialBoard?.title ?? null,
		};
	});

	useEffect(() => {
		setCurrentBoard((prev) => ({
			...prev,
			boardId: boardId || "",
			title: initialBoard?.title ?? null,
		}));
	}, [boardId, initialBoard]);

	const handleSaveBoardTitle = async (title: any) => {
		try {
			const updatedBoard: any = await BoardService.setBoardTitle(
				currentBoard.boardId,
				title
			);

			setCurrentBoard((prev) => ({
				...prev,
				title: updatedBoard.title,
			}));

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
