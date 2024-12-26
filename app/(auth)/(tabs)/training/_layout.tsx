import { Stack } from "expo-router";
import TrainingScreen from ".";
import TrainingSessionScreen from "./session/start/[sessionId]";
import EditTrainingSessionScreen from "./session/edit/[sessionId]";

export default function TrainingLayout() {
  console.log("Renderizando TrainingLayout");

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="session/start/[sessionId]"
        options={{ title: "Registro de sesión" }}
      />
      <Stack.Screen
        name="session/edit/[sessionId]"
        options={{ title: "Editar sesión" }}
      />
      <Stack.Screen name="session/create" options={{ title: "Nueva sesión" }} />
      <Stack.Screen
        name="session/add-exercise"
        options={{ title: "Añadir ejercicio" }}
      />
    </Stack>
  );
}
