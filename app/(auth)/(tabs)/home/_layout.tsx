import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Pressable } from "react-native";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import UserService from "@/services/userService";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { getCurrentSession } = useContext(AuthContext);
  const { isLoading, setLoading } = useUIContext();

  const [welcomeTitle, setWelcomeTitle] = useState("Bienvenido");

  console.log("Renderizando HomeLayout");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const session = await getCurrentSession();
        const userProfile = await UserService.getUserProfile(
          session!.token!,
          session!.user!.id
        );
        setWelcomeTitle(`Bienvenido, ${userProfile.name}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: welcomeTitle,
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
