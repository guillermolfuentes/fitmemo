import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          title: "Bienvenido, Guillermo",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Entrenamiento",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="dumbbell" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progreso",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-bar" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
