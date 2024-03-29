import { View, Text, Pressable, Alert, ScrollView, Dimensions } from 'react-native'
import Header from '../../components/header'
import axios from 'axios'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Checkbox from 'expo-checkbox';
import { useRoute } from '@react-navigation/native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import moment from 'moment';

// const address = "http://192.168.1.12:5000"
const ManageAccount = ({navigation, route}) => {
    const state = useRoute()
    const {userToken} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    const [accounts, setAccounts] = useState([])
    const [checked, setChecked] = useState([])
    const [isSelectedAll, setSelectionAll] = useState(false)
    const [statistic, setStatistic] = useState([])
    const [date, setDate] = useState(["05-05-2023"])
    const [total, setTotal] = useState([4])
    const findAllAccount = function(){
        axios.get(`${address}/me/stored/accounts`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr1 = []
            for(var i = 0; i < res.data.accounts.length; i++){
                arr1.push(res.data.accounts[i])
            }
            setAccounts(arr1)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }
    const statisticNewAccount = ()=>{
        axios.get(`${address}/account/statistic`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
        .then(function(res){
            setStatistic(res.data.result)
            var arr1 = []
            var arr2 = []
            for(var i = 0; i < res.data.result.length; i++){
                arr1.push(res.data.result[i]._id.slice(0, 5))
                arr2.push(res.data.result[i].total)
            }
            setDate(arr1)
            setTotal(arr2)
        })
        .catch(function(err){
          console.log("Err", err)
        })
    }

    const deleteAccount = function(data){
        Alert.alert(
            "This account will be delete",
            "Are you sure ?",
            [
            { 
                text: "OK", onPress: () => {
                axios.delete(`${address}/account/delete/${data}`, {
                    headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                    })
                    .then(function(res){
                        // navigation.navigate("manageAccount")
                        setAccounts(accounts.filter((account) => account._id !== data))
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
    //console.log(checked)
    const deleteManyAccount = function(){
        if(checked.length > 0){
            Alert.alert(
                "These account will be delete",
                "Are you sure ?",
                [
                { 
                    text: "OK", onPress: () => {
                        axios.post(`${address}/account/action`, {
                            action: "delete", accounts: checked
                        }, 
                        {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                        })
                        .then(function(res){
                           // navigation.navigate("manageAccount")
                            setAccounts(accounts.filter((account) => !checked.includes(account._id)))
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
            alert("Please select account you want to delete")
        }
        
    }

    //console.log(checked)

    const handleChange = (id) => {
        const clickedCategory = checked.indexOf(id)
        const all = [...checked]
        if (clickedCategory === -1)
            all.push(id)
        else
            all.splice(clickedCategory, 1)
        all.length == accounts.length ? setSelectionAll(true) : setSelectionAll(false)
  
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
          for(var i = 0; i < accounts.length; i++)
              temp.push(accounts[i]._id)
          setChecked(temp)
        }
        else{
          setSelectionAll(false)
          var temp = []
          setChecked(temp)
        }
    }

    //console.log(statistic)
    

    useEffect(()=>{
        findAllAccount()
    }, [])

    useLayoutEffect(()=>{
        statisticNewAccount()
    }, [])


    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <Header navigation={navigation} route={route} />
            <View style={{flexDirection: "row", margin: 5}}>
                <Pressable style={{paddingHorizontal: 10}} onPress={()=>navigation.navigate("manageAccount")}>
                    <Text style={state.name == "manageAccount" ? {color: "orange", fontWeight: "bold"} : {color: "orange"}}>Account</Text>
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
            <Text style={{margin: 10, fontSize: 20, fontWeight: "bold"}}>Account</Text>
            <View style={{flexDirection: "row"}}>
            <Checkbox
                value={isSelectedAll}
                onValueChange={handleSelectAll}
                color={isSelectedAll ? '#4630EB' : undefined}
                style={{marginLeft: 10, marginTop: 10, width: 20, height: 20}}
            />
            <Text style={{padding: 10}}>Select All</Text>
            <Pressable style={{paddingVertical: 10, paddingHorizontal: 5}} onPress={deleteManyAccount}>
                <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
            </Pressable>
            </View>
            <View style={{flexDirection: "row", margin: 10, borderTopWidth:0.5, borderBottomWidth: 0.5}}>
                <Text style={{width: "10%", fontWeight: "bold"}}></Text>
                <Text style={{width: "5%", fontWeight: "bold"}}>#</Text>
                <Text style={{width: "25%", fontWeight: "bold"}}>Username</Text>
                <Text style={{width: "15%", fontWeight: "bold"}}>Role</Text>
                <Text style={{width: "25%", fontWeight: "bold"}}>Created At</Text>
            </View>
            {
                accounts.map((item, index)=>{
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
                                <Text style={{width: "5%"}}>{index+1}</Text>
                                <Text style={{width: "25%"}}>{item.username}</Text>
                                <Text style={{width: "15%"}}>{item.role}</Text>
                                <Text style={{width: "25%"}}>{s}</Text>
                                <Pressable style={{marginLeft: 10}} onPress={()=>{navigation.navigate("edit", {editStyle: "account", _id: item._id, role: item.role, rerender: setAccounts})}}>
                                    <Icon name="pencil" size={18} style={{color: "orange"}}></Icon>
                                </Pressable>
                                <Pressable style={{marginLeft: 20}} onPress={()=>deleteAccount(item._id)}>
                                    <Icon2 name="delete" size={18} style={{color: "orange"}}></Icon2>
                                </Pressable>
                            </View>
                })
            }
                <View>
                    <Text style={{margin: 10, fontSize: 20, fontWeight: "bold"}}>Statistics of new members</Text>
                    <LineChart
                        data={{
                        labels: date,
                        datasets: [
                            {
                                data: total,
                                strokeWidth: 5 // optional
                            }
                        ]
                        }}
                        width={Dimensions.get("window").width-20} // from react-native
                        height={220}
                        yAxisInterval={1} // optional, defaults to 1
                        fromZero
                        chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "green",
                        backgroundGradientTo: "green",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "5",
                            stroke: "#ffa726"
                        }
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                            marginLeft: 10
                        }}
                    />
                </View>
            </ScrollView>
            
        </View>
    )
}

export default ManageAccount