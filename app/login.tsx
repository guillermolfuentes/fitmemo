import { Keyboard, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { AuthContext, SignInResult } from "../context/AuthContext";

import { router } from "expo-router";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Button, TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import { useUIContext } from "@/context/UIContext";

export default function Login() {
  const {signIn } = useContext(AuthContext);
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");

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

  const handleLogin = async () => {
    try {
      let result: SignInResult;

      result = await signIn(email, password);
    

      if (result.success) {
        router.replace("/");
      } else if (result.error === "AUTHENTICATION_ERROR") {
        setErrorLoginMessage(t("screens.login.errors.authentication_error"));
      } else if (result.error === "NETWORK_ERROR") {
        setErrorLoginMessage(t("screens.login.errors.network_error"));
      } else {
        setErrorLoginMessage(t("screens.login.errors.unknown_error"));
      }
    } catch (error) {
      setErrorLoginMessage(t("screens.login.errors.unknown_error"));
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleRegister = () => {
    router.replace("/register");
  };

  return (
    <KeyboardAwareScrollView scrollEnabled={isKeyboardVisible}>
      <View style={styles.container}>
        <Logo width={400} height={200} />
        <Text style={styles.title}>{t("screens.login.welcome_title")}</Text>
        <Text style={styles.subtitle}>
          {t("screens.login.welcome_subtitle")}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label={t("screens.login.email")}
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            label={t("screens.login.password")}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <Button icon="login" mode="contained" onPress={handleLogin}>
            {t("screens.login.login_button")}
          </Button>
          {errorLoginMessage ? (
            <Text style={styles.errorText}>{errorLoginMessage}</Text>
          ) : null}
         
        </View>

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
    marginTop: 10, 
    textAlign: "center",
  },
});
