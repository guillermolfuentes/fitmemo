import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

interface AchievementCardProps {
  image: string;
  title: string;
  achievement: string;
}

const AchievementCard = ({
  image,
  title,
  achievement,
}: AchievementCardProps) => (
  <Card style={styles.card}>
    <Card.Cover
      source={{ uri: image }}
      style={styles.cardCover}
      resizeMode="cover"
    />
    <Card.Content style={styles.cardContent}>
      <Title style={styles.title} adjustsFontSizeToFit numberOfLines={2}>
        {title}
      </Title>
      <Paragraph
        style={styles.paragraph}
        adjustsFontSizeToFit
        numberOfLines={2}
      >
        {achievement}
      </Paragraph>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    aspectRatio: 1,
    height: "90%",
    padding: 5,
  },
  cardCover: {
    height: "50%",
    width: "100%",
    overflow: "hidden",
    marginBottom: 5,
  },
  cardContent: {
    height: "50%",
    width: "100%",
  },
  title: {
    height: "60%",
    width: "100%",
    padding: 0,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  paragraph: {
    height: "40%",
    width: "100%",
    textAlign: "center",

    fontSize: 15,
  },
});

export default AchievementCard;
