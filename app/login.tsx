import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { router } from "expo-router";
import Logo from "../assets/images/FitMemo_Logo.svg";
import { Button, TextInput } from "react-native-paper";

export default function Login() {
  const { signIn } = useSession();
  const handleLogin = () => {
    //Adicione sua lógica de login aqui
    signIn();
    //Antes de navegar, tenha certeza de que o usuário está autenticado
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Logo width={400} height={200} />
      <Text style={styles.title}>Bienvenido </Text>
      <Text style={styles.paragraph}>Todo comienza aquí.
      </Text>
      


      <TextInput
        label="Email"
        value="Email"
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value="Contraseña"
        style={styles.input}
      />
      <Button icon="login" mode="contained" onPress={handleLogin} style={styles.input}>
        Iniciar sesión
      </Button>

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 150,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',  // Centra el texto dentro del componente Text
    marginBottom: 10,    // Espacio debajo del título
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',  // Centra el texto dentro del componente Text
    marginBottom: 20,    // Espacio debajo del párrafo
  },
  input: {
    margin: 20,
  },
});
