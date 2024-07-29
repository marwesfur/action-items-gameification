import {createContext, useContext} from "react";

const context = createContext(false);

export const RetroModeProvider = context.Provider;

export function useRetroMode() {
    return useContext(context);
}