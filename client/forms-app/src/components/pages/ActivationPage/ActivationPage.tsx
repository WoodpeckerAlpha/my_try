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
		let timeoutId: NodeJS.Timeout;

		const activateAccount = async () => {
			try {
				setIsLoading(true);
				setMessage("Начинаем активацию...");

				const response = await axios.get(
					`http://localhost:5000/api/activate/${activationToken}`
				);

				console.log("Response:", response.data); // Для дебага

				if (response.data.success) {
					setMessage(
						"Аккаунт успешно активирован! Перенаправление через 5 секунд..."
					);
					store.setUserActivate(true);

					// Долгая задержка для дебага
					setTimeout(() => {
						navigate("/");
					}, 5000);
				} else {
					setMessage("Ошибка активации: " + response.data.message);
					console.error("API Error:", response.data);
				}
			} catch (error: any) {
				console.error("Activation error:", error);
				console.error("Error details:", error.response?.data);
				setMessage(
					"Произошла ошибка при активации аккаунта: " +
						(error.response?.data?.message || error.message)
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (activationToken) {
			// Задержка 3 секунды ПЕРЕД запросом (видите компонент до запроса)
			timeoutId = setTimeout(() => {
				console.log("Запускаем активацию с токеном:", activationToken);
				activateAccount();
			}, 3000);
		} else {
			setMessage("Неверная ссылка активации - токен отсутствует");
			console.error("No activation token provided");
			setIsLoading(false);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [activationToken, navigate, store]);

	return <>{message}</>;
};

export default observer(ActivationPage);



// useEffect(() => {
//         setTimeout(() =>{const activateAccount = async () =>{ 
// 			try {
// 				setIsLoading(true);

// 				const response = await axios.get(
// 					`http://localhost:5000/api/activate/${activationToken}`
// 				);

// 				if (response.data.success) {
// 					setMessage(
// 						"Аккаунт успешно активирован! Перенаправление..."
// 					);

// 					store.setUserActivate(true);
// 					setTimeout(() => {
// 						navigate("/");
// 					}, 2000);
// 				} else {
// 					setMessage("Ошибка активации: " + response.data.message);
// 				}
// 			} catch (error) {
// 				console.error("Activation error:", error);
// 				setMessage("Произошла ошибка при активации аккаунта");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		if (activationToken) {
// 			activateAccount();
// 		} else {
// 			setMessage("Неверная ссылка активации");
// 			setIsLoading(false);
// 		}
// 	}, [])},5000)
