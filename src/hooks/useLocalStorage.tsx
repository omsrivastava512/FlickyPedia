import { useEffect, useState } from "react"
import { StateSetter } from "../types";

const useLocalStorage = <T,>(initialValue: T, storageKey: string):[T,StateSetter<T>] => {
    const [value, setValue] = useState<T>(()=>getLocalData(storageKey) || initialValue); 
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(value))
    }, [value, storageKey])

    return [value, setValue]
}

export default useLocalStorage;

const getLocalData = <T,>(key: string): T | null => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;
    try {
        return JSON.parse(storedValue) as T;
    } catch {
        return null;
    }
};
