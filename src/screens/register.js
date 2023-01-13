import {StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../components/header';

const Register = ({navigation, route}) => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {register, isLoading} = useContext(AuthContext)
    return (
        <>
        <Header navigation={navigation} route={route}/>
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <Text style={{flex: 0.45, fontSize: 35, color: "orange"}}>Sign up</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email..."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                /> 
            </View> 
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username..."
                    placeholderTextColor="#003f5c"
                    onChangeText={(username) => setUsername(username)}
                /> 
            </View> 
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password..."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                /> 
            </View>
            <TouchableOpacity 
                style={styles.loginBtn} 
                onPress={()=>{register(email, username, password, navigation)}}
            >
                <Text style={styles.loginText}>SIGN UP</Text> 
            </TouchableOpacity>
            <View style={{marginTop: 50, flexDirection: "row"}}>
                <Text style={{marginRight: 10, fontSize: 15}}>Already have an account ? </Text>
                <TouchableOpacity style={{}} onPress={()=>navigation.navigate("login")}>
                    <Text style={{color: "orange", fontSize: 15}}>Login</Text> 
                </TouchableOpacity>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    inputView: {
        backgroundColor: "lightblue",
        borderRadius: 5,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 5,
        marginLeft: 20,
    },
    loginBtn:{
        width:"80%",
        borderRadius: 25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        backgroundColor:"#33CCFF",
    }
  });

export default Register