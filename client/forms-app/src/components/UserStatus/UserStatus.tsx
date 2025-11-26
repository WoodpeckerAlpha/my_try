import {FC, useContext, useState} from "react";
import {Link} from "react-router-dom";
import {Context} from "../../index";

import styles from "./UserStatus.module.css";

import UserService from "../../services/UserService/UserService";

import ModalFrame from "../Utils/ModalFrame/ModalFrame";

const UserStatus: FC = () => {
	const {store} = useContext(Context);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [modalMessage, setModalMessage] = useState<string>("");
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const handleSendVerificationCode = async () => {
		try {
			const message = await UserService.sendVerificationCode();

			setModalMessage(`${message.message}`);
			setIsSuccess(true);
			setIsModalOpen(true);

			setTimeout(() => {
				setIsModalOpen(false);
			}, 3000);
		} catch (error: any) {
			setModalMessage(
				error.message.message || "Failed to send verification code"
			);
			setIsSuccess(false);
			setIsModalOpen(true);

			setTimeout(() => {
				setIsModalOpen(false);
			}, 3000);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<button onClick={toggleMenu}>
					<img
						src="client/forms-app/src/Media/UserStatus/listIcon.svg"
						alt="="
					/>
				</button>
			</div>

			{isMenuOpen && (
				<div className={styles.dropdown_menu}>
					<div className="styles.dropdown-menu-block">
						<div className="styles.dropdown-menu-text">email</div>
						<div className="styles.dropdown-menu-textBox">
							{store.user?.email}
						</div>
						{!store.user?.isActivated && (
							<div className="styles.dropdown-menu_textbox">
								Подтвердите почту.
							</div>
						)}

						<div className="styles.dropdown-menu-textBox">
							заглушка под _ID
						</div>
					</div>

					<div className="styles.dropdown-menu-block">
						<button onClick={handleSendVerificationCode}>
							<div className="styles.dropdown-menu-textBox">
								Send verification code
							</div>
						</button>

						<button>
							<Link to="/changePassword">
								<div className="styles.dropdown-menu-textBox">
									Change Password
								</div>
							</Link>
						</button>

						<button>
							<Link to="/deleteAccount">
								<div className="styles.dropdown-menu-textBox">
									delete account
								</div>
							</Link>
						</button>
					</div>

					<div className="styles.dropdown-menu-block">
						<button>
							<div className="styles.dropdown-menu-textBox">
								beta access
							</div>
						</button>
					</div>

					<div className="styles.dropdown-menu-block">
						<button onClick={() => store.logout()}>
							<div className="styles.dropdown-menu-textBox">
								logout
							</div>
						</button>
					</div>
				</div>
			)}
			{/* Модальное окно для отображения статуса */}
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

export default UserStatus;
