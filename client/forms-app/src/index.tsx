import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import ObservedApp from "./App";
import Store from "./store/store";

interface State {
    store: Store;
}

const store = new Store();

export const Context = createContext<State>({
    store,
});

const rootElement = document.getElementById("root")!;

const root = ReactDOM.createRoot(rootElement);
root.render(
    <Context.Provider value={{ store }}>
        <ObservedApp />
    </Context.Provider>
);
