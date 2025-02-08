import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "../context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { Slot, usePathname, useRouter } from "expo-router";
import i18n from "../i18n/i18n";
import { I18nextProvider } from "react-i18next";
import LoadingOverlay from "@/components/LoadingOverlay";
import { UIProvider } from "@/context/UIContext";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationProvider } from "@/context/NavigationContext";
import { configureAxios } from "@/services/axiosConfig";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)/(tabs)/home",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && pathname === "/") {
      router.replace("/home");
    }
  }, [router, loaded]);

  useEffect(() => {
    configureAxios();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  //console.log("Renderizando RootLayout");

  return (
    <I18nextProvider i18n={i18n}>
      <UIProvider>
        <SessionProvider>
          <NavigationProvider>
            <PaperProvider>
              <StatusBar style="auto" />
              <Slot />
              <LoadingOverlay />
            </PaperProvider>
          </NavigationProvider>
        </SessionProvider>
      </UIProvider>
    </I18nextProvider>
  );
}
