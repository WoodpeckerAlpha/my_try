import "./App.css";
import { FC, useContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import ObservedLoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import UserService from "./services/UserService";
import { IUser } from "./models/IUser";
import ListPage from "./components/pages/ListPage/ListsPage";

const App: FC = () => {
    const { store } = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            store.checkAuth();
        }
    }, [store]);

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            const usersData = response.data.users || [];
            setUsers(usersData);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!store.isAuth) {
        return (
            <div className="App">
                <h1 className="unauthorized-plate">
                    Пользователь не авторизован
                </h1>
                <ObservedLoginForm />
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <nav className="navigation">
                    <Link to="/" className="nav-link">
                        Главная
                    </Link>
                    {/* <Link to="/todo" className="nav-link">
                        Задачи
                    </Link> */}
                    <Link to="/list" className="nav-link">
                        Список
                    </Link>
                    <button
                        onClick={() => store.logout()}
                        className="logout-btn"
                    >
                        Выйти
                    </button>
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <h1 className="user-status">
                                    {store.isAuth
                                        ? `Пользователь авторизован: ${store.user.email}`
                                        : "АВТОРИЗУЙТЕСЬ"}
                                </h1>
                                <h1 className="user-status">
                                    {store.user.isActivated
                                        ? "Аккаунт подтвержден по почте"
                                        : "ПОДТВЕРДИТЕ АККАУНТ!!!!"}
                                </h1>
                                <div>
                                    <button
                                        onClick={getUsers}
                                        className="action-btn"
                                    >
                                        Получить пользователей
                                    </button>
                                </div>
                                <div className="user-list">
                                    {users.map((user) => (
                                        <div
                                            key={user.email}
                                            className="user-item"
                                        >
                                            {user.email}
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                    />
                    {/* <Route path="/todo" element={<TodoPage />} /> */}
                    <Route path="/list" element={<ListPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

const ObservedApp = observer(App);
export default ObservedApp;
