import { View, Text, Pressable, Alert, ScrollView } from 'react-native'
import Header from '../../components/header'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Checkbox from 'expo-checkbox';
import { useRoute } from '@react-navigation/native';

// const address = "http://192.168.1.12:5000"
const ManageType = ({navigation, route}) => {
    const state = useRoute()
    const {userToken} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    const [types, setTypes] = useState([])
    const [checked, setChecked] = useState([])
    const [isSelectedAll, setSelectionAll] = useState(false)
    const findAllType = function(){
        axios.get(`${address}/me/stored/types`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr1 = []
            for(var i = 0; i < res.data.types.length; i++){
                arr1.push(res.data.types[i])
            }
            setTypes(arr1)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }

    const deleteType = function(data){
        Alert.alert(
            "This type will be delete",
            "Are you sure ?",
            [
              { 
                text: "OK", onPress: () => {
                  axios.delete(`${address}/types/delete/${data}`, {
                    headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                    })
                    .then(function(res){
                        // navigation.navigate("manageType")
                        setTypes(types.filter((type) => type._id !== data))
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
        all.length == types.length ? setSelectionAll(true) : setSelectionAll(false)
  
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
          for(var i = 0; i < types.length; i++)
              temp.push(types[i]._id)
          setChecked(temp)
        }
        else{
          setSelectionAll(false)
          var temp = []
          setChecked(temp)
        }
    }

    const deleteManyType = function(){
        if(checked.length > 0){
            Alert.alert(
                "These types will be delete",
                "Are you sure ?",
                [
                { 
                    text: "OK", onPress: () => {
                        axios.post(`${address}/types/action`, {
                            action: "delete", types: checked
                        }, 
                        {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                        })
                        .then(function(res){
                            //navigation.navigate("manageType")
                            setTypes(types.filter((type) => !checked.includes(type._id)))
                            setChecked([])
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
            alert("Please select type you want to delete")
        }
        
    }

    useEffect(()=>{
        findAllType()
    }, [])
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
                    <Text style={state.name == "manageType" ? {color: "orange", fontWeight: "bold"} : {color: "orange"}}>Type</Text>
                </Pressable>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageService")}>
                    <Text style={{color: "orange"}}>Service</Text>
                </Pressable>
            </View>
            <ScrollView>
            <Text style={{margin: 10, fontSize: 20, fontWeight: "bold"}}>Type</Text>
            <View style={{flexDirection: "row"}}>
            <Checkbox
                value={isSelectedAll}
                onValueChange={handleSelectAll}
                color={isSelectedAll ? '#4630EB' : undefined}
                style={{marginLeft: 10, marginTop: 10, width: 20, height: 20}}
            />
            <Text style={{padding: 10}}>Select All</Text>
            <Pressable style={{paddingVertical: 10, paddingHorizontal: 5}} onPress={deleteManyType}>
                <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
            </Pressable>
            <Pressable style={{paddingVertical: 10, paddingHorizontal: 5, backgroundColor: "#04B404", borderRadius: 5, width: 65, marginLeft: 200}} onPress={()=>navigation.navigate("add", {addStyle: "types", rerender: setTypes})}>
                <Text style={{color: "white", textAlign: "center"}}>Create</Text>
            </Pressable>
            </View>
            <View style={{flexDirection: "row", margin: 10, borderTopWidth:0.5, borderBottomWidth: 0.5}}>
                <Text style={{width: "10%", fontWeight: "bold"}}></Text>
                <Text style={{width: "10%", fontWeight: "bold"}}>#</Text>
                <Text style={{width: "35%", fontWeight: "bold"}}>Name</Text>
                <Text style={{width: "25%", fontWeight: "bold"}}>Created At</Text>
            </View>
            {
                types.map((item, index)=>{
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
                                <Text style={{width: "35%"}}>{item.name}</Text>
                                <Text style={{width: "25%"}}>{s}</Text>
                                <Pressable style={{marginLeft: 10}} onPress={()=>{navigation.navigate("edit", {editStyle: "type", _id: item._id, name: item.name, rerender: setTypes})}}>
                                    <Icon name="pencil" size={18} style={{color: "orange"}}></Icon>
                                </Pressable>
                                <Pressable style={{marginLeft: 20}} onPress={()=>deleteType(item._id)}>
                                    <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
                                </Pressable>
                            </View>
                })
            }
            </ScrollView>
        </View>
    )
}

export default ManageType