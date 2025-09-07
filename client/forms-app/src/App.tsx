// src/App.tsx
import "./App.css";
import { FC, useContext, useEffect } from "react";
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

import ListPage from "./components/pages/ListPage/ListsPage";
import DeletingPage from "./components/pages/DeletingPage/DeletePage";

const App: FC = () => {
    const { store } = useContext(Context);

    useEffect(() => {
        store.checkAuth(); // асинхронная проверка токена
    }, [store]);

    if (store.isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <Router>
            <div className="App">
                {store.isAuth && (
                    <nav className="navigation">
                        <Link to="/" className="nav-link">
                            Главная
                        </Link>

                        <Link to="/list" className="nav-link">
                            Список
                        </Link>

                        <Link to="/deleteAccount" className="nav-link">
                            Удалить Аккаунт
                        </Link>

                        <button
                            onClick={() => store.logout()}
                            className="logout-btn"
                        >
                            Выйти
                        </button>
                    </nav>
                )}

                <Routes>
                    <Route
                        path="/"
                        element={
                            store.isAuth ? (
                                <>
                                    <h1 className="user-status">
                                        Пользователь авторизован:{" "}
                                        {store.user?.email}
                                    </h1>
                                    <h1 className="user-status">
                                        {store.user?.isActivated
                                            ? "Аккаунт подтвержден по почте"
                                            : "ПОДТВЕРДИТЕ АККАУНТ!!!!"}
                                    </h1>
                                </>
                            ) : (
                                <ObservedLoginForm />
                            )
                        }
                    />
                    <Route
                        path="/list"
                        element={
                            store.isAuth ? (
                                <ListPage />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/deleteAccount"
                        element={
                            store.isAuth ? (
                                <DeletingPage />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default observer(App);
