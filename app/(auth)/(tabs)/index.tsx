import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AchievementCard from "@/components/AchievementCard";
import AdviceCard from "@/components/AdviceCard";


export default function TabOneScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.achievementsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <AchievementCard
            image={require("../../../assets/images/total-sessions.png")}
            title="Sesiones totales"
            achievement="100 sesiones"
          />
          <AchievementCard
            image={require("../../../assets/images/total-weight.png")}
            title="Kilos levantados"
            achievement="15.084 kgs."
          />
          <AchievementCard
            image={require("../../../assets/images/weekly-average.png")}
            title="Media semanal"
            achievement="4 sesiones"
          />
        </ScrollView>
      </View>
      <View style={styles.adviceContainer}>
        <AdviceCard
          adviceTitle="Incrementa gradualmente la carga"
          advice="Aumento el peso o las repeticiones de tus ejercicios cada 1-2 semanas. Este principio, conocido como sobrecarga progresiva, es esencial para estimular el crecimiento muscular."
          scientificExplanation="Estudios muestran que la sobrecarga progresiva aumenta la síntesis de proteínas musculares, lo cual es clave para la hipertrofia. Mantenerse con la misma carga y repeticiones por mucho tiempo puede estancar los resultados."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  achievementsContainer: {
    flex: 3,
    flexDirection: "row",
    
  },
  adviceContainer: {
    flex: 7,
    justifyContent: "center",
    padding: 10,
    
  },
});
