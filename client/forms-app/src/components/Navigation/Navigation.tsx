import {FC, useContext} from "react";
import {Link} from "react-router-dom";
import {Context} from "../../index";
import "./Navigation.module.css";

const Navigation: FC = () => {
	const {store} = useContext(Context);

	if (!store.isAuth) return null;

	return (
		<nav>
			<Link to="/" className="nav-link">
				Главная
			</Link>
			<Link to="/list" className="nav-link">
				Списки
			</Link>
			<Link to="/deleteAccount" className="nav-link">
				Удалить аккаунт
			</Link>
			<button onClick={() => store.logout()} className="logout-btn">
				Выйти
			</button>
		</nav>
	);
};

export default Navigation;
