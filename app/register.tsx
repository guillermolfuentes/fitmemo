import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

import { Button, ProgressBar, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Dropdown } from "react-native-paper-dropdown";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Formik, FormikProps } from "formik";

export default function Register() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  /*
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState<string>();

  const [trainingDays, setTrainingDays] = useState(0);
  const [trainingLevel, setTrainingLevel] = useState<string>();
  const [availableEquipment, setAvailableEquipment] = useState<string>();
  const [activityLevel, setActivityLevel] = useState<string>();
  const [targetMuscleGroup, setTargetMuscleGroup] = useState<string>();*/

  const [height, setHeight] = useState<number | string>("");
  const [weight, setWeight] = useState<number | string>("");
  const [waistCircumference, setWaistCircumference] = useState<number | string>(
    ""
  );
  const [hipCircumference, setHipCircumference] = useState<number | string>("");
  const [thighCircumference, setThighCircumference] = useState<number | string>(
    ""
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { t } = useTranslation();

  const formikRefStep1 = useRef<
    FormikProps<{
      name: string;
      age: string;
      gender: string;
    }>
  >(null);

  const formikRefStep2 = useRef<
    FormikProps<{
      trainingDays: string;
      trainingLevel: string;
      availableEquipment: string;
      activityLevel: string;
      targetMuscleGroup: string;
    }>
  >(null);

  const formikRefStep3 = useRef<
    FormikProps<{
      height: string;
      weight: string;
      waistCircumference?: string;
      hipCircumference?: string;
      thighCircumference?: string;
    }>
  >(null);

  const formikRefStep4 = useRef<
    FormikProps<{
      email: string;
      password: string;
      confirmPassword: string;
    }>
  >(null);

  const formikRefs = [
    formikRefStep1,
    formikRefStep2,
    formikRefStep3,
    formikRefStep4,
  ];

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
      .min(30, t("screens.register.step3.errors.invalid_waist_circumference"))
      .max(200, t("screens.register.step3.errors.invalid_waist_circumference"))
      .nullable(),
    hipCircumference: Yup.number()
      .min(30, t("screens.register.step3.errors.invalid_hip_circumference"))
      .max(200, t("screens.register.step3.errors.invalid_hip_circumference"))
      .nullable(),
    thighCircumference: Yup.number()
      .min(30, t("screens.register.step3.errors.invalid_thigh_circumference"))
      .max(200, t("screens.register.step3.errors.invalid_thigh_circumference"))
      .nullable(),
  });

  const FourthStepSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("screens.login.errors.invalid_email"))
      .required(t("screens.login.errors.required_email")),
    password: Yup.string()
      .required(t("screens.login.errors.required_password"))
      .min(8, t("screens.login.errors.password_too_short")),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        t("screens.register.errors.passwords_must_match")
      )
      .required(t("screens.register.errors.required_confirm_password")),
  });

  const GENDER_OPTIONS = [
    { label: "Hombre", value: "male" },
    { label: "Mujer", value: "female" },
  ];

  const TRAINING_LEVELS_OPTIONS = [
    { label: "Principiante", value: "beginner" },
    { label: "Intermedio", value: "intermediate" },
    { label: "Avanzado", value: "advanced" },
  ];

  const AVAILABLE_TRAINING_EQUIPMENT_OPTIONS = [
    { label: "Mancuernas", value: "dumbbells" },
    { label: "Barra", value: "barbell" },
    { label: "Banda de resistencia", value: "resistance_band" },
    { label: "Sin material", value: "no_equipment" },
    { label: "Gimnasio", value: "gym" },
  ];

  const DAILY_ACTIVITY_LEVEL_OPTIONS = [
    { label: "Sedentario", value: "sedentary" },
    { label: "Ligero", value: "light" },
    { label: "Moderado", value: "moderate" },
    { label: "Activo", value: "active" },
    { label: "Muy activo", value: "very_active" },
  ];

  const TARGET_MUSCLE_GROUP_OPTIONS = [
    { label: "Pecho", value: "chest" },
    { label: "Espalda", value: "back" },
    { label: "Piernas", value: "legs" },
    { label: "Brazos", value: "arms" },
    { label: "Hombros", value: "shoulders" },
    { label: "Abdomen", value: "abs" },
  ];

  const handleNext = () => {
    console.log("validando formulario");
    const currentRef = formikRefs[activeStep];

    if (currentRef.current) {
      currentRef.current.validateForm().then((errors) => {
        if (Object.keys(errors).length === 0) {
          if (activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        } else {
          console.log("validacion erronea: " + errors);
          currentRef.current.setTouched(errors);
        }
      });
    }
  };

  const firstStepView =
    (console.log("RENDERIZANDO PASO 1 DEL REGISTRO"),
    (
      <Formik
        innerRef={formikRefStep1}
        initialValues={{ name: "", age: "", gender: "" }}
        validationSchema={FirstStepSchema}
        onSubmit={handleNext}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.container}>
            <Text>Empecemos a conocernos</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Nombre"
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
                label="Edad"
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
                  label="Sexo"
                  placeholder="Selecciona un género"
                  options={GENDER_OPTIONS}
                  value={values.gender}
                  onSelect={handleChange("gender")}
                  hideMenuHeader={true}
                />
                {touched.gender && errors.gender ? (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                ) : null}
              </View>
            </View>
          </View>
        )}
      </Formik>
    ));

  const secondStepView =
    (console.log("RENDERIZANDO PASO 2 DEL REGISTRO"),
    (
      <Formik
        innerRef={formikRefStep2}
        initialValues={{
          trainingDays: "",
          trainingLevel: "",
          availableEquipment: "",
          activityLevel: "",
          targetMuscleGroup: "",
        }}
        validationSchema={SecondStepSchema}
        onSubmit={handleNext}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.container}>
            <Text>Vamos a construir tu rutina de ejercicio</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="¿Cuántos días a la semana quieres entrenar?"
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
                  label="Nivel de entrenamiento"
                  placeholder="Selecciona un nivel"
                  options={TRAINING_LEVELS_OPTIONS}
                  value={values.trainingLevel}
                  onSelect={handleChange("trainingLevel")}
                  hideMenuHeader={true}
                />
                {touched.trainingLevel && errors.trainingLevel ? (
                  <Text style={styles.errorText}>{errors.trainingLevel}</Text>
                ) : null}
              </View>

              <View style={styles.input}>
                <Dropdown
                  label="Material disponible"
                  placeholder="Selecciona material"
                  options={AVAILABLE_TRAINING_EQUIPMENT_OPTIONS}
                  value={values.availableEquipment}
                  onSelect={handleChange("availableEquipment")}
                  hideMenuHeader={true}
                />
                {touched.availableEquipment && errors.availableEquipment ? (
                  <Text style={styles.errorText}>
                    {errors.availableEquipment}
                  </Text>
                ) : null}
              </View>

              <View style={styles.input}>
                <Dropdown
                  label="Nivel de actividad física"
                  placeholder="Selecciona un nivel"
                  options={DAILY_ACTIVITY_LEVEL_OPTIONS}
                  value={values.activityLevel}
                  onSelect={handleChange("activityLevel")}
                  hideMenuHeader={true}
                />
                {touched.activityLevel && errors.activityLevel ? (
                  <Text style={styles.errorText}>{errors.activityLevel}</Text>
                ) : null}
              </View>
              <View style={styles.input}>
                <Dropdown
                  label="Grupo muscular a priorizar"
                  placeholder="Selecciona un grupo muscular"
                  options={TARGET_MUSCLE_GROUP_OPTIONS}
                  value={values.targetMuscleGroup}
                  onSelect={handleChange("targetMuscleGroup")}
                  hideMenuHeader={true}
                />
                {touched.targetMuscleGroup && errors.targetMuscleGroup ? (
                  <Text style={styles.errorText}>
                    {errors.targetMuscleGroup}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        )}
      </Formik>
    ));

  const thirdStepView =
    (console.log("RENDERIZANDO PASO 3 DEL REGISTRO"),
    (
      <View style={styles.container}>
        <Text>Algunos detalles más sobre ti</Text>
        <View style={styles.inputContainer}>
          <TextInput
            label="Altura (cms)"
            value={height.toString()}
            onChangeText={(height) => setHeight(parseInt(height))}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Peso (kgs)"
            value={weight.toString()}
            onChangeText={(weight) => setWeight(parseInt(weight))}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Perímetro ombligo en cms (opcional)"
            value={waistCircumference.toString()}
            onChangeText={(waistCircumference) =>
              setWaistCircumference(parseInt(waistCircumference))
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Perímetro cadera en cms (opcional)"
            value={hipCircumference.toString()}
            onChangeText={(hipCircumference) =>
              setHipCircumference(parseInt(hipCircumference))
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Perímetro muslo en cms (opcional)"
            value={thighCircumference.toString()}
            onChangeText={(thighCircumference) =>
              setThighCircumference(parseInt(thighCircumference))
            }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>
    ));

  const fourthStepView =
    (console.log("RENDERIZANDO PASO 4 DEL REGISTRO"),
    (
      <View style={styles.container}>
        <Text>Ya casi terminamos</Text>
        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirma contraseña"
            value={confirmPassword}
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
            secureTextEntry
            style={styles.input}
          />
        </View>
      </View>
    ));

  const steps = [
    { label: "Register step 1", content: firstStepView },
    { label: "Register step 2", content: secondStepView },
    { label: "Register step 3", content: thirdStepView },
    { label: "Register step 4", content: fourthStepView },
  ];

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
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
      <View style={styles.innerContainer}>
        <Logo width={250} height={100} />
        <Text style={styles.title}>Comienza tu camino fitness.</Text>

        <ProgressBar
          progress={(activeStep + 1) / steps.length}
          style={styles.progressBar}
        />
        <View style={styles.stepContainer}>{steps[activeStep].content}</View>
        <View style={styles.buttonContainer}>
          {activeStep !== 0 && (
            <Button icon="arrow-left" mode="contained" onPress={handleBack}>
              Anterior
            </Button>
          )}
          {activeStep !== steps.length - 1 ? (
            <Button icon="arrow-right" mode="contained" onPress={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button icon="check" mode="contained" onPress={handleNext}>
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
