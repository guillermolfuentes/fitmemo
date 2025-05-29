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
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const [achievements, setAchievements] = useState<UserAchievementsResponse>();
  const [trainingTip, setTrainingTip] = useState<TrainingTip>();
  const { getCurrentSession } = useContext(AuthContext);
  const { setLoading, showErrorSnackbar } = useUIContext();
  const { t } = useTranslation();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const session = await getCurrentSession();
      if (!session || !session.token) {
        throw new Error("Session or token is null");
      }

      const response = await StatisticsService.getUserAchievements(
        session.token,
        session!.user!.id
      );
      setAchievements(response);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      showErrorSnackbar(t("screens.home.errors.fetching_achievements"));
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
      showErrorSnackbar(t("screens.home.errors.fetching_tip"));
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
            title={t("screens.home.achievements.total_sessions.title")}
            achievement={
              achievements
                ? `${achievements.totalTrainings} ${t(
                    "screens.home.achievements.total_sessions.sessions"
                  )}`
                : t("common.loading")
            }
          />
          <AchievementCard
            image={require("../../../../assets/images/total-weight.png")}
            title={t("screens.home.achievements.total_weight_lifted")}
            achievement={
              achievements
                ? `${achievements.totalWeightLifted} kgs.`
                : t("common.loading")
            }
          />
          <AchievementCard
            image={require("../../../../assets/images/weekly-average.png")}
            title={t("screens.home.achievements.weekly_average.title")}
            achievement={
              achievements
                ? `${achievements.averageTrainingsPerWeek} ${t(
                    "screens.home.achievements.weekly_average.sessions"
                  )}`
                : t("common.loading")
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
