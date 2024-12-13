import { Keyboard, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

import { router } from "expo-router";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Button, TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { AuthRequest } from "@/types/auth/contexts/AuthLoginRequest";
import { AuthResponse } from "@/types/auth/contexts/AuthResponse";
import axios, { AxiosError } from "axios";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { NetworkError } from "@/errors/NetworkError";
import { ForbiddenError } from "@/errors/ForbiddenError";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const { t } = useTranslation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("screens.login.errors.invalid_email"))
      .required(t("screens.login.errors.required_email")),
    password: Yup.string().required(
      t("screens.login.errors.required_password")
    ),
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      let result: AuthResponse;

      let userData: AuthRequest = {
        email: values.email,
        password: values.password,
      };

      result = await signIn(userData);
      console.log("Resultado del login:", result);
      router.replace("/home");
    } catch (error) {
      handleAndShowLoginRequestError(error);
    }
  };

  const handleAndShowLoginRequestError = (error: unknown): void => {
    if (error instanceof UnauthorizedError) {
      setErrorLoginMessage(t("screens.login.errors.authentication_error"));
    } else if (error instanceof ForbiddenError) {
      setErrorLoginMessage(t("screens.login.errors.authentication_error"));
    } else if (error instanceof NetworkError) {
      setErrorLoginMessage(t("screens.login.errors.network_error"));
    } else {
      setErrorLoginMessage(t("screens.login.errors.unknown_error"));
    }
  };

  const handleRegister = () => {
    router.replace("/register");
  };

  console.log("Renderizando Login");

  return (
    <KeyboardAwareScrollView scrollEnabled={true} bounces={false}>
      <View style={styles.container}>
        <Logo width={400} height={200} />
        <Text style={styles.title}>{t("screens.login.welcome_title")}</Text>
        <Text style={styles.subtitle}>
          {t("screens.login.welcome_subtitle")}
        </Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            submitForm,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t("screens.login.email")}
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
                label={t("screens.login.password")}
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                error={touched.password && !!errors.password}
                style={styles.input}
              />
              {touched.password && errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
              <Button icon="login" mode="contained" onPress={submitForm}>
                {t("screens.login.login_button")}
              </Button>
              {errorLoginMessage ? (
                <Text style={styles.errorText}>{errorLoginMessage}</Text>
              ) : null}
            </View>
          )}
        </Formik>

        <View style={styles.registerContainer}>
          <Button icon="account-plus" mode="contained" onPress={handleRegister}>
            {t("screens.login.register_button")}
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  inputContainer: {
    width: "80%",
    marginTop: 20,
  },
  input: {
    marginBottom: 20,
  },
  registerContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
