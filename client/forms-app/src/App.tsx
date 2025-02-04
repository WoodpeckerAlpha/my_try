import "./App.css"; // Импортируем стили
import { FC, useContext, useEffect, useState } from "react";

import ObservedLoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import UserService from "./services/UserService";
import { IUser } from "./models/IUser";

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
            setUsers(response.data);
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
        <div className="App">
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
            <button onClick={() => store.logout()}>Выйти</button>
            <div>
                <button onClick={getUsers}>Получить пользователей</button>
            </div>
            <div className="user-list">
                {users.map((user) => (
                    <div key={user.email} className="user-item">
                        {user.email}
                    </div>
                ))}
            </div>
            <div>
                <button
                    onClick={() => {
                        console.log(store);
                    }}
                >
                    test
                </button>
            </div>
        </div>
    );
};

const ObservedApp = observer(App);
export default ObservedApp;
