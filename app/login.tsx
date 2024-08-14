import { Keyboard, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { router } from "expo-router";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Button, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  const handleLogin = () => {
    signIn();
    router.replace("/");
  };

  const handleRegister = () => {
    router.replace("/register");
  };

  return (
    <KeyboardAwareScrollView scrollEnabled={isKeyboardVisible}>
      <View style={styles.container}>
        <Logo width={400} height={200} />
        <Text style={styles.title}>Bienvenido 👋 </Text>
        <Text style={styles.subtitle}>Todo comienza aquí.</Text>

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
          <Button icon="login" mode="contained" onPress={handleLogin}>
            Inicia sesión
          </Button>
        </View>

        <View style={styles.registerContainer}>
          <Button icon="account-plus" mode="contained" onPress={handleRegister}>
            ¡Regístrate ya!
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
});
