import React, { useState, forwardRef } from "react";
import { Card, Button } from "react-native-paper";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import RoutineSessionExerciseSetRow from "./RoutineSessionExerciseSetRow";
import { FontAwesome } from "@expo/vector-icons";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";

interface RoutineSessionExerciseCardProps {
  id: number;
  name: string;
  onDeletePress?: () => void;
  canDeleteRows: boolean;
  formRef?: React.Ref<FormikProps<any>>;
}

const RoutineSessionExerciseCard = ({
  id,
  name,
  canDeleteRows,
  onDeletePress,
  formRef,
}: RoutineSessionExerciseCardProps) => {
  const [sets, setSets] = useState([
    { setNumber: 1, repetitions: "", weight: "" },
    { setNumber: 2, repetitions: "", weight: "" },
    { setNumber: 3, repetitions: "", weight: "" },
  ]);

const validationSchema = Yup.object().shape({
  sets: Yup.array().of(
    Yup.object().shape({
      repetitions: Yup.string()
        .matches(/^[1-9]\d*$/)
        .required(),
      weight: Yup.string()
        .matches(/^[1-9]\d*$/)
        .required(),
    })
  ),
});

  const addSet = (
    values: any,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const newSet = {
      setNumber: values.sets.length + 1,
      repetitions: "",
      weight: "",
    };
    setFieldValue("sets", [...values.sets, newSet]);
  };

  const handleDeletePress = (
    index: number,
    values: any,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const updatedSets = values.sets
      .filter((_: any, i: number) => i !== index)
      .map(
        (
          set: { setNumber: number; repetitions: string; weight: string },
          i: number
        ) => ({
          ...set,
          setNumber: i + 1,
        })
      );
    setFieldValue("sets", updatedSets);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{ sets }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.exerciseTitle}>
              <Text style={styles.exerciseName}>{name}</Text>
              {onDeletePress && (
                <TouchableOpacity onPress={onDeletePress}>
                  <FontAwesome name="trash" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            {values.sets.map(
              (
                set: { setNumber: number; repetitions: string; weight: string },
                index: number
              ) => (
                <RoutineSessionExerciseSetRow
                  key={index}
                  setNumber={set.setNumber}
                  repetitions={set.repetitions}
                  weight={set.weight}
                  onRepetitionsChange={handleChange(
                    `sets[${index}].repetitions`
                  )}
                  onWeightChange={handleChange(`sets[${index}].weight`)}
                  onRepetitionsBlur={handleBlur(`sets[${index}].repetitions`)}
                  onWeightBlur={handleBlur(`sets[${index}].weight`)}
                  onDeletePress={
                    canDeleteRows
                      ? () => handleDeletePress(index, values, setFieldValue)
                      : undefined
                  }
                  errorRepetitions={
                    !!(
                      Array.isArray(touched.sets) &&
                      touched.sets[index]?.repetitions &&
                      Array.isArray(errors.sets) &&
                      typeof errors.sets[index] === "object" &&
                      errors.sets[index]?.repetitions
                    )
                  }
                  errorWeight={
                    !!(
                      Array.isArray(touched.sets) &&
                      touched.sets[index]?.weight &&
                      Array.isArray(errors.sets) &&
                      typeof errors.sets[index] === "object" &&
                      errors.sets[index]?.weight
                    )
                  }
                />
              )
            )}
            <Button
              mode="contained"
              onPress={() => addSet(values, setFieldValue)}
              style={styles.addButton}
            >
              Añadir serie
            </Button>
          </Card.Content>
        </Card>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  exerciseTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
});

export default RoutineSessionExerciseCard;
