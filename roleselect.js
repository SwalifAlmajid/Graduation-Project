import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Stack = createStackNavigator();

function SignupTypeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر دورك في حصاد</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("UserSignup")}
      >
        <Text>مستخدم</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("FarmerSignup")}
      >
        <Text>مزارع</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("CaptainSignup")}
      >
        <Text>كابتن</Text>
      </TouchableOpacity>
    </View>
  );
}
function UserSignup() {
  return (
    <View style={styles.screen}>
      <Text>تسجيل مستخدم</Text>
    </View>
  );
}

function FarmerSignup() {
  return (
    <View style={styles.screen}>
      <Text>تسجيل مزارع</Text>
    </View>
  );
}

function CaptainSignup() {
  return (
    <View style={styles.screen}>
      <Text>تسجيل كابتن</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={SignupTypeScreen} />
        <Stack.Screen name="UserSignup" component={UserSignup} />
        <Stack.Screen name="FarmerSignup" component={FarmerSignup} />
        <Stack.Screen name="CaptainSignup" component={CaptainSignup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A6741",
  },

  header: {
    padding: 20,
    marginTop: 10,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "right",
  },

  card: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },

  question: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A6741",
    textAlign: "center",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  box: {
    width: "48%",
    backgroundColor: "#DCE7DC",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
  },

  centerBoxWrapper: {
    alignItems: "center",
    marginTop: 20,
  },

  centerBox: {
    width: "60%",
  },

  activeBox: {
    backgroundColor: "#B7CDB7",
    transform: [{ scale: 0.97 }],
  },

  boxText: {
    marginTop: 10,
    color: "#4A6741",
    fontSize: 16,
    fontWeight: "600",
  },

  loginText: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
  },

  loginBtn: {
    textAlign: "center",
    color: "#4A6741",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
});

