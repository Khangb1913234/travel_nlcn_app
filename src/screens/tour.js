import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import Header from '../components/header'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'

const address = "http://10.3.55.106:5000"
const Tours = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const [tours, setTours] = useState([])
    const findAllTour = function(){
        axios.get(`${address}/tours/`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr = []
            for(var i = 0; i < res.data.tours.length; i++){
                arr.push(res.data.tours[i])
            }
            setTours(arr)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }
    useEffect(()=>{
        findAllTour()
    }, [tours])
    return ( 
        <View style={{backgroundColor: "white", flex: 1}}>
            <Header navigation={navigation} route={route}/>
            <ScrollView>
            {
                tours.map(function(item, index){
                    return  <View key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                                <Card style={{height: 500, width: "90%", marginVertical: 20}}>
                                    <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                                    <View style={{flexDirection: "row"}}>                                    
                                        <Text style={styles.paragraph}>{item.title}</Text>
                                    </View>
                                    <Text style={{paddingHorizontal: 20}}>{item.time}</Text>
                                    <Text style={{padding: 20, fontSize: 20, color: "red", fontWeight: "bold"}}>{item.price + " VND"}</Text>
                                </Card>
                            </View>
                })
            }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        color: "#25a5be"
      },
    point: {
        marginTop: 10,
        alignContent: "center",
        backgroundColor: "green",
        borderRadius: 44,
        width: 44,
        height: 44
      },
})

export default Tours