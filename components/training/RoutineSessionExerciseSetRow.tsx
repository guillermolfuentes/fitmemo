import React from 'react';
import { Card, TextInput } from 'react-native-paper';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface RoutineSessionExerciseSetRowProps {
  setNumber: number;
  repetitions: string;
  weight: string;
  onRepetitionsChange: (text: string) => void;
  onWeightChange: (text: string) => void;
  onDeletePress?: () => void;
}

const RoutineSessionExerciseSetRow = ({
  setNumber,
  repetitions,
  weight,
  onRepetitionsChange,
  onWeightChange,
  onDeletePress,
}: RoutineSessionExerciseSetRowProps) => {
  const validationSchema = Yup.object().shape({
    repetitions: Yup.string().required(""),
    weight: Yup.string().required(""),
  });

  return (
    <View style={styles.card}>
      <Formik
        initialValues={{ repetitions, weight }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.row}>
            <Text style={styles.setName}>Serie {setNumber}</Text>
            <TextInput
              label="Reps"
              onChangeText={handleChange("repetitions")}
              onBlur={handleBlur("repetitions")}
              value={values.repetitions}
              error={touched.repetitions && !!errors.repetitions}
              style={styles.input}
            />
            {touched.repetitions && errors.repetitions ? (
              <Text style={styles.errorText}>{errors.repetitions}</Text>
            ) : null}
            <TextInput
              label="Kgs"
              onChangeText={handleChange("weight")}
              onBlur={handleBlur("weight")}
              value={values.weight}
              error={touched.weight && !!errors.weight}
              style={styles.input}
            />
            {touched.weight && errors.weight ? (
              <Text style={styles.errorText}>{errors.weight}</Text>
            ) : null}
            {onDeletePress && (
              <TouchableOpacity onPress={onDeletePress}>
                <FontAwesome name="trash" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setName: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RoutineSessionExerciseSetRow;
