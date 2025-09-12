const UserStatusHeader = ({isActive}: {isActive: boolean}) => {
	return (
		<div style={{color: isActive ? "green" : "gray"}}>
			{isActive ? "Online" : "Offline"}
		</div>
	);
};

export default UserStatusHeader;
