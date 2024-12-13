import { Stack } from "expo-router";

export default function ProgressLayout() {
  console.log("Renderizando ProgressLayout");

  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
