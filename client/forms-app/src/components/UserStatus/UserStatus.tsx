import {FC, useContext, useState} from "react";
import {Context} from "../../index";
import {Link} from "react-router-dom";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import PrivateRoute from "../PrivateRoute/ProvateRoute";
import DeletingPage from "../pages/DeletingPage/DeletePage";

const UserStatus: FC = () => {
	const {store} = useContext(Context);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

    

	return (
		<div className="userStatusWrapper">
			<div className="header">
				<button onClick={toggleMenu}>
					<img
						src="client\forms-app\src\Media\UserStatus\listIcon.svg"
						alt="="
					/>
				</button>
			</div>
			{isMenuOpen && (
				<div className="dropdown-menu">
					<div className="dropdown-menu-block">
						<div className="dropdown-menu-textBox">{`${store.user?.email}`}</div>
						<div className="dropdown-menu-textBox">
							заглушка под _ID
						</div>
					</div>
					<div className="dropdown-menu-block">
						Link
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
								bata access
							</div>
						</button>
					</div>
					<div className="dropdown-menu-block">
						<button>
							<div className="dropdown-menu-textBox">logout</div>
						</button>
					</div>
				</div>
			)}
			<Router>
				<Route
					path="/deleteAccount"
					element={
						<PrivateRoute>
							<DeletingPage></DeletingPage>
						</PrivateRoute>
					}
				/>
			</Router>
		</div>
	);
};

export default UserStatus;
