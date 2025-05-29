import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useTranslation } from "react-i18next";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  console.log("Renderizando TabLayout");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.

        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: t("screens.home.tab_label"),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: t("screens.training.tab_label"),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="dumbbell" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t("screens.progress.tab_label"),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-bar" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
