import { Button, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { AuthContext } from '../../../context/AuthContext';
import { useContext } from "react";



export default function TabOneScreen() {
  const { signOut } = useContext(AuthContext);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text>Welcome, Guillermo</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
