// src/components/pages/DeletingPage/DeletePage.tsx
import { FC, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";

const DeletingPage: FC = () => {
    const { store } = useContext(Context);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!password) {
            setError("Введите пароль для подтверждения");
            return;
        }

        setError("");

        try {
            await store.deleteAccount(password);
        } catch (e: any) {
            setError(
                e.response?.data?.message || "Ошибка при удалении аккаунта"
            );
        }
    };

    return (
        <div className="delete-page">
            <h1>Удаление аккаунта</h1>
            <p>
                Введите пароль для подтверждения удаления аккаунта. Это действие
                необратимо!
            </p>

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={store.isLoading}
            />

            {error && <p className="error">{error}</p>}

            <button onClick={handleDelete} disabled={store.isLoading}>
                {store.isLoading ? "Удаление..." : "Удалить аккаунт"}
            </button>
        </div>
    );
};

export default observer(DeletingPage);
