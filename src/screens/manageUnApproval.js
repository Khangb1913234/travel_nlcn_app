import { View, Text, Pressable, Alert, ScrollView } from 'react-native'
import Header from '../components/header'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/auth'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Checkbox from 'expo-checkbox';

const address = "http://192.168.1.12:5000"
const ManageUnApproval = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const [unapprovals, setUnApprovals] = useState([])
    var findAllUnApproval
    if(route.params.locate == "destinations"){
        findAllUnApproval = function(){
            axios.get(`${address}/me/stored/notdestinations`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
              .then(function(res){
                var arr1 = []
                for(var i = 0; i < res.data.destinations.length; i++){
                    arr1.push(res.data.destinations[i])
                }
                setUnApprovals(arr1)
              })
              .catch(function(err){
                console.log("Err:", err)
              })
        }
    }
    else{
        findAllUnApproval = function(){
            axios.get(`${address}/me/stored/nottours`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
              .then(function(res){
                var arr1 = []
                for(var i = 0; i < res.data.tours.length; i++){
                    arr1.push(res.data.tours[i])
                }
                setUnApprovals(arr1)
              })
              .catch(function(err){
                console.log("Err:", err)
              })
        }
    }

    const createApproval = function(_id){
        if(route.params.locate == "destinations"){
            Alert.alert(
                "This destination will be approve",
                "Are you sure ?",
                [
                  { 
                    text: "OK", onPress: () => {
                      axios.post(`${address}/approvals/create`, {
                        destinationId: _id
                        }, {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                        })
                        .then(function(res){
                            navigation.navigate("manageUnapproval", {locate: route.params.locate})
                        })
                        .catch(function(err){
                            console.log("Err:", err)
                        })
                    } 
                  },
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Delete Pressed"),
                    style: "cancel"
                  }
                ]
              )
        }
        else if(route.params.locate == "tours"){
            Alert.alert(
                "This tour will be approve",
                "Are you sure ?",
                [
                  { 
                    text: "OK", onPress: () => {
                      axios.post(`${address}/approvals/create`, {
                        tourId: _id
                        }, {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                        })
                        .then(function(res){
                            navigation.navigate("manageUnapproval", {locate: route.params.locate})
                        })
                        .catch(function(err){
                            console.log("Err:", err)
                        })
                    } 
                  },
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Delete Pressed"),
                    style: "cancel"
                  }
                ]
              )
        }
        
    }

    


    useEffect(()=>{
        findAllUnApproval()
    }, [unapprovals])
    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <Header navigation={navigation} route={route} />
            <View style={{flexDirection: "row", margin: 5}}>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageAccount")}>
                    <Text style={{color: "orange"}}>Account</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageApproval", {locate: "destinations"})}>
                    <Text style={{color: "orange"}}>Approval</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageUnapproval", {locate: "destinations"})}>
                    <Text style={{color: "orange"}}>Unapproval</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageType")}>
                    <Text style={{color: "orange"}}>Type</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageService")}>
                    <Text style={{color: "orange"}}>Service</Text>
                </Pressable>
            </View>
            <ScrollView>
            <View style={{flexDirection: "row", marginTop: 15, marginHorizontal: 5}}>
                <Pressable style={{paddingHorizontal: 5, borderRightWidth: 1, borderColor: "#BDBDBD"}} onPress={()=>navigation.navigate("manageUnapproval", {locate: "destinations"})}>
                    <Text style={{color: "orange"}}>Destination</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 5}} onPress={()=>navigation.navigate("manageUnapproval", {locate: "tours"})}>
                    <Text style={{color: "orange"}}>Tour</Text>
                </Pressable>
            </View>
            <Text style={{margin: 10, fontSize: 20, fontWeight: "bold"}}>Unapproval</Text>
            <View style={{flexDirection: "row", margin: 10, borderTopWidth:0.5, borderBottomWidth: 0.5}}>
                <Text style={{width: "10%", fontWeight: "bold"}}>#</Text>
                <Text style={{width: "35%", fontWeight: "bold"}}>Name</Text>
                <Text style={{width: "20%", fontWeight: "bold"}}>Creator</Text>
                <Text style={{width: "25%", fontWeight: "bold"}}>Created At</Text>
            </View>
            {
                route.params.locate == "destinations" ?
                unapprovals.map((item, index)=>{
                    var a = new Date(item.createdAt)
                    var d = a.getDate()
                    var m = a.getMonth() + 1
                    var y = a.getFullYear()
                    var s = `${d}/${m}/${y}`
                    return  <View key={index} style={{flexDirection: "row", margin: 10}}>
                                <Text style={{width: "10%"}}>{index+1}</Text>
                                <Text style={{width: "35%"}}>{item.name}</Text>
                                <Text style={{width: "20%"}}>{item.creator}</Text>
                                <Text style={{width: "25%"}}>{s}</Text>
                                <Pressable style={{marginLeft: 10}} onPress={()=>createApproval(item._id)}>
                                    <Icon name="checkmark-sharp" size={25} style={{color: "orange", fontWeight: "bold"}}></Icon>
                                </Pressable>
                            </View>
                })
                :unapprovals.map((item, index)=>{
                    var a = new Date(item.createdAt)
                    var d = a.getDate()
                    var m = a.getMonth() + 1
                    var y = a.getFullYear()
                    var s = `${d}/${m}/${y}`
                    return  <View key={index} style={{flexDirection: "row", margin: 10}}>
                                <Text style={{width: "10%"}}>{index+1}</Text>
                                <Text style={{width: "35%"}}>{item.title}</Text>
                                <Text style={{width: "20%"}}>{item.creator}</Text>
                                <Text style={{width: "25%"}}>{s}</Text>
                                <Pressable style={{marginLeft: 10}} onPress={()=>createApproval(item._id)}>
                                    <Icon name="checkmark-sharp" size={25} style={{color: "orange", fontWeight: "bold"}}></Icon>
                                </Pressable>
                            </View>
                })
            }
            </ScrollView>
        </View>
    )
}

export default ManageUnApproval