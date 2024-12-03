import React from "react";
import { StyleSheet } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

interface AdviceCardProps {
  title: string;
  advice: string;
  scientificExplanation: string;
}

const AdviceCard = ({ title, advice, scientificExplanation }: AdviceCardProps) => (
  <Card style={styles.card}>
    <Card.Content>
      <Title>{title}</Title>
      <Paragraph>{advice}</Paragraph>
      <Paragraph style={styles.scientificExplanation}>{scientificExplanation}</Paragraph>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
  },
  scientificExplanation: {
    fontStyle: "italic",
  },
});

export default AdviceCard;
