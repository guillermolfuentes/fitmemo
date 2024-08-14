import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import { Button, Menu, ProgressBar, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Dropdown } from "react-native-paper-dropdown";

const { height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState<string>();
  const [password, setPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isScrollable, setScrollable] = useState(false);

  const OPTIONS = [
    { label: "Hombre", value: "male" },
    { label: "Mujer", value: "female" },
  ];

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
        <View style={styles.input}>
          <Dropdown
            label="Sexo"
            placeholder="Selecciona un género"
            options={OPTIONS}
            value={gender}
            onSelect={setGender}
            hideMenuHeader={true}
          />
        </View>

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
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      scrollEnabled={isScrollable || isKeyboardVisible}
      keyboardShouldPersistTaps="handled"
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
    backgroundColor: "white",
  },
  innerContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    marginTop: 50
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
    flexGrow: 1,
    width: "100%",
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 0,
    backgroundColor: "white",
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
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
