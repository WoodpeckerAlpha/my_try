import {FC, useContext, useState} from "react";
import {Context} from "../../index";
import {Link} from "react-router-dom";

const UserStatus: FC = () => {
	const {store} = useContext(Context);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	// const handleSendVerificationCode = () => {
	//     await UserStatusService
	// }

	return (
		<div className="userStatusWrapper">
			<div className="header">
				<button onClick={toggleMenu}>
					<img
						src="client/forms-app/src/Media/UserStatus/listIcon.svg"
						alt="="
					/>
				</button>
			</div>

			{isMenuOpen && (
				<div className="dropdown-menu">
					<div className="dropdown-menu-block">
						<div className="dropdown-menu-textBox">
							{store.user?.email}
						</div>
						<div className="dropdown-menu-textBox">
							заглушка под _ID
						</div>
					</div>

					<div className="dropdown-menu-block">
						<button>
							<div className="dropdown-menu-textBox">
								Send verification code
							</div>
						</button>
						<button>
							<div className="dropdown-menu-textBox">
								Change Password
							</div>
						</button>

						<Link to="/deleteAccount" className="nav-link">
							<div className="dropdown-menu-textBox">
								delete account
							</div>
						</Link>
					</div>

					<div className="dropdown-menu-block">
						<button>
							<div className="dropdown-menu-textBox">
								beta access
							</div>
						</button>
					</div>

					<div className="dropdown-menu-block">
						<button onClick={() => store.logout()}>
							<div className="dropdown-menu-textBox">logout</div>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserStatus;
