import {FC, useState, useEffect} from "react";
import {IList} from "../../../models/ListsModel/IList";
import styles from "./ListPlate.module.css";

interface ListPlateProps extends IList {
	onUpdate: (updatedList: IList) => void;
	onDelete: (listId: string) => void;
}

const ListPlate: FC<ListPlateProps> = ({
	id,
	title,
	textField,
	onUpdate,
	onDelete,
}) => {
	const [textAreaValue, setTextareaValue] = useState(textField);
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		setIsChanged(textAreaValue !== textField);
	}, [textAreaValue, textField]);

	const handleBlur = () => {
		if (isChanged) {
			onUpdate({
				id,
				title,
				textField: textAreaValue,
			});
			setIsChanged(false);
		}
	};

	useEffect(() => {
		if (isChanged) {
			const timeoutId = setTimeout(() => {
				onUpdate({
					id,
					title,
					textField: textAreaValue,
				});
				setIsChanged(false);
			}, 1000);

			return () => clearTimeout(timeoutId);
		}
	}, [textAreaValue, isChanged, onUpdate, id, title]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.plate}>
				<h1 className={styles.title}>{title}</h1>
                <button onClick={() => onDelete(id)}>Удалить</button>
				<textarea
					name="textField"
					id={id}
					value={textAreaValue}
					onChange={(e) => setTextareaValue(e.target.value)}
					onBlur={handleBlur}
					className={styles.textarea}
				></textarea>
				{isChanged && (
					<span className={styles.unsaved}>Не сохранено</span>
				)}
			</div>
		</div>
	);
};

export default ListPlate;
