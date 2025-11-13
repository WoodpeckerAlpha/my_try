import "./LoginForm.css";
import {FC, useContext, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";

const LoginForm: FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const {store} = useContext(Context);
	const navigate = useNavigate();

	const handleLogin = async () => {
		await store.login(email, password);
		if (store.isAuth) {
			navigate("/");
		}
	};

	const handleRegistration = async () => {
		const success = await store.registration(email, password);
		if (success) {
			navigate("/");
		}
	};

	return (
		<div className="login-form">
			<input
				onChange={(e) => setEmail(e.target.value)}
				value={email}
				type="text"
				placeholder="Email"
			/>
			<input
				onChange={(e) => setPassword(e.target.value)}
				value={password}
				type="password"
				placeholder="Пароль"
			/>
			<button onClick={handleLogin}>Логин</button>
			<button onClick={handleRegistration}>Регистрация</button>
		</div>
	);
};

const ObservedLoginForm = observer(LoginForm);
export default ObservedLoginForm;
