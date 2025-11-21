import {FC, ReactNode} from "react";

interface ModalFrameProps {
	onClose: () => void;
	type?: "success" | "error" | "info";
	children: ReactNode;
}

const ModalFrame: FC<ModalFrameProps> = ({
	onClose,
	type = "info",
	children,
}) => {
	// Определяем стили в зависимости от типа
	const getModalStyles = () => {
		switch (type) {
			case "success":
				return {
					border: "2px solid green",
					backgroundColor: "#f0fff0",
				};
			case "error":
				return {
					border: "2px solid red",
					backgroundColor: "#fff0f0",
				};
			default:
				return {
					border: "2px solid blue",
					backgroundColor: "#f0f0ff",
				};
		}
	};

	return (
		<div
			className="modal-overlay"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 1000,
			}}
			onClick={onClose}
		>
			<div
				className="modal-content"
				style={{
					...getModalStyles(),
					padding: "20px",
					borderRadius: "8px",
					minWidth: "300px",
					maxWidth: "500px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};

export default ModalFrame;
