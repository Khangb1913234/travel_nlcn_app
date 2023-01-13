import { View, Text, Image, StyleSheet, ScrollView, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/header'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'
import Footer from '../components/footer';
import { Searchbar } from 'react-native-paper';

const address = "http://10.3.55.106:5000"
const Destinations = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const [destinations, setDestiantions] = useState([])
    const [search, setSearch] = useState("")
    const findAllDestination = function(){
        axios.get(`${address}/destinations/`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr = []
            for(var i = 0; i < res.data.destinations.length; i++){
                arr.push(res.data.destinations[i])
            }
            setDestiantions(arr)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }
    const searchDestination = function(search){
        if(search){
            setSearch(search)
            axios.get(`${address}/destinations/search/${search}`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
            .then(function(res){
                var arr = []
                for(var i = 0; i < res.data.destinations.length; i++){
                    arr.push(res.data.destinations[i])
                }
                setDestiantions(arr)
            })
            .catch(function(err){
                console.log("Err:", err)
            })
        }
        else{
            setSearch("")
            findAllDestination()
        }
    }
    useEffect(()=>{
        if(search == "")
            findAllDestination()
    }, [destinations])
    return ( 
        <View style={{backgroundColor: "white", flex: 1}}>
            <Header navigation={navigation} route={route}/>
            <View style={{flexDirection: "row"}}>
                <TextInput
                    value={search} 
                    placeholder='Search...' 
                    style={styles.input}
                    onChangeText = {(text) => searchDestination(text)}
                >
                </TextInput>
                {/* <TouchableOpacity style={{}} onPress={searchDestination}>
                    <View style={styles.iconWrapper}>
                        <Icon name = "search" style={styles.icon} />
                    </View>
                </TouchableOpacity> */}
            </View>
            <ScrollView>
            {
                destinations.map(function(item, index){
                    return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailDes")}}>
                                <Card style={{height: 500, width: "90%", marginVertical: 20}}>
                                    <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                                    <View style={{flexDirection: "row", padding: 5}}>                                    
                                        <View style={styles.point}>
                                            <Text style={{textAlign: "center", color: "white", marginTop: 10}}>3.5</Text>                       
                                        </View>
                                        <Text style={styles.paragraph}>{item.name}</Text>
                                    </View>
                                    <Text style={{padding: 10}}>{item.address}</Text>
                                    <View style={{padding: 10, flexDirection: "row"}}>
                                        <Icon name="comment-o" size={20}/>
                                        <Text style={{paddingHorizontal: 5}}>{item.count}</Text>
                                    </View>
                                </Card>
                            </Pressable>
                            
                })
            }
            </ScrollView>
            {/* <Footer /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        color: "orange"
      },
    point: {
        marginTop: 10,
        alignContent: "center",
        backgroundColor: "green",
        borderRadius: 44,
        width: 44,
        height: 44
      },
    input: {
        margin: 10,
        height: 44,
        width: "80%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#21a3d0",
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    iconWrapper: {
        marginVertical: 10,
        width: 44,
        height: 44,
        backgroundColor: "#21a3d0",
        borderRadius: 44,
        alignItems: "center",
        justifyContent: "center",
        //borderWidth: 1
    },
    icon: {
        fontSize: 24,
        color: "#fff"
    }
})

export default Destinations