import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import Header from '../components/header'

const PrivateHome = ({navigation, route}) => {
    const {userToken, logout} = useContext(AuthContext)
    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <Header navigation={navigation} route={route}/>
            <Text style={styles.title}>Private Home</Text>
            <View style={styles.body}>
                <Text style={{fontSize: 15}}>Username: {userToken.account.username}</Text>
                <Text style={{fontSize: 15}}>ID: {userToken.account._id}</Text>
                <TouchableOpacity style={styles.btn} onPress={logout}>
                    <Text style={{textAlign: "center"}}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: "center", 
        fontSize: 25,
        color: "blue",
        fontStyle: "italic",
        fontWeight: "bold",
        marginTop: 10
    },
    body: {
        marginTop: 10,
        marginLeft: 10,
    },
    btn: {
        marginTop: 20,
        backgroundColor: "pink",
        paddingVertical: 10,
        borderRadius: 5,
        width: "20%"
    }
})

export default PrivateHome