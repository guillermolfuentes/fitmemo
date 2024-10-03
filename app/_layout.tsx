import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "../context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { Slot } from "expo-router";
import i18n from "../i18n/i18n";
import { I18nextProvider } from "react-i18next";
import LoadingOverlay from "@/components/LoadingOverlay";
import { UIProvider } from "@/context/UIContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  console.log("Renderizando layout incio");


  return (
    <I18nextProvider i18n={i18n}>
      <UIProvider>
        <SessionProvider>
          <PaperProvider>
            <Slot />
            <LoadingOverlay />
          </PaperProvider>
        </SessionProvider>
      </UIProvider>
    </I18nextProvider>
  );
}
