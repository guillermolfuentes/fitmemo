import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ProgressLayout() {
  console.log("Renderizando ProgressLayout");
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.progress.title"),
        }}
      />
      <Stack.Screen
        name="measurements"
        options={{
          title: t("screens.progress.add_body_measurement.title"),
        }}
      />
    </Stack>
  );
}
