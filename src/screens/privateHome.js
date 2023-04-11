import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
import { AuthContext } from '../contexts/auth'
import Header from '../components/header'
import axios from 'axios'

const PrivateHome = ({navigation, route}) => {
    const {userToken, logout} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    const [collection, setCollection] = useState([])
    const getInfo = function(){
        axios.get(`${address}/destinations/favorite/${userToken.account._id}`, {
            headers: {Authorization: `Bearer ${userToken.token}`},
        })
        .then(function(res){
            setCollection(res.data.destinations)
        })
        .catch(function(err){
            console.log("Err:", err)
        })
    }
    useEffect(()=>{
        getInfo()
    }, [collection])

    const directLink = function(){
        if(userToken.account.role == "qtv"){
            navigation.navigate("manageAccount")
        }
        else if(userToken.account.role == "ctv1"){
            navigation.navigate("manageDestination")
        }
        else if(userToken.account.role == "ctv2"){
            navigation.navigate("manageTour")
        }
    }
    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <Header navigation={navigation} route={route}/>
            <Text style={styles.title}>My Home</Text>
            <View style={styles.body}>
                <Text style={{fontSize: 15, fontWeight: "bold"}}>Username: {userToken.account.username}</Text>
                <Text style={{fontSize: 15, fontWeight: "bold"}}>ID: {userToken.account._id}</Text>
                {userToken.account.role == "tv" ?
                <View style={{marginVertical: 15}}>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>Favorite: </Text>
                    {
                        collection.map((item, index)=>{
                            return <Pressable style={{marginTop: 10}} key={index} onPress={()=>{navigation.navigate("detailDes",  {_id: item._id})}}>
                                        <Text style={{color: "orange", fontSize: 15, fontWeight: "bold"}}>{item.name}</Text>
                                    </Pressable>
                        })
                    }
                </View>
                :<View></View>
                }
                <View style={{flexDirection: "row"}}>
                {
                    userToken.account.role != "tv"
                    ?   <TouchableOpacity style={styles.btn} onPress={directLink}>
                            <Text style={{textAlign: "center"}}>Manage</Text>
                        </TouchableOpacity>  
                    :   <></>
                }
                <TouchableOpacity style={styles.btn} onPress={logout}>
                    <Text style={{textAlign: "center"}}>Log out</Text>
                </TouchableOpacity>   
                </View>
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
        marginRight: 10,
        backgroundColor: "pink",
        paddingVertical: 10,
        borderRadius: 5,
        width: "20%"
    }
})

export default PrivateHome