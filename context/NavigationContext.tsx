import React, { createContext, useState, useContext, useEffect } from "react";

type NavigationContextType = {
  setData: (screenName: string, value: any) => void;
  getData: (screenName: string) => any;
  clearData: (screenName: string) => void;
};

export const NavigationContext = createContext<NavigationContextType>({
  setData: () => {},
  getData: () => null,
  clearData: () => {},
});

export function NavigationProvider(props: React.PropsWithChildren) {
  const [screenProps, setScreenProps] = useState<Record<string, any>>({});

  const setData = (screenName: string, value: any) => {
    setScreenProps((prevData) => ({
      ...prevData,
      [screenName]: value,
    }));
  };

  const getData = (screenName: string) => {
    return screenProps[screenName];
  };

  const clearData = (screenName: string) => {
    setScreenProps((prevData) => {
      const newData = { ...prevData };
      delete newData[screenName];
      return newData;
    });
  };

  useEffect(() => {
    console.log("NavigationContext: los datos han cambiado:", screenProps);
  }, [screenProps]);

  return (
    <NavigationContext.Provider
      value={{ setData, getData, clearData }}
    >
      {props.children}
    </NavigationContext.Provider>
  );
}
