import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

export default function ProgressLayout() {
  console.log("Renderizando ProgressLayout");
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Mi progreso",
        }}
      />
      <Stack.Screen name="measurements" options={{ title: "Measurements" }} />
    </Stack>
  );
}
