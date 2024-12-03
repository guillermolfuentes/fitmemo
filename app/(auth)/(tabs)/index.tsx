import React, { useContext } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import AchievementCard from "@/components/AchievementCard";
import AdviceCard from "@/components/AdviceCard";

export default function TabOneScreen() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.achievementsContainer}>
        <ScrollView horizontal>
          <AchievementCard
            image="https://static.chollometro.com/threads/raw/JAfE8/1416303_1/re/1024x1024/qt/60/1416303_1.jpg"
            title="Sesiones totales"
            achievement="100 sesiones"
          />
          <AchievementCard
            image="https://static.chollometro.com/threads/raw/JAfE8/1416303_1/re/1024x1024/qt/60/1416303_1.jpg"
            title="Kilos levantados"
            achievement="15.084 kgs."
          />
          <AchievementCard
            image="https://static.chollometro.com/threads/raw/JAfE8/1416303_1/re/1024x1024/qt/60/1416303_1.jpg"
            title="Media semanal"
            achievement="4 sesiones"
          />
        </ScrollView>
      </View>
      <View style={styles.adviceContainer}>
        <AdviceCard
          title="Consejo del Día"
          advice="Bebe al menos 2 litros de agua."
          scientificExplanation="El agua es esencial para mantener la hidratación y el buen funcionamiento del cuerpo."
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
