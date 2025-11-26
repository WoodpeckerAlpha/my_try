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
			<Link to="/lists" className="nav-link">
				Списки
			</Link>
		</nav>
	);
};

export default Navigation;
