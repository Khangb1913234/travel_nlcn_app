import {StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Header from '../components/header'


const Login = ({navigation, route}) => {
    const {login, isLoading, message} = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    
    return (
        <>
        <Header navigation={navigation} route={route}/>

        <View style={styles.container}>
            <Spinner visible={isLoading}/>
            
            <Text style={{flex: 0.45, fontSize: 35, color: "orange"}}>Login</Text>
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
                onPress={()=>{login(username, password, navigation)}}
            >
                <Text style={styles.loginText}>LOGIN</Text> 
            </TouchableOpacity>
            <Text style={{marginTop: 20, color: "red"}}>{message}</Text>
            <View style={{marginTop: 20, flexDirection: "row"}}>  
                <Text style={{marginRight: 10, fontSize: 15}}>New to ? </Text>
                <TouchableOpacity style={{}} onPress={()=>navigation.navigate("register")}>
                    <Text style={{color: "orange", fontSize: 15}}>Sign up</Text> 
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
        padding: 10,
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

export default Login