import { FC, useState, useEffect, useCallback } from "react";
import ListsService from "../../../services/ListService/ListService";
import { ListsResponse } from "../../../models/response/ListsResponse/ListsResponse";
import { IList } from "../../../models/ListsModel/IList";
import ListPlate from "./ListPlate";
import EmptyListPlate from "./EmptyListPlate";
import styles from "./ListsPage.module.css";

const ListPage: FC = () => {
    const [lists, setLists] = useState<IList[]>([]);

    const fetchLists = useCallback(async () => {
        try {
            const data: ListsResponse = await ListsService.getAllLists();
            const arr = Object.values(data);
            setLists(arr);
        } catch (error) {
            console.error("Error while fetching lists", error);
        }
    }, []);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);
    const updateList = useCallback(async (updatedList: IList) => {
        try {
            await ListsService.updateList(
                updatedList.id,
                updatedList.textField
            );
            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === updatedList.id ? updatedList : list
                )
            );
        } catch (error) {
            console.error("Error while updating list", error);
        }
    }, []);

    const deleteList = useCallback(async (deleteListId: string) => {
        try {
            await ListsService.deleteList(deleteListId);
            setLists((prevLists) =>
                prevLists.filter((list) => list.id !== deleteListId)
            );
        } catch (error) {
            console.error("Error while deleting list", error);
        }
    }, []);

    const handleListCreated = useCallback((newList: IList) => {
        setLists((prevLists) => [newList, ...prevLists]);
    }, []);

    return (
        <div className={styles.wrapper}>
            {lists.map((list) => (
                <ListPlate
                    key={list.id}
                    id={list.id}
                    title={list.title}
                    textField={list.textField}
                    onUpdate={updateList}
                    onDelete={deleteList}
                />
            ))}
            <EmptyListPlate onListCreated={handleListCreated} />
        </div>
    );
};

export default ListPage;
