import { View, Text, Pressable, Alert, ScrollView } from 'react-native'
import Header from '../components/header'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/auth'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Checkbox from 'expo-checkbox';
// import NavTop from '../components/nav_top'
import { useRoute } from '@react-navigation/native';


// const address = "http://192.168.1.12:5000"
const ManageApproval = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    const [approvals, setApprovals] = useState([])
    const [checked, setChecked] = useState([])
    const [isSelectedAll, setSelectionAll] = useState(false)

    const state = useRoute()

    const findAllApproval = function(){
        axios.get(`${address}/me/stored/approvals/${route.params.locate}`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr1 = []
            for(var i = 0; i < res.data.approvals.length; i++){
                arr1.push(res.data.approvals[i])
            }
            setApprovals(arr1)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }

    const deleteApproval = function(data){
        Alert.alert(
            "This approval will be delete",
            "Are you sure ?",
            [
              { 
                text: "OK", onPress: () => {
                  axios.delete(`${address}/approvals/delete/${data}`, {
                    headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                    })
                    .then(function(res){
                        navigation.navigate("manageApproval", {locate: route.params.locate})
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

    const handleChange = (id) => {
        const clickedCategory = checked.indexOf(id)
        const all = [...checked]
        if (clickedCategory === -1)
            all.push(id)
        else
            all.splice(clickedCategory, 1)
        all.length == approvals.length ? setSelectionAll(true) : setSelectionAll(false)
  
        setChecked(all)
    }

    const display = (id) => {
        const temp = [...checked]
        for(var i = 0; i < temp.length; i++)
            if(temp[i] == id)
                return true
        return false
    }


    const handleSelectAll = () => {
        if(isSelectedAll == false){
          setSelectionAll(true)
          var temp = []
          for(var i = 0; i < approvals.length; i++)
              temp.push(approvals[i]._id)
          setChecked(temp)
        }
        else{
          setSelectionAll(false)
          var temp = []
          setChecked(temp)
        }
    }

    const deleteManyApproval = function(){
        if(checked.length > 0){
            Alert.alert(
                "These approvals will be delete",
                "Are you sure ?",
                [
                { 
                    text: "OK", onPress: () => {
                        axios.post(`${address}/approvals/action`, {
                            action: "delete", approvals: checked
                        }, 
                        {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                        })
                        .then(function(res){
                            setChecked([])
                            navigation.navigate("manageApproval", {locate: route.params.locate})
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
        else{
            alert("Please select approval you want to delete")
        }
        
    }

    useEffect(()=>{
        findAllApproval()
    }, [approvals])

    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <Header navigation={navigation} route={route} />
            <View style={{flexDirection: "row", margin: 5}}>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageAccount")}>
                    <Text style={{color: "orange"}}>Account</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageApproval", {locate: "destinations"})}>
                    <Text style={state.name == "manageApproval" ? {color: "orange", fontWeight: "bold"} : {color: "orange"}}>Approval</Text>
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
                <Pressable style={{paddingHorizontal: 5, borderRightWidth: 1, borderColor: "#BDBDBD"}} onPress={()=>navigation.navigate("manageApproval", {locate: "destinations"})}>
                    <Text style={route.params.locate == "destinations" ? {color: "orange", fontWeight: "bold"} : {color: "orange", }}>Destination</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 5}} onPress={()=>navigation.navigate("manageApproval", {locate: "tours"})}>
                    <Text style={route.params.locate == "tours" ? {color: "orange", fontWeight: "bold"} : {color: "orange", }}>Tour</Text>
                </Pressable>
            </View>
            <Text style={{margin: 10, fontSize: 20, fontWeight: "bold"}}>Approval</Text>
            <View style={{flexDirection: "row"}}>
            <Checkbox
                value={isSelectedAll}
                onValueChange={handleSelectAll}
                color={isSelectedAll ? '#4630EB' : undefined}
                style={{marginLeft: 10, marginTop: 10, width: 20, height: 20}}
            />
            <Text style={{padding: 10}}>Select All</Text>
            <Pressable style={{paddingVertical: 10, paddingHorizontal: 5}} onPress={deleteManyApproval}>
                <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
            </Pressable>
            </View>
            <View style={{flexDirection: "row", margin: 10, borderTopWidth:0.5, borderBottomWidth: 0.5}}>
                <Text style={{width: "10%", fontWeight: "bold"}}></Text>
                <Text style={{width: "10%", fontWeight: "bold"}}>#</Text>
                <Text style={{width: "45%", fontWeight: "bold"}}>Name</Text>
                <Text style={{width: "25%", fontWeight: "bold"}}>Created At</Text>
            </View>
            {
                route.params.locate == "destinations" ? 
                approvals.map((item, index)=>{
                    var a = new Date(item.createdAt)
                    var d = a.getDate()
                    var m = a.getMonth() + 1
                    var y = a.getFullYear()
                    var s = `${d}/${m}/${y}`
                    return  <View key={index} style={{flexDirection: "row", margin: 10}}>
                                <View style={{width: "10%"}}>
                                <Checkbox
                                    value={display(item._id)}
                                    onValueChange={()=>{handleChange(item._id)}}
                                    color={display(item._id) ? '#4630EB' : undefined}
                                    style={{width: 20, height: 20}}
                                />
                                </View>
                                <Text style={{width: "10%"}}>{index+1}</Text>
                                <Text style={{width: "45%"}}>{item.destinationName}</Text>
                                <Text style={{width: "25%"}}>{s}</Text>
                                <Pressable style={{marginLeft: 20}} onPress={()=>deleteApproval(item._id)}>
                                    <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
                                </Pressable>
                            </View>
                })
                :approvals.map((item, index)=>{
                    var a = new Date(item.createdAt)
                    var d = a.getDate()
                    var m = a.getMonth() + 1
                    var y = a.getFullYear()
                    var s = `${d}/${m}/${y}`
                    return  <View key={index} style={{flexDirection: "row", margin: 10}}>
                                <View style={{width: "10%"}}>
                                <Checkbox
                                    value={display(item._id)}
                                    onValueChange={()=>{handleChange(item._id)}}
                                    color={display(item._id) ? '#4630EB' : undefined}
                                    style={{width: 20, height: 20}}
                                />
                                </View>
                                <Text style={{width: "10%"}}>{index+1}</Text>
                                <Text style={{width: "45%"}}>{item.tourName}</Text>
                                <Text style={{width: "25%"}}>{s}</Text>
                                <Pressable style={{marginLeft: 20}} onPress={()=>deleteApproval(item._id)}>
                                    <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
                                </Pressable>
                            </View>
                })
            }
            </ScrollView>
        </View>
    )
}

export default ManageApproval