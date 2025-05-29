import React, { useRef, useLayoutEffect, useContext, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, useTheme } from "react-native-paper";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/context/AuthContext";
import { useUIContext } from "@/context/UIContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import BodyMeasurementService from "@/services/bodyMeasurementService";
import { BodyMeasurementEntryRequest } from "@/types/progress/services/BodyMeasurementEntryRequest";
import { useRouter } from "expo-router";

interface MeasurementsValues {
  bodyWeight: string;
  waistCircumference: string;
  hipCircumference: string;
  thighCircumference: string;
}

const MeasurementsForm = ({
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  handleSubmit,
}: FormikProps<MeasurementsValues>) => {
  const { signOut } = useContext(AuthContext);
  const { t } = useTranslation();

  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View>
      <Text style={styles.formDescription}>{today}</Text>
      <TextInput
        label={t("screens.progress.add_body_measurement.weight_label")}
        keyboardType="numeric"
        onChangeText={handleChange("bodyWeight")}
        onBlur={handleBlur("bodyWeight")}
        value={values.bodyWeight}
        error={touched.bodyWeight && !!errors.bodyWeight}
        style={styles.input}
      />
      {touched.bodyWeight && errors.bodyWeight && (
        <Text style={styles.errorText}>{errors.bodyWeight}</Text>
      )}

      <TextInput
        label={t(
          "screens.progress.add_body_measurement.waist_circumference_label"
        )}
        keyboardType="numeric"
        onChangeText={handleChange("waistCircumference")}
        onBlur={handleBlur("waistCircumference")}
        value={values.waistCircumference}
        error={touched.waistCircumference && !!errors.waistCircumference}
        style={styles.input}
      />
      {touched.waistCircumference && errors.waistCircumference && (
        <Text style={styles.errorText}>{errors.waistCircumference}</Text>
      )}

      <TextInput
        label={t(
          "screens.progress.add_body_measurement.hip_circumference_label"
        )}
        keyboardType="numeric"
        onChangeText={handleChange("hipCircumference")}
        onBlur={handleBlur("hipCircumference")}
        value={values.hipCircumference}
        error={touched.hipCircumference && !!errors.hipCircumference}
        style={styles.input}
      />
      {touched.hipCircumference && errors.hipCircumference && (
        <Text style={styles.errorText}>{errors.hipCircumference}</Text>
      )}

      <TextInput
        label={t(
          "screens.progress.add_body_measurement.thigh_circumference_label"
        )}
        keyboardType="numeric"
        onChangeText={handleChange("thighCircumference")}
        onBlur={handleBlur("thighCircumference")}
        value={values.thighCircumference}
        error={touched.thighCircumference && !!errors.thighCircumference}
        style={styles.input}
      />
      {touched.thighCircumference && errors.thighCircumference && (
        <Text style={styles.errorText}>{errors.thighCircumference}</Text>
      )}
    </View>
  );
};

const MeasurementsModalScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const formikRef = useRef<FormikProps<MeasurementsValues>>(null);
  const { getCurrentSession } = useContext(AuthContext);
  const router = useRouter();

  const MeasurementsSchema = Yup.object().shape({
    bodyWeight: Yup.number()
      .required(
        t("screens.progress.add_body_measurement.errors.required_weight")
      )
      .min(40, t("screens.progress.add_body_measurement.errors.invalid_weight"))
      .max(
        500,
        t("screens.progress.add_body_measurement.errors.invalid_weight")
      ),
    waistCircumference: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(
        50,
        t(
          "screens.progress.add_body_measurement.errors.invalid_waist_circumference"
        )
      )
      .max(
        200,
        t(
          "screens.progress.add_body_measurement.errors.invalid_waist_circumference"
        )
      )
      .notRequired(),
    hipCircumference: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(
        30,
        t(
          "screens.progress.add_body_measurement.errors.invalid_hip_circumference"
        )
      )
      .max(
        200,
        t(
          "screens.progress.add_body_measurement.errors.invalid_hip_circumference"
        )
      )
      .notRequired(),
    thighCircumference: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(
        30,
        t(
          "screens.progress.add_body_measurement.errors.invalid_thigh_circumference"
        )
      )
      .max(
        200,
        t(
          "screens.progress.add_body_measurement.errors.invalid_thigh_circumference"
        )
      )
      .notRequired(),
  });

  const [initialFormValues, setInitialValues] = useState<MeasurementsValues>({
    bodyWeight: "",
    waistCircumference: "",
    hipCircumference: "",
    thighCircumference: "",
  });
  const {
    isLoading,
    setLoading,
    showSuccessSnackbar,
    showErrorSnackbar,
    hideSnackbar,
  } = useUIContext();

  const handleSubmit = async (values: MeasurementsValues) => {
    console.log("Form values:", values);
    try {
      setLoading(true);

      let bodyMeasurementEntry: BodyMeasurementEntryRequest = {
        bodyWeight: parseFloat(values.bodyWeight),
      };

      if (values.waistCircumference) {
        bodyMeasurementEntry.waistCircumference = parseFloat(
          values.waistCircumference
        );
      }
      if (values.hipCircumference) {
        bodyMeasurementEntry.hipCircumference = parseFloat(
          values.hipCircumference
        );
      }
      if (values.thighCircumference) {
        bodyMeasurementEntry.thighCircumference = parseFloat(
          values.thighCircumference
        );
      }

      const session = await getCurrentSession();
      const response = await BodyMeasurementService.createBodyMeasurementEntry(
        bodyMeasurementEntry,
        session!.token!,
        session!.user!.id
      );
      setLoading(false);
      showSuccessSnackbar(
        t("screens.progress.add_body_measurement.success.measurement_added")
      );
      router.back();
    } catch (error) {
      console.error("Error creating body measurement entry", error);
      showErrorSnackbar(
        t("screens.progress.add_body_measurement.errors.measurement_create")
      );
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPressIn={() => {
            if (formikRef.current) {
              console.log("Submitting form");
              formikRef.current.handleSubmit();
            }
          }}
          style={({ pressed }) => ({
            marginRight: 15,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <FontAwesome name="check" size={25} />
        </Pressable>
      ),
    });
  }, [navigation, colors]);

  if (isLoading) {
    return;
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <Formik
        innerRef={formikRef}
        initialValues={initialFormValues}
        validationSchema={MeasurementsSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => <MeasurementsForm {...formikProps} />}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
  },
  formDescription: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 17,
    fontWeight: "bold",
  },
  input: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    marginLeft: 50,
  },
});

export default MeasurementsModalScreen;
