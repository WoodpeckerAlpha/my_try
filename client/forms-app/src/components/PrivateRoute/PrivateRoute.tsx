import {FC, ReactNode, useContext} from "react";
import {Context} from "../../index";
import {Navigate} from "react-router-dom";

interface PrivateRouteProps {
	children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({children}) => {
	const {store} = useContext(Context);

	if (!store.isAuth) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

export default PrivateRoute;
