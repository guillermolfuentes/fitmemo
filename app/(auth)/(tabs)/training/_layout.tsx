import { Stack } from "expo-router";
import TrainingScreen from ".";
import TrainingSessionScreen from "./session/start/[sessionId]";
import EditTrainingSessionScreen from "./session/edit/[sessionId]";

export default function TrainingLayout() {
  console.log("Renderizando TrainingLayout");

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="session/start/[sessionId]" />
      <Stack.Screen name="session/edit/[sessionId]" />
      <Stack.Screen name="session/create" />
    </Stack>
  );
}
