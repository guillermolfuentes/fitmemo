import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { Pressable } from "react-native";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import UserService from "@/services/userService";
import { useTranslation } from "react-i18next";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { getCurrentSession } = useContext(AuthContext);
  const { setLoading } = useUIContext();
  const { t } = useTranslation();

  const [welcomeTitle, setWelcomeTitle] = useState(
    `${t("screens.home.welcome_message")}`
  );

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
        setWelcomeTitle(
          `${t("screens.home.welcome_message")} ${userProfile.name}`
        );
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
