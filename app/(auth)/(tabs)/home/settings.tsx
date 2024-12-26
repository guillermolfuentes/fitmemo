import React, {
  useRef,
  useLayoutEffect,
  useContext,
  useEffect,
  useState,
} from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Platform, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/context/AuthContext";
import UserService from "@/services/userService";
import { useUIContext } from "@/context/UIContext";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from "@expo/vector-icons";

/*
La implementación actual de "Save" en esta pantalla es un
Workaround para el headerRight mientras solucionan el bug:
https://github.com/expo/expo/issues/29489
* */

const SettingsSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
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
}: FormikProps<SettingsValues>) => {
  const { signOut } = useContext(AuthContext);

  return (
    <View >
      <Text style={styles.formDescription}>
        Esto son los datos que tenemos de ti
      </Text>
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

      <Button
        style={styles.logoutButton}
        icon="logout"
        mode="contained"
        onPress={() => {
          console.log("Cerrando sesion");
          signOut();
        }}
      >
        Logout
      </Button>
    </View>
  );
};

const SettingsModalScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const formikRef = useRef<FormikProps<SettingsValues>>(null);
  const { getCurrentSession } = useContext(AuthContext);
  const [initialFormValues, setInitialValues] = useState<SettingsValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isLoading, setLoading } = useUIContext();

  const handleSubmit = (values: SettingsValues) => {
    console.log("Form values:", values);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const session = await getCurrentSession();
        const userProfile = await UserService.getUserProfile(session.token!);
        setInitialValues({
          name: userProfile.name,
          email: userProfile.email,
          password: "",
          confirmPassword: "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerRight: () => (
        <Pressable
          onPressIn={() => formikRef.current?.handleSubmit()}
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
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialFormValues}
        validationSchema={SettingsSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => <SettingsForm {...formikProps} />}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
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
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  logoutButton: {
    margin: 60,
    backgroundColor: "#8B0000",
  },
});

export default SettingsModalScreen;
