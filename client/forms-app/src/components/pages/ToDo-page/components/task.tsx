import { FC, useState } from "react";
import { ITask } from "../../../../models/response/TasksResponse/ITask";
import todoService from "../../../../services/ToDo/todoService";

import "./task.css";

const Task: FC<ITask> = ({ id, title, description, status }) => {
    const [currentStatus, setStatus] = useState<string>(status);

    const statusMap: Record<string, string> = {
        pending: "Не начато",
        in_progress: "В процессе",
        complete: "Выполнено",
    };

    type Status = "pending" | "in_progress" | "complete";

    const handleStatusChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newStatus = event.target.value as Status;
        setStatus(newStatus);

        try {
            await todoService.updateTaskStatus(id, {
                title,
                description,
                status: newStatus,
            });
        } catch (err) {
            console.error("Ошибка обновления статуса:", err);
        }
    };

    return (
        <div className="task">
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="status-radio-group">
                {Object.entries(statusMap).map(([value, label]) => (
                    <label key={value}>
                        <input
                            type="radio"
                            name={`status-${id}`}
                            value={value}
                            checked={currentStatus === value}
                            onChange={handleStatusChange}
                        />
                        <div className={`custom-radio ${value}`} />
                        <span>{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Task;
