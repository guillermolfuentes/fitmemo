import React, { useCallback, useContext, useState } from "react";
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

  const [exerciseLoadProgress, setExerciseLoadProgress] = useState<
    { date: string; maxLoad: number }[]
  >([]);

  const [muscleGroupVolumeProgress, setMuscleGroupVolumeProgress] = useState<
    { date: string; totalVolume: number }[]
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
          setBodyProgress(progress);
          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching body progress", error);
          showErrorSnackbar("Error fetching body progress. Retry later.");
        } finally {
          setLoading(false);
        }
      };

      const fetchExerciseLoadProgress = async () => {
        try {
          setLoading(true);
          const session = await getCurrentSession();

          const exerciseLoadProgress = [
            { date: "2024-12-12", maxLoad: 80 },
            { date: "2024-12-12", maxLoad: 81 },
            { date: "2024-12-12", maxLoad: 83 },
            { date: "2024-12-12", maxLoad: 83 },
          ];

          setExerciseLoadProgress(exerciseLoadProgress);

          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching exercise load progress", error);
          showErrorSnackbar(
            "Error fetching exercise load progress. Retry later."
          );
        } finally {
          setLoading(false);
        }
      };

      const fetchMuscleGroupVolumeProgress = async () => {
        try {
          setLoading(true);
          const session = await getCurrentSession();

          const muscleGroupVolumeProgress = [
            { date: "2024-12-12", totalVolume: 800 },
            { date: "2024-12-12", totalVolume: 498 },
            { date: "2024-12-12", totalVolume: 83 },
            { date: "2024-12-12", totalVolume: 83 },
          ];

          setMuscleGroupVolumeProgress(muscleGroupVolumeProgress);

          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching muscle group volume progress", error);
          showErrorSnackbar(
            "Error fetching muscle groyp volume progress. Retry later."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchExercises();
      fetchExerciseLoadProgress();
      fetchMuscleGroupVolumeProgress();
      fetchBodyProgress();
    }, [dataLoaded])
  );

  const handleNewMeasurement = () => {
    console.log("Añadir medición");
    router.push("/progress/measurements");
  };

  const getExerciseLoadProgressYDomain = (data: any) => {
    if (data.length === 0) return [0, 500] as [number, number];
    const maxLoads = data.map((d: any) => d.maxLoad);
    const minY = Math.min(...maxLoads);
    const maxY = Math.max(...maxLoads);
    const margin = 10;
    return [minY - margin, maxY + margin] as [number, number];
  };

  const getMuscleGroupVolumeProgressYDomain = (data: any) => {
    if (data.length === 0) return [0, 1000] as [number, number];
    const volumes = data.map((d: any) => d.totalVolume);
    const minY = Math.min(...volumes);
    const maxY = Math.max(...volumes);
    const margin = 10;
    return [minY - margin, maxY + margin] as [number, number];
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
            {exerciseLoadProgress.length < 4 && (
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
                exerciseLoadProgress.length > 3
                  ? exerciseLoadProgress
                  : [
                      {
                        date: new Date().toISOString().split("T")[0],
                        maxLoad: 0,
                      },
                      {
                        date: new Date().toISOString().split("T")[0],
                        maxLoad: 0,
                      },
                      {
                        date: new Date().toISOString().split("T")[0],
                        maxLoad: 0,
                      },
                      {
                        date: new Date().toISOString().split("T")[0],
                        maxLoad: 0,
                      },
                    ]
              }
              xKey="date"
              yKeys={["maxLoad"]}
              domain={{
                y: getExerciseLoadProgressYDomain(exerciseLoadProgress),
              }}
              domainPadding={{ left: 50, right: 50, top: 30 }}
              axisOptions={{
                font,
                tickCount: 5,
                formatXLabel: (value) => {
                  const date = new Date(value);
                  return date.toLocaleString("default", { month: "short" });
                },
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.maxLoad}
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
            {muscleGroupVolumeProgress.length < 4 && (
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
                muscleGroupVolumeProgress.length > 3
                  ? muscleGroupVolumeProgress
                  : [
                      {
                        date: new Date().toISOString().split("T")[0],
                        totalVolume: 0,
                      },
                      {
                        date: new Date().toISOString().split("T")[0],
                        totalVolume: 0,
                      },
                      {
                        date: new Date().toISOString().split("T")[0],
                        totalVolume: 0,
                      },
                      {
                        date: new Date().toISOString().split("T")[0],
                        totalVolume: 0,
                      },
                    ]
              }
              xKey="date"
              yKeys={["totalVolume"]}
              domain={{
                y: getMuscleGroupVolumeProgressYDomain(
                  muscleGroupVolumeProgress
                ),
              }}
              domainPadding={{ left: 50, right: 50, top: 30 }}
              axisOptions={{
                font,
                tickCount: 5,
                formatXLabel: (value) => {
                  const date = new Date(value);
                  return date.toLocaleString("default", { month: "short" });
                },
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.totalVolume}
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
