import { Stack, useRouter } from "expo-router";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Pressable } from "react-native";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  console.log("Renderizando HomeLayout");

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Bienvenido, Guillermo",
          headerRight: () => (
            <Pressable
              onPressIn={() => {
                console.log("Pressed!");
                router.push("/home/settings");
              }}
              style={({ pressed }) => ({
                marginRight: 15,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="cog"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Configuraciones",
        }}
      />
    </Stack>
  );
}
