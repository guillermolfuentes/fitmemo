import React, { useContext, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, PixelRatio } from "react-native";
import AchievementCard from "@/components/home/AchievementCard";
import AdviceCard from "@/components/home/AdviceCard";
import StatisticsService from "@/services/statisticsService";
import TrainingTipsService from "@/services/trainingTipsService";
import { UserAchievementsResponse } from "@/types/home/services/UserAchievementsResponse";
import { TrainingTip } from "@/types/home/models/TrainingTip";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [achievements, setAchievements] = useState<UserAchievementsResponse>();
  const [trainingTip, setTrainingTip] = useState<TrainingTip>();
  const { getCurrentSession } = useContext(AuthContext);
  const { setLoading, showErrorSnackbar } = useUIContext();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const session = await getCurrentSession();
      if (!session || !session.token) {
        throw new Error("Session or token is null");
      }

      const response = await StatisticsService.getUserAchievements(
        session.token
      );
      setAchievements(response);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      showErrorSnackbar("Error fetching achievements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingTip = async () => {
    try {
      setLoading(true);
      const session = await getCurrentSession();
      if (!session || !session.token) {
        throw new Error("Session or token is null");
      }
      const response = await TrainingTipsService.getDailyTrainingTip(
        session.token
      );
      setTrainingTip(response);
    } catch (error) {
      console.error("Error fetching daily training tip:", error);
      showErrorSnackbar(
        "Error fetching daily training tip. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAchievements();
      fetchTrainingTip();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollviewContainer}>
      <View style={styles.achievementsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <AchievementCard
            image={require("../../../../assets/images/total-sessions.png")}
            title="Sesiones totales"
            achievement={
              achievements
                ? `${achievements.totalTrainings} sesiones`
                : "Cargando..."
            }
          />
          <AchievementCard
            image={require("../../../../assets/images/total-weight.png")}
            title="Kilos levantados"
            achievement={
              achievements
                ? `${achievements.totalWeightLifted} kgs.`
                : "Cargando..."
            }
          />
          <AchievementCard
            image={require("../../../../assets/images/weekly-average.png")}
            title="Media semanal"
            achievement={
              achievements
                ? `${achievements.averageTrainingsPerWeek} sesiones`
                : "Cargando..."
            }
          />
        </ScrollView>
      </View>
      <View style={styles.adviceContainer}>
        {trainingTip && (
          <AdviceCard
            adviceTitle={trainingTip.title}
            advice={trainingTip.content}
            scientificExplanation={trainingTip.scienceExplanation}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    flexGrow: 1,
  },
  achievementsContainer: {
    marginBottom: 10,
    height: 60 * PixelRatio.get(),
  },
  adviceContainer: {},
});
