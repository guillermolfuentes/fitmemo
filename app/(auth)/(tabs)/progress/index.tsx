import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "@/components/Themed";
import { useFocusEffect, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { CartesianChart, Bar, Line } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import Colors from "@/constants/Colors";

const inter = require("../../../../assets/fonts/SpaceMono-Regular.ttf");

/*const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));*/

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

const data2 = [
  { month: 1, listenCount: 21 },
  { month: 2, listenCount: 80 },
  { month: 3, listenCount: 60 },
  { month: 4, listenCount: 95 },
  { month: 5, listenCount: 40 },
  { month: 6, listenCount: 88 },
  { month: 7, listenCount: 10 },
  { month: 8, listenCount: 91 },
  { month: 9, listenCount: 6 },
  { month: 10, listenCount: 30 },
];

const data3 = [
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
  const navigation = useNavigation();
  //const [data, setData] = useState(DATA(5));
  const font = useFont(inter, 12);
  const colorScheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Mi progreso",
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas de rendimiento</Text>
        <Text style={styles.chartTitle}>
          Progresión de cargas por ejercicio
        </Text>
        <View style={styles.chartContainer}>
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
        <Text style={styles.chartTitle}>
          Progresión del volumen por grupo muscular
        </Text>
        <View style={styles.chartContainer}>
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
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas corporales</Text>
        <Text style={styles.chartTitle}>Evolución peso corporal </Text>
        <View style={styles.chartContainer}>
          <CartesianChart
            data={data3}
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
              <Line
                points={points.listenCount}
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
    padding: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  chartContainer: {
    height: 250,
    width: "100%",
  },
});
