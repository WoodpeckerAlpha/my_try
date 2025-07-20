import {FC, useState} from "react";

const EmptyTextPlate: FC<any> = ({
	initialText,
	placeholder = "Введите текст",
	onSave,
	className = "",
}) => {
	const [isEditing, setIsEditing] = useState(!initialText);
	const [text, setText] = useState(initialText);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		const trimmedText = text.trim();
		if (trimmedText) {
			setIsSaving(true);
			try {
				await onSave(trimmedText);
				setIsEditing(true);
			} catch (error) {
				console.log("Ошибка при сохранении:", error);
			} finally {
				setIsSaving(false);
			}
		}
	};

	if (isEditing) {
		return (
			<div className={`editable-text ${className}`}>
				<input
					type="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={placeholder}
					autoFocus
					disabled={isSaving}
				/>
				<button
					className="editable-text-save"
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? "..." : "✓"}
				</button>
			</div>
		);
	}

	return (
		<div
			className={`editable-text ${className}`}
			onClick={() => setIsEditing(true)}
		>
			<span>{text || placeholder}</span>
		</div>
	);
};

export default EmptyTextPlate;
