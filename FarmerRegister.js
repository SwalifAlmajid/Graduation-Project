import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function FarmerRegister({ navigation }) {
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>سجل اشتراكك في حصاد</Text>

      <View style={styles.card}>

        <Text style={styles.label}>اسم المزارع</Text>
        <TextInput style={styles.input} placeholder="حصاد"/>

        <Text style={styles.label}>رقم الجوال</Text>
        <TextInput style={styles.input} placeholder="+966"/>

        <Text style={styles.label}>رقم الهوية / الإقامة</Text>
        <TextInput style={styles.input}/>

        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput style={styles.input} secureTextEntry/>

        <Text style={styles.label}>تأكيد كلمة المرور</Text>
        <TextInput style={styles.input} secureTextEntry/>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>اكمل بيانات المزرعة</Text>
        </TouchableOpacity>
        <TouchableOpacity 
  style={styles.loginLink}
  onPress={() => navigation.navigate("Login")}
>
  <Text style={styles.loginText}>
    لديك حساب؟
    سجل دخولك
  </Text>
</TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#63A874",
paddingTop:120
},

title:{
color:"#fff",
fontSize:28,
textAlign:"center",
fontWeight:"bold",
marginBottom:30
},

card:{
flex:1,
backgroundColor:"#fff",
borderTopLeftRadius:40,
borderTopRightRadius:40,
padding:25
},

label:{
color:"#2f6b3c",
marginTop:15,
marginBottom:5
},

input:{
borderBottomWidth:1,
borderBottomColor:"#ccc",
padding:8
},

button:{
backgroundColor:"#4E8F5C",
marginTop:40,
padding:16,
borderRadius:30,
alignItems:"center"
},

buttonText:{
color:"#fff",
fontSize:16,
fontWeight:"bold"
},

loginLink: {
  marginTop: 15,
  alignItems: "center",
},

loginText: {
  color: "#2E7D32",
  fontSize: 16,
  fontWeight: "600",
},

});