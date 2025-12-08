import {FC, useContext, useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";

const ActivationPage: FC = () => {
	const {store} = useContext(Context);
	const {activationToken} = useParams();
	const navigate = useNavigate();
	const [message, setMessage] = useState("Активация аккаунта...");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
        setTimeout(() =>{const activateAccount = async () => 
			try {
				setIsLoading(true);

				const response = await axios.get(
					`http://localhost:5000/api/activate/${activationToken}`
				);

				if (response.data.success) {
					setMessage(
						"Аккаунт успешно активирован! Перенаправление..."
					);

					store.setUserActivate(true);
					setTimeout(() => {
						navigate("/");
					}, 2000);
				} else {
					setMessage("Ошибка активации: " + response.data.message);
				}
			} catch (error) {
				console.error("Activation error:", error);
				setMessage("Произошла ошибка при активации аккаунта");
			} finally {
				setIsLoading(false);
			}
		};

		if (activationToken) {
			activateAccount();
		} else {
			setMessage("Неверная ссылка активации");
			setIsLoading(false);
		}
	}, [])},5000)
		
	return <>{message}</>;
};

export default observer(ActivationPage);
