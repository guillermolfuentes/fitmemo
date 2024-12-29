import React, { useCallback, useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "@/components/Themed";
import { useFocusEffect, useRouter } from "expo-router";
import { CartesianChart, Bar, Line } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import Colors from "@/constants/Colors";
import { Button, Chip } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { Exercise } from "@/types/training/models/Exercise";
import ExerciseService from "@/services/exerciseService";
import { AuthContext } from "@/context/AuthContext";
import { useUIContext } from "@/context/UIContext";
import StatisticsService from "@/services/statisticsService";

const inter = require("../../../../assets/fonts/SpaceMono-Regular.ttf");

const EXERCISE_OPTIONS = [
  {
    label: "Curl de bíceps",
    value: "1",
  },
  {
    label: "Press de banca",
    value: "2",
  },
  {
    label: "Sentadillas",
    value: "3",
  },
  {
    label: "Peso muerto",
    value: "4",
  },
];

const MUSCLE_OPTIONS = [
  {
    label: "Pecho",
    value: "chest",
  },
  {
    label: "Espalda",
    value: "back",
  },
  {
    label: "Piernas",
    value: "legs",
  },
  {
    label: "Brazos",
    value: "arms",
  },
  {
    label: "Hombros",
    value: "shoulders",
  },
  {
    label: "Abdominales",
    value: "abs",
  },
];

const data1 = [
  { month: 1, listenCount: 2 },
  { month: 2, listenCount: 8 },
  { month: 3, listenCount: 60 },
  { month: 4, listenCount: 95 },
  { month: 5, listenCount: 70 },
  { month: 6, listenCount: 88 },
  { month: 7, listenCount: 10 },
  { month: 8, listenCount: 91 },
  { month: 9, listenCount: 6 },
  { month: 10, listenCount: 30 },
];

const data3 = [
  { date: "2024-01-26", bodyWeight: 21 },
  { date: "2024-02-27", bodyWeight: 80 },
  { date: "2024-07-28", bodyWeight: 60 },
  { date: "2024-12-29", bodyWeight: 95 },
  { date: "2024-12-30", bodyWeight: 40 },
  { date: "2024-12-31", bodyWeight: 88 },
  { date: "2025-01-01", bodyWeight: 10 },
  { date: "2025-01-02", bodyWeight: 91 },
  { date: "2025-01-03", bodyWeight: 6 },
  { date: "2025-01-04", bodyWeight: 30 },
];

const data2 = [
  { month: 1, listenCount: 80 },
  { month: 2, listenCount: 78 },
  { month: 3, listenCount: 76 },
  { month: 4, listenCount: 77 },
  { month: 5, listenCount: 75 },
  { month: 6, listenCount: 75 },
  { month: 7, listenCount: 74 },
  { month: 8, listenCount: 72 },
  { month: 9, listenCount: 68 },
  { month: 10, listenCount: 67 },
];

export default function ProgressScreen() {
  const font = useFont(inter, 12);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { getCurrentSession } = useContext(AuthContext);
  const {
    isLoading,
    setLoading,
    showSuccessSnackbar,
    showErrorSnackbar,
    hideSnackbar,
  } = useUIContext();
  const [muscleGroupSelected, setMuscleGroupSelected] = useState("chest");
  const [exerciseSelected, setExerciseSelected] = useState("1");
  const [exerciseOptions, setExerciseOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [bodyProgress, setBodyProgress] = useState<
    { date: string; bodyWeight: number }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const fetchExercises = async () => {
        try {
          setLoading(true);
          const session = await getCurrentSession();
          const exercises: Exercise[] = await ExerciseService.searchExercises(
            {},
            session.token!
          );
          const options = exercises
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((exercise) => ({
              label: exercise.name,
              value: exercise.id.toString(),
            }));
          setExerciseOptions(options);
          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching exercises", error);
          showErrorSnackbar("Error fetching exercises. Retry later.");
        } finally {
          setLoading(false);
        }
      };

      const fetchBodyProgress = async () => {
        try {
          setLoading(true);
          const session = await getCurrentSession();
          const response = await StatisticsService.getBodyProgress(
            session.token!
          );
          const progress = response.bodyProgress.map((entry) => ({
            date: new Date(entry.date).toISOString().split("T")[0],
            bodyWeight: Number(entry.bodyWeight),
          }));
          if (response.bodyProgress.length >= 4) {
            setBodyProgress(progress);
          }
          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching body progress", error);
          showErrorSnackbar("Error fetching body progress. Retry later.");
        } finally {
          setLoading(false);
        }
      };

      fetchExercises();
      fetchBodyProgress();
    }, [dataLoaded])
  );

  const handleNewMeasurement = () => {
    console.log("Añadir medición");
    router.push("/progress/measurements");
  };

  const getBodyProgressYDomain = (data: any) => {
    if (data.length === 0) return [0, 120] as [number, number];
    const bodyWeights = data.map((d: any) => d.bodyWeight);
    const minY = Math.min(...bodyWeights);
    const maxY = Math.max(...bodyWeights);
    const margin = 10;
    return [minY - margin, maxY + margin] as [number, number];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas de rendimiento</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Progresión de cargas por ejercicio
          </Text>
          <View style={styles.chart}>
            <CartesianChart
              data={data1}
              xKey="month"
              yKeys={["listenCount"]}
              domainPadding={{ left: 50, right: 50, top: 30 }}
              axisOptions={{
                font,
                tickCount: 5,
                formatXLabel: (value) => {
                  const date = new Date(2023, value - 1);
                  return date.toLocaleString("default", { month: "short" });
                },
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.listenCount}
                  chartBounds={chartBounds}
                  animate={{ type: "timing", duration: 1000 }}
                  roundedCorners={{
                    topLeft: 10,
                    topRight: 10,
                  }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 400)}
                    colors={[Colors[colorScheme ?? "light"].text, "#90ee9050"]}
                  />
                </Bar>
              )}
            </CartesianChart>
          </View>
          <Dropdown
            label={"Selecciona ejercicio"}
            options={exerciseOptions}
            hideMenuHeader={true}
            value={exerciseSelected}
            onSelect={(value) => {
              setExerciseSelected(value as string);
              console.log("Ejercicio seleccionado: ", value);
            }}
          />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Progresión del volumen por grupo muscular
          </Text>
          <View style={styles.chart}>
            <CartesianChart
              data={data2}
              xKey="month"
              yKeys={["listenCount"]}
              domainPadding={{ left: 50, right: 50, top: 30 }}
              axisOptions={{
                font,
                tickCount: 5,
                formatXLabel: (value) => {
                  const date = new Date(2023, value - 1);
                  return date.toLocaleString("default", { month: "short" });
                },
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.listenCount}
                  chartBounds={chartBounds}
                  animate={{ type: "timing", duration: 1000 }}
                  roundedCorners={{
                    topLeft: 10,
                    topRight: 10,
                  }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 400)}
                    colors={[Colors[colorScheme ?? "light"].text, "#90ee9050"]}
                  />
                </Bar>
              )}
            </CartesianChart>
            <Dropdown
              label={"Selecciona grupo muscular"}
              options={MUSCLE_OPTIONS}
              hideMenuHeader={true}
              value={muscleGroupSelected}
              onSelect={(value) => {
                setMuscleGroupSelected(value as string);
                console.log("Grupo muscular seleccionado: ", value);
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Estadísticas corporales</Text>
          <Button icon="plus" mode="outlined" onPress={handleNewMeasurement}>
            Añadir
          </Button>
        </View>
        <Text style={styles.chartTitle}>Evolución peso corporal </Text>
        <View style={styles.chart}>
          {bodyProgress.length < 3 && (
            <Chip
              mode="outlined"
              style={{
                borderColor: "red",
                backgroundColor: "white",
              }}
              textStyle={{ color: "red", flexWrap: "wrap" }}
            >
              Próximamente se mostrará la gráfica
            </Chip>
          )}
          <CartesianChart
            data={
              bodyProgress.length > 3
                ? bodyProgress
                : [{ date: "0", bodyWeight: 0 }]
            }
            xKey="date"
            yKeys={["bodyWeight"]}
            domain={{ y: getBodyProgressYDomain(bodyProgress) }}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            axisOptions={{
              font,
              formatXLabel: (value) => {
                let date = new Date(value);
                if (!value) {
                  date = new Date();
                }
                return date.toLocaleString("default", {
                  month: "short",
                });
              },
            }}
          >
            {({ points, chartBounds }) => (
              <Line
                points={points.bodyWeight}
                color="red"
                strokeWidth={3}
                animate={{ type: "timing", duration: 500 }}
              />
            )}
          </CartesianChart>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  section: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  chart: {
    height: 250,
    width: "100%",
  },
});
