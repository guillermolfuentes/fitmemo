import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

import { Button, ProgressBar, TextInput } from "react-native-paper";
import { router, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Dropdown } from "react-native-paper-dropdown";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Formik, FormikHelpers, FormikProps } from "formik";

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const FirstStepSchema = Yup.object().shape({
    name: Yup.string().required(
      t("screens.register.step1.errors.required_name")
    ),
    age: Yup.number()
      .required(t("screens.register.step1.errors.required_age"))
      .min(1, t("screens.register.step1.errors.invalid_age"))
      .max(120, t("screens.register.step1.errors.invalid_age")),
    gender: Yup.string().required(
      t("screens.register.step1.errors.required_gender")
    ),
  });

  const SecondStepSchema = Yup.object().shape({
    trainingDays: Yup.number()
      .required(t("screens.register.step2.errors.required_training_days"))
      .min(1, t("screens.register.step2.errors.invalid_training_days"))
      .max(7, t("screens.register.step2.errors.invalid_training_days")),
    trainingLevel: Yup.string().required(
      t("screens.register.step2.errors.required_training_level")
    ),
    availableEquipment: Yup.string().required(
      t("screens.register.step2.errors.required_available_equipment")
    ),
    activityLevel: Yup.string().required(
      t("screens.register.step2.errors.required_activity_level")
    ),
    targetMuscleGroup: Yup.string().required(
      t("screens.register.step2.errors.required_target_muscle_group")
    ),
  });

  const ThirdStepSchema = Yup.object().shape({
    height: Yup.number()
      .required(t("screens.register.step3.errors.required_height"))
      .min(50, t("screens.register.step3.errors.invalid_height"))
      .max(300, t("screens.register.step3.errors.invalid_height")),
    weight: Yup.number()
      .required(t("screens.register.step3.errors.required_weight"))
      .min(10, t("screens.register.step3.errors.invalid_weight"))
      .max(500, t("screens.register.step3.errors.invalid_weight")),
    waistCircumference: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(30, t("screens.register.step3.errors.invalid_waist_circumference"))
      .max(200, t("screens.register.step3.errors.invalid_waist_circumference"))
      .notRequired(),
    hipCircumference: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(30, t("screens.register.step3.errors.invalid_hip_circumference"))
      .max(200, t("screens.register.step3.errors.invalid_hip_circumference"))
      .notRequired(),
    thighCircumference: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(30, t("screens.register.step3.errors.invalid_thigh_circumference"))
      .max(200, t("screens.register.step3.errors.invalid_thigh_circumference"))
      .notRequired(),
  });

  const FourthStepSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("screens.register.step4.errors.invalid_email"))
      .required(t("screens.register.step4.errors.required_email")),
    password: Yup.string()
      .required(t("screens.register.step4.errors.required_confirm_password"))
      .min(8, t("screens.register.step4.errors.password_too_short")),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        t("screens.register.step4.errors.passwords_must_match")
      )
      .required(t("screens.register.step4.errors.passwords_must_match")),
  });

  const GENDER_OPTIONS = [
    {
      label: t("screens.register.step1.gender_input.options.male"),
      value: "male",
    },
    {
      label: t("screens.register.step1.gender_input.options.female"),
      value: "female",
    },
  ];

  const TRAINING_LEVELS_OPTIONS = [
    {
      label: t("screens.register.step2.training_level_input.options.beginner"),
      value: "beginner",
    },
    {
      label: t(
        "screens.register.step2.training_level_input.options.intermediate"
      ),
      value: "intermediate",
    },
    {
      label: t("screens.register.step2.training_level_input.options.advanced"),
      value: "advanced",
    },
  ];

  const AVAILABLE_TRAINING_EQUIPMENT_OPTIONS = [
    {
      label: t(
        "screens.register.step2.training_equipment_input.options.dumbbells"
      ),
      value: "dumbbells",
    },
    {
      label: t(
        "screens.register.step2.training_equipment_input.options.barbell"
      ),
      value: "barbell",
    },
    {
      label: t(
        "screens.register.step2.training_equipment_input.options.resistance_band"
      ),
      value: "resistance_band",
    },
    {
      label: t(
        "screens.register.step2.training_equipment_input.options.no_equipment"
      ),
      value: "no_equipment",
    },
    {
      label: t("screens.register.step2.training_equipment_input.options.gym"),
      value: "gym",
    },
  ];

  const DAILY_ACTIVITY_LEVEL_OPTIONS = [
    {
      label: t(
        "screens.register.step2.daily_activity_level_input.options.sedentary"
      ),
      value: "sedentary",
    },
    {
      label: t(
        "screens.register.step2.daily_activity_level_input.options.light"
      ),
      value: "light",
    },
    {
      label: t(
        "screens.register.step2.daily_activity_level_input.options.moderate"
      ),
      value: "moderate",
    },
    {
      label: t(
        "screens.register.step2.daily_activity_level_input.options.active"
      ),
      value: "active",
    },
    {
      label: t(
        "screens.register.step2.daily_activity_level_input.options.very_active"
      ),
      value: "very_active",
    },
  ];

  const TARGET_MUSCLE_GROUP_OPTIONS = [
    {
      label: t(
        "screens.register.step2.target_muscle_group_input.options.chest"
      ),
      value: "chest",
    },
    {
      label: t("screens.register.step2.target_muscle_group_input.options.back"),
      value: "back",
    },
    {
      label: t("screens.register.step2.target_muscle_group_input.options.legs"),
      value: "legs",
    },
    {
      label: t("screens.register.step2.target_muscle_group_input.options.arms"),
      value: "arms",
    },
    {
      label: t(
        "screens.register.step2.target_muscle_group_input.options.shoulders"
      ),
      value: "shoulders",
    },
    {
      label: t("screens.register.step2.target_muscle_group_input.options.abs"),
      value: "abs",
    },
  ];

  const FirstStepView = ({
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  }: FormikProps<FirstStepValues>) => (
    <View style={styles.container}>
      <Text>Empecemos a conocernos</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label={t("screens.register.step1.name_input")}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          value={values.name}
          error={touched.name && !!errors.name}
          style={styles.input}
        />
        {touched.name && errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}
        <TextInput
          label={t("screens.register.step1.age_input")}
          value={values.age}
          onChangeText={handleChange("age")}
          onBlur={handleBlur("age")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.age && errors.age ? (
          <Text style={styles.errorText}>{errors.age}</Text>
        ) : null}
        <View style={styles.input}>
          <Dropdown
            label={t("screens.register.step1.gender_input.label")}
            placeholder={t("screens.register.step1.gender_input.placerholder")}
            options={GENDER_OPTIONS}
            value={values.gender}
            onSelect={(value) => handleChange("gender")(value || "")}
            hideMenuHeader={true}
          />
          {touched.gender && errors.gender ? (
            <Text style={styles.errorText}>{errors.gender}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  const SecondStepView = ({
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  }: FormikProps<SecondStepValues>) => (
    <View style={styles.container}>
      <Text>Vamos a construir tu rutina de ejercicio</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label={t("screens.register.step2.training_days_input")}
          value={values.trainingDays}
          onChangeText={handleChange("trainingDays")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.trainingDays && errors.trainingDays ? (
          <Text style={styles.errorText}>{errors.trainingDays}</Text>
        ) : null}
        <View style={styles.input}>
          <Dropdown
            label={t("screens.register.step2.training_level_input.label")}
            placeholder={t(
              "screens.register.step2.training_level_input.placeholder"
            )}
            options={TRAINING_LEVELS_OPTIONS}
            value={values.trainingLevel}
            onSelect={(value) => handleChange("trainingLevel")(value || "")}
            hideMenuHeader={true}
          />
          {touched.trainingLevel && errors.trainingLevel ? (
            <Text style={styles.errorText}>{errors.trainingLevel}</Text>
          ) : null}
        </View>

        <View style={styles.input}>
          <Dropdown
            label={t("screens.register.step2.training_equipment_input.label")}
            placeholder={t(
              "screens.register.step2.training_equipment_input.placeholder"
            )}
            options={AVAILABLE_TRAINING_EQUIPMENT_OPTIONS}
            value={values.availableEquipment}
            onSelect={(value) =>
              handleChange("availableEquipment")(value || "")
            }
            hideMenuHeader={true}
          />
          {touched.availableEquipment && errors.availableEquipment ? (
            <Text style={styles.errorText}>{errors.availableEquipment}</Text>
          ) : null}
        </View>

        <View style={styles.input}>
          <Dropdown
            label={t("screens.register.step2.daily_activity_level_input.label")}
            placeholder={t(
              "screens.register.step2.daily_activity_level_input.placeholder"
            )}
            options={DAILY_ACTIVITY_LEVEL_OPTIONS}
            value={values.activityLevel}
            onSelect={(value) => handleChange("activityLevel")(value || "")}
            hideMenuHeader={true}
          />
          {touched.activityLevel && errors.activityLevel ? (
            <Text style={styles.errorText}>{errors.activityLevel}</Text>
          ) : null}
        </View>
        <View style={styles.input}>
          <Dropdown
            label={t("screens.register.step2.target_muscle_group_input.label")}
            placeholder={t(
              "screens.register.step2.target_muscle_group_input.placeholder"
            )}
            options={TARGET_MUSCLE_GROUP_OPTIONS}
            value={values.targetMuscleGroup}
            onSelect={(value) => handleChange("targetMuscleGroup")(value || "")}
            hideMenuHeader={true}
          />
          {touched.targetMuscleGroup && errors.targetMuscleGroup ? (
            <Text style={styles.errorText}>{errors.targetMuscleGroup}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  const ThirdStepView = ({
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  }: FormikProps<ThirdStepValues>) => (
    <View style={styles.container}>
      <Text>Algunos detalles más sobre ti</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label={t("screens.register.step3.height_input")}
          value={values.height}
          onChangeText={handleChange("height")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.height && errors.height ? (
          <Text style={styles.errorText}>{errors.height}</Text>
        ) : null}
        <TextInput
          label={t("screens.register.step3.weight_input")}
          value={values.weight}
          onChangeText={handleChange("weight")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.weight && errors.weight ? (
          <Text style={styles.errorText}>{errors.weight}</Text>
        ) : null}
        <TextInput
          label={t("screens.register.step3.waist_circumference_input")}
          value={values.waistCircumference}
          onChangeText={handleChange("waistCircumference")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.waistCircumference && errors.waistCircumference ? (
          <Text style={styles.errorText}>{errors.waistCircumference}</Text>
        ) : null}
        <TextInput
          label={t("screens.register.step3.hip_circumference_input")}
          value={values.hipCircumference}
          onChangeText={handleChange("hipCircumference")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.hipCircumference && errors.hipCircumference ? (
          <Text style={styles.errorText}>{errors.hipCircumference}</Text>
        ) : null}
        <TextInput
          label={t("screens.register.step3.thigh_circumference_input")}
          value={values.thighCircumference}
          onChangeText={handleChange("thighCircumference")}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.hipCircumference && errors.thighCircumference ? (
          <Text style={styles.errorText}>{errors.thighCircumference}</Text>
        ) : null}
      </View>
    </View>
  );

  const FourthStepView = ({
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  }: FormikProps<FourthStepValues>) => (
    <View style={styles.container}>
      <Text>Algunos detalles más sobre ti</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label={t("screens.register.step4.email_input")}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          error={touched.email && !!errors.email}
          style={styles.input}
        />
        {touched.email && errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <TextInput
          label={t("screens.register.step4.password_input")}
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          value={values.password}
          error={touched.password && !!errors.password}
          style={styles.input}
          secureTextEntry
        />
        {touched.password && errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <TextInput
          label={t("screens.register.step4.confirm_password_input")}
          onChangeText={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          value={values.confirmPassword}
          error={touched.confirmPassword && !!errors.confirmPassword}
          style={styles.input}
          secureTextEntry
        />
        {touched.confirmPassword && errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>
    </View>
  );

  const steps: {
    component: (props: FormikProps<any>) => JSX.Element;
    validationSchema: Yup.ObjectSchema<any>;
  }[] = [
    {
      component: (props: FormikProps<FirstStepValues>) => (
        <FirstStepView {...props} />
      ),
      validationSchema: FirstStepSchema,
    },
    {
      component: (props: FormikProps<SecondStepValues>) => (
        <SecondStepView {...props} />
      ),
      validationSchema: SecondStepSchema,
    },
    {
      component: (props: FormikProps<ThirdStepValues>) => (
        <ThirdStepView {...props} />
      ),
      validationSchema: ThirdStepSchema,
    },
    {
      component: (props: FormikProps<FourthStepValues>) => (
        <FourthStepView {...props} />
      ),
      validationSchema: FourthStepSchema,
    },
  ];

  interface FirstStepValues {
    name: string;
    age: string;
    gender: string;
  }

  interface SecondStepValues {
    trainingDays: string;
    trainingLevel: string;
    availableEquipment: string;
    activityLevel: string;
    targetMuscleGroup: string;
  }

  interface ThirdStepValues {
    height: string;
    weight: string;
    waistCircumference: string;
    hipCircumference: string;
    thighCircumference: string;
  }

  interface FourthStepValues {
    email: string;
    password: string;
    confirmPassword: string;
  }

  type FormValues = FirstStepValues &
    SecondStepValues &
    ThirdStepValues &
    FourthStepValues;

  const handleNext = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const currentStepSchema = steps[activeStep].validationSchema;

    try {
      await currentStepSchema.validate(values, { abortEarly: false });
      setActiveStep((prevStep) => prevStep + 1);
    } catch (errors) {
      const formattedErrors = (errors as Yup.ValidationError).inner.reduce(
        (acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        },
        {}
      );
      actions.setErrors(formattedErrors);

      const touchedFields = (errors as Yup.ValidationError).inner.reduce(
        (acc: any, error: any) => {
          acc[error.path] = true;
          return acc;
        },
        {}
      );
      actions.setTouched(touchedFields);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const currentStepSchema = steps[activeStep].validationSchema;

    try {
      await currentStepSchema.validate(values, { abortEarly: false });
      console.log("Enviando formulario con datos: ", values);

      router.replace("/");
    } catch (errors) {
      const formattedErrors = (errors as Yup.ValidationError).inner.reduce(
        (acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        },
        {}
      );
      actions.setErrors(formattedErrors);

      const touchedFields = (errors as Yup.ValidationError).inner.reduce(
        (acc: any, error: any) => {
          acc[error.path] = true;
          return acc;
        },
        {}
      );
      actions.setTouched(touchedFields);
    }
  };

  const returnLogin = () => {
    router.replace("/login");
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      scrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <Formik
        initialValues={{
          name: "",
          age: "",
          gender: "",
          trainingDays: "",
          trainingLevel: "",
          availableEquipment: "",
          activityLevel: "",
          targetMuscleGroup: "",
          height: "",
          weight: "",
          waistCircumference: "",
          hipCircumference: "",
          thighCircumference: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={steps[activeStep].validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <View style={styles.innerContainer}>
            <Logo width={250} height={100} />
            <Text style={styles.title}>Comienza tu camino fitness.</Text>

            <ProgressBar
              progress={(activeStep + 1) / steps.length}
              style={styles.progressBar}
            />

            <View style={styles.stepContainer}>
              {steps[activeStep].component(formikProps)}
            </View>

            <View style={styles.buttonContainer}>
              {activeStep !== 0 && (
                <Button icon="arrow-left" mode="contained" onPress={handleBack}>
                  Anterior
                </Button>
              )}
              {activeStep !== steps.length - 1 ? (
                <Button
                  icon="arrow-right"
                  mode="contained"
                  onPress={() => handleNext(formikProps.values, formikProps)}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  icon="check"
                  mode="contained"
                  onPress={() => formikProps.handleSubmit()}
                >
                  Empezar
                </Button>
              )}
            </View>
            {activeStep === 0 && (
              <Button
                icon="arrow-left"
                mode="outlined"
                onPress={returnLogin}
                style={styles.returnButton}
              >
                Volver al login
              </Button>
            )}
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 0,
    paddingBottom: 0,
  },
  progressBar: {
    width: "80%",
    height: 10,
    marginVertical: 20,
  },
  stepContainer: {
    flexGrow: 1,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 0,
  },
  returnButton: {
    marginTop: 30,
    marginBottom: 0,
  },
  input: {
    margin: 10,
  },
  inputContainer: {
    width: "80%",
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
