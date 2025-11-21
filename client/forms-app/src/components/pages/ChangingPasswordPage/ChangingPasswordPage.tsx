import {FC, useState} from "react";
import UserService from "../../../services/UserService/UserService";

import ModalFrame from "../../Utils/ModalFrame/ModalFrame";

const ChangingPasswordPage: FC = () => {
	const [passwordFirst, setPasswordFirst] = useState<string>("");
	const [passwordSecond, setPasswordSecond] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [modalMessage, setModalMessage] = useState<string>("");

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	const handleChangePassword = async () => {
		try {
			if (passwordFirst !== passwordSecond) {
				setIsSuccess(false);
				setIsModalOpen(true);
				setModalMessage("Введеные пароли не совпадают");
				setTimeout(() => {
					setIsModalOpen(false);
				}, 3000);
			}

			const message = await UserService.changePassword(
				passwordSecond,
				newPassword
			);
			console.log(message);

			setModalMessage(`${message.message}`);
			setIsSuccess(true);
			setIsModalOpen(true);

			setTimeout(() => {
				setIsModalOpen(false);
			}, 3000);
		} catch (error: any) {
			setModalMessage(error.message || "Failed to change password");
			setIsSuccess(false);
			setIsModalOpen(true);

			setTimeout(() => {
				setIsModalOpen(false);
			}, 3000);
		}
	};

	return (
		<div>
			<div>Введите ваш текущий пароль</div>
			<input
				onChange={(e) => setPasswordFirst(e.target.value)}
				value={passwordFirst}
				type="password"
				placeholder="Пароль"
			/>
			<div>Повторите ваш текущий пароль</div>
			<input
				onChange={(e) => setPasswordSecond(e.target.value)}
				value={passwordSecond}
				type="password"
				placeholder="Пароль"
			/>
			<div>Введите новый пароль</div>
			<input
				onChange={(e) => setNewPassword(e.target.value)}
				value={newPassword}
				type="password"
				placeholder="Пароль"
			/>
			<button onClick={handleChangePassword}>Сменить пароль</button>

			{isModalOpen && (
				<ModalFrame
					onClose={() => setIsModalOpen(false)}
					type={isSuccess ? "success" : "error"}
				>
					<div
						className={`modal-content ${
							isSuccess ? "success" : "error"
						}`}
					>
						<h3>{isSuccess ? "Success" : "Error"}</h3>
						<p>{modalMessage}</p>
					</div>
				</ModalFrame>
			)}
		</div>
	);
};

export default ChangingPasswordPage;
