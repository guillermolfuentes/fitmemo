import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Image } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

interface AdviceCardProps {
  adviceTitle: string;
  advice: string;
  scientificExplanation: string;
}

const AdviceCard = ({
  adviceTitle,
  advice,
  scientificExplanation,
}: AdviceCardProps) => {
  const { t } = useTranslation();
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.adviceTitleContainer}>
          <Image
            source={require("../../assets/images/magic-advice.png")}
            style={styles.icon}
          />
          <Text style={styles.dailyTip}>
            {t("components.advice_card.fitness_tip")}
          </Text>
        </View>

        <Title style={styles.adviceTitle}>{adviceTitle}</Title>
        <Paragraph>{advice}</Paragraph>

        <View style={styles.adviceTitleContainer}>
          <Image
            source={require("../../assets/images/lab-icon.png")}
            style={styles.icon}
          />
          <Text style={styles.dailyTip}>
            {t("components.advice_card.science_title")}
          </Text>
        </View>

        <Paragraph style={styles.scientificExplanation}>
          {scientificExplanation}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
  },
  adviceTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  dailyTip: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 15,
  },
  icon: {
    width: 25,
    height: 25,
  },
  adviceTitle: {
    fontWeight: "bold",
  },
  cardContent: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
  },

  scientificExplanation: {
    fontStyle: "italic",
  },
});

export default AdviceCard;
