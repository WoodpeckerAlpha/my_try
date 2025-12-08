import "./App.css";
import {FC, useContext, useEffect} from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import {Context} from "./index";
import {observer} from "mobx-react-lite";

import ListPage from "./components/pages/ListPage/ListsPage";
import Navigation from "./components/Navigation/Navigation";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import UserStatus from "./components/UserStatus/UserStatus";
import ObservedLoginForm from "./components/LoginForm";
import HomePage from "./components/pages/homePage/HomePage";
import DeletePage from "./components/pages/DeletingPage/DeletePage";
import ChangingPasswordPage from "./components/pages/ChangingPasswordPage/ChangingPasswordPage";
import ActivationPage from "./components/pages/ActivationPage/ActivationPage";

const App: FC = () => {
	const {store} = useContext(Context);

	useEffect(() => {
		store.checkAuth();
	}, [store]);

	if (store.isLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<Router>
			<div className="App">
				{store.isAuth && (
					<PrivateRoute>
						<UserStatus />
					</PrivateRoute>
				)}

				<div className="main_content">
					<Navigation />

					<Routes>
						{!store.isAuth ? (
							<>
								{/* ACTIVATE */}
								<Route
									path="/activate/:activationToken"
									element={<ActivationPage />}
								/>
								{/* LOGIN */}
								<Route
									path="/"
									element={<ObservedLoginForm />}
								/>

								{/* OTHER */}
								<Route
									path="*"
									element={<Navigate to="/" replace />}
								/>
							</>
						) : (
							<>
								{/* HOME */}
								<Route
									path="/home"
									element={
										<PrivateRoute>
											<HomePage />
										</PrivateRoute>
									}
								/>

								{/* LISTS */}
								<Route
									path="/lists"
									element={
										<PrivateRoute>
											<ListPage />
										</PrivateRoute>
									}
								/>
								{/* DELETEACCOUNT */}
								<Route
									path="/deleteAccount"
									element={
										<PrivateRoute>
											<DeletePage />
										</PrivateRoute>
									}
								/>
								{/* CHANGEPASSWORD */}
								<Route
									path="/changePassword"
									element={
										<PrivateRoute>
											<ChangingPasswordPage />
										</PrivateRoute>
									}
								/>

								{/* Любой неправильный путь → /home */}
								<Route
									path="*"
									element={<Navigate to="/home" replace />}
								/>
							</>
						)}
					</Routes>
				</div>

				{store.isAuth && (
					<PrivateRoute>
						<div className="place_holder">place_holder</div>
					</PrivateRoute>
				)}
			</div>
		</Router>
	);
};

export default observer(App);
