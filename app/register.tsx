import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Keyboard, Dimensions, LayoutChangeEvent } from "react-native";
import { Button, Menu, ProgressBar, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../assets/images/FitMemo_Logo.svg";

const { height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [password, setPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Elige una opción");
  const [isScrollable, setScrollable] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const openMenu = () => setGenderMenuVisible(true);
  const closeMenu = () => setGenderMenuVisible(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    closeMenu();
  };

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

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height: screenHeight } = Dimensions.get("window");
    const { height: contentHeight } = event.nativeEvent.layout;

    // Determine if the content is larger than the screen
    setScrollable(contentHeight > screenHeight);
  };

  const firstStepView = (
    <View style={styles.container} onLayout={handleLayout}>
      <Text>Empecemos a conocernos</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Nombre"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          label="Edad"
          value={age.toString()}
          onChangeText={(age) => setAge(parseInt(age))}
          keyboardType="numeric"
          style={styles.input}
        />
        <Menu
          visible={genderMenuVisible}
          mode="elevated"
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}>{selectedOption}</Button>}
        >
          <Menu.Item
            onPress={() => handleOptionSelect("Opción 1")}
            title="Opción 1"
          />
          <Menu.Item
            onPress={() => handleOptionSelect("Opción 2")}
            title="Opción 2"
          />
          <Menu.Item
            onPress={() => handleOptionSelect("Opción 3")}
            title="Opción 3"
          />
        </Menu>
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
      </View>
    </View>
  );

  const secondStepView = <Text>Contenido del Paso 2</Text>;
  const thirdStepView = <Text>Contenido del Paso 3</Text>;

  const steps = [
    { label: "Paso 1", content: firstStepView },
    { label: "Paso 2", content: secondStepView },
    { label: "Paso 3", content: thirdStepView },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

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
      scrollEnabled={isScrollable || isKeyboardVisible}
      keyboardShouldPersistTaps="handled"
      style={styles.scrollView}
    >
      <View style={styles.container}>
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
        {activeStep == 0 && (
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 0,
    backgroundColor: "white",
    paddingBottom: 0,
  },
  progressBar: {
    width: "80%",
    height: 10,
    marginVertical: 20,
    backgroundColor: "white",
  },
  stepContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
    backgroundColor: "white",
  },
  returnButton: {
    marginTop: 50,
  },
  input: {
    margin: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
});
