import React, { useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, useTheme } from 'react-native-paper';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';


/*
La implementación actual de "Save" en esta pantalla es un
Workaround para el headerRight mientras solucionan el bug:
https://github.com/expo/expo/issues/29489
* */

const SettingsSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password is too short"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

interface SettingsValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SettingsForm = ({
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  handleSubmit,
}: FormikProps<SettingsValues>) => (
  <View style={styles.container}>
    <Text style={styles.formDescription}>Esto son los datos que tenemos de ti</Text>
    <TextInput
      label="Name"
      onChangeText={handleChange("name")}
      onBlur={handleBlur("name")}
      value={values.name}
      error={touched.name && !!errors.name}
      style={styles.input}
    />
    {touched.name && errors.name && (
      <Text style={styles.errorText}>{errors.name}</Text>
    )}

    <TextInput
      label="Email"
      onChangeText={handleChange("email")}
      onBlur={handleBlur("email")}
      value={values.email}
      error={touched.email && !!errors.email}
      style={styles.input}
    />
    {touched.email && errors.email && (
      <Text style={styles.errorText}>{errors.email}</Text>
    )}

    <TextInput
      label="Password"
      onChangeText={handleChange("password")}
      onBlur={handleBlur("password")}
      value={values.password}
      error={touched.password && !!errors.password}
      style={styles.input}
      secureTextEntry
    />
    {touched.password && errors.password && (
      <Text style={styles.errorText}>{errors.password}</Text>
    )}

    <TextInput
      label="Confirm Password"
      onChangeText={handleChange("confirmPassword")}
      onBlur={handleBlur("confirmPassword")}
      value={values.confirmPassword}
      error={touched.confirmPassword && !!errors.confirmPassword}
      style={styles.input}
      secureTextEntry
    />
    {touched.confirmPassword && errors.confirmPassword && (
      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
    )}
  </View>
);

const SettingsModalScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const formikRef = useRef<FormikProps<SettingsValues>>(null);

  const handleSubmit = (values: SettingsValues) => {
    console.log("Form values:", values);
  };

 useLayoutEffect(() => {
   navigation.setOptions({
     title: "Settings",
     headerBackTitle: "Back to Home",
     headerRight: () => (
       <TouchableOpacity
         onPressIn={() => formikRef.current?.handleSubmit()}
         style={[styles.button, { backgroundColor: colors.primary }]}
       >
         <Text style={styles.buttonText}>Save</Text>
       </TouchableOpacity>
     ),
   });
 }, [navigation, colors]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SettingsSchema}
      onSubmit={handleSubmit}
    >
      {(formikProps) => <SettingsForm {...formikProps} />}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  formDescription: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 15,
    fontWeight: "bold",

  },
  button: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingEnd: 12,
    paddingStart: 12,
    borderRadius: 40,
    height: "95%",
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
  marginBottom: 15,},
});

export default SettingsModalScreen;
