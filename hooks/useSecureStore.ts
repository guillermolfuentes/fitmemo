import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

type UseSecureStoreHook = {
  value: string | null;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
};

export function useSecureStore(key: string): UseSecureStoreHook {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedValue = await SecureStore.getItemAsync(key);
      setValue(storedValue);
    })();
  }, [key]);

  const getItem = (key: string) => {
    return value;
  };

  const setItem = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
    setValue(value);
  };

  const deleteItem = async (key: string) => {
    await SecureStore.deleteItemAsync(key);
    setValue(null);
  };

  return { value, getItem, setItem, deleteItem };
}
