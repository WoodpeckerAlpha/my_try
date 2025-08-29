import {FC, useState, useRef, useEffect} from "react";
import ListsService from "../../../services/ListService/ListService";
import styles from "./EmptyListPlate.module.css";

interface EmptyListPlateProps {
	onListCreated?: (newList: any) => void;
}

const EmptyListPlate: FC<EmptyListPlateProps> = ({onListCreated}) => {
	const [isActive, setIsActive] = useState(false);
	const [title, setTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isActive && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isActive]);

	const handleAddClick = () => {
		setIsActive(true);
	};

	const handleCancel = () => {
		setIsActive(false);
		setTitle("");
	};

	const handleCreateList = async () => {
		if (!title.trim()) {
			return;
		}

		setIsLoading(true);
		try {
			const newList = await ListsService.createList({
				title: title.trim(),
			});
			setTitle("");
			setIsActive(false);
			onListCreated?.(newList);
		} catch (error) {
			console.error("Error while creating list", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleCreateList();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	if (!isActive) {
		return (
			<div className={styles.wrapper} onClick={handleAddClick}>
				<button className={styles.addButton}>
					<span className={styles.plus}>+</span>
				</button>
			</div>
		);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.form}>
				<input
					ref={inputRef}
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onKeyDown={handleKeyPress}
					placeholder="Введите название листа"
					className={styles.input}
					disabled={isLoading}
				/>
				<div className={styles.buttons}>
					<button
						onClick={handleCreateList}
						disabled={!title.trim() || isLoading}
						className={styles.confirmButton}
					>
						{isLoading ? "..." : "✓"}
					</button>
					<button
						onClick={handleCancel}
						disabled={isLoading}
						className={styles.cancelButton}
					>
						✕
					</button>
				</div>
			</div>
		</div>
	);
};

export default EmptyListPlate;
