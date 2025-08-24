import { FC, useState, useEffect } from "react";

import ListsService from "../../../services/ListService/ListService";
import { ListsResponse } from "../../../models/response/ListsResponse/ListResponse";
import { IList } from "../../../models/ListsModel/IList";
import ListPlate from "./ListPlate";

const ListPage: FC = () => {
    const [lists, setLists] = useState<IList[]>([]);
    useEffect(() => {
        const fetchList = async () => {
            try {
                const data: ListsResponse = await ListsService.getAllLists();
                const arr = Object.values(data);
                setLists(arr);
            } catch (error) {
                console.error("Error while fetching lists", error);
            }
        };
        fetchList();
    }, []);

    useEffect(() => {
        console.log("lists обновился:", lists);
    }, [lists]);
    return (
        <div>
            {lists.map((list) => (
                <ListPlate
                    key={list.id}
                    id={list.id}
                    title={list.title}
                    textField={list.textField}
                />
            ))}
        </div>
    );
};

export default ListPage;
