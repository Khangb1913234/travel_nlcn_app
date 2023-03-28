import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
export const AuthContext = createContext();

const IP = "http://10.13.144.87:5000"
// const IP = "http://192.168.1.8:5000"
// const IP = "http://192.168.2.53:5000"
// const IP = "http://192.168.52.155:5000"

export const AuthProvider = ({children}) => {
    
    const [userToken, setUserToken] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage]= useState("")
    const [address, setAddress] = useState(IP)

    const register = function(email, username, password, navigation){    
        if(email.length == 0 || username.length == 0 || password.length == 0){
            alert("Please fill in the fields")
            return false
        }
        setIsLoading(true)
        axios.post(`${IP}/account/register`, {
            email: email,
            username: username,
            password: password
        })
        .then(function(res){
            if(res.data.msg == "Fail")
                console.log("This username is already in use")
            else{
                console.log("You register")
                navigation.navigate("login")
                setIsLoading(false)
            }
        })
        .catch(function(err){
            console.log(err)
        })
    }

    const login = function(username, password, navigation){
        if(username.length == 0 || password.length == 0){
            alert("Please fill in the fields")
            return false
        }
        setIsLoading(true)
        axios.post(`${IP}/account/login`, {
            username: username,
            password: password
        })
        .then(function(res){
            if(res.data.msg == "Fail Username"){
                setMessage("Wrong username")
                console.log("Wrong username")
                setIsLoading(false)
            }
            else if(res.data.msg == "Fail Password"){
                setMessage("Wrong password")
                console.log("Wrong password")
                setIsLoading(false)
            }
            else{           
                setUserToken(res.data)
                AsyncStorage.setItem("token", JSON.stringify(res.data))
                setMessage("")
                setIsLoading(false)
                //navigation.navigate("todolist")
            }
        })
        .catch(function(err){
            console.log("Err", err)
        })
    }
    
    const logout = () => {
        console.log(userToken.account.username, "log out")
        AsyncStorage.removeItem("token")
        setUserToken({})
        
    }

    const isLoggedIn = async () => {
        try {
    
          let userInfo = await AsyncStorage.getItem("token")
          userInfo = JSON.parse(userInfo);
    
          if(userInfo) {

            setUserToken(userInfo)
          }
    
        } catch (e) {
          console.log(`is logged in error ${e}`)
        }
    }

    const updateSymbol = function(){
        axios.get(`${address}/account/detail`, {
            headers: {Authorization: `Bearer ${userToken.token}`},
        })
        .then(function(res){
            setUserToken(Object.assign(userToken, res.data))
        })
        .catch(function(err){
            console.log("Err:", err)
        })
    }

    // const update = function(){
    //     if(Object.keys(userToken).length != 0){
    //         axios.get(`${address}/account/detail`, {
    //             headers: {Authorization: `Bearer ${userToken.token}`},
    //         })
    //         .then(function(res){
    //             setUserToken(Object.assign(res.data, userToken))
    //             // /console.log(Object.assign(res.data, userToken))
    //         })
    //         .catch(function(err){
    //             console.log("Err:", err)
    //         })
    //     }
    // }

    
    
    useEffect(() => {
        isLoggedIn();
    }, [])

    // useEffect(() => {
    //     update();
    // }, [userToken])


  return (
    <AuthContext.Provider
      value={{register, login, logout, updateSymbol, userToken, isLoading, message, address}}>
      {children}
    </AuthContext.Provider>
  );
};