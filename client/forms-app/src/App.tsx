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
				<Navigation></Navigation>
				<PrivateRoute>
					<UserStatus></UserStatus>
				</PrivateRoute>
				<Routes>
					<Route
						path="/"
						element={<ObservedLoginForm></ObservedLoginForm>}
					></Route>
					<Route
						path="/list"
						element={
							<PrivateRoute>
								<ListPage></ListPage>
							</PrivateRoute>
						}
					/>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</Router>
	);
};

export default observer(App);
