import { View, Text, Image, StyleSheet, ScrollView, Pressable, TextInput, TouchableOpacity, Modal, Alert } from 'react-native'
import React from 'react'
import Header from '../components/header'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'
import Footer from '../components/footer';
import { Searchbar } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';

const address = "http://192.168.1.12:5000"
const Destinations = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const [destinations, setDestiantions] = useState([])
    const [filterDestinations, setFilterDestinations] = useState([])
    const [search, setSearch] = useState("")
    const [modalVisible, setModalVisible] = useState(false);

    const [district, setDistrict] = useState([])
    const [ward, setWard] = useState([])
    const [value1, setValue1] = useState(null)
    const [value2, setValue2] = useState(null)
    const [isFocus1, setIsFocus1] = useState(false)
    const [isFocus2, setIsFocus2] = useState(false)
    
    const [types, setTypes] = useState([])
    const [checked, setChecked] = useState([])

    const [services, setServices] = useState([])
    const [checked2, setChecked2] = useState([])

    const findAllDestination = function(){
        axios.get(`${address}/destinations/`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr1 = []
            var arr2 = []
            var arr3 = []
            for(var i = 0; i < res.data.destinations.length; i++){
                arr1.push(res.data.destinations[i])
            }
            for(var i = 0; i < res.data.types.length; i++){
                arr2.push(res.data.types[i])
            }
            for(var i = 0; i < res.data.services.length; i++){
                arr3.push(res.data.services[i])
            }
            setDestiantions(arr1)
            setTypes(arr2)
            setServices(arr3)
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

    const findAllAddress = function(){
        axios.get(`${address}/villages`)
          .then(function(res){
            var arr = []
            for(var i = 0; i < res.data.length; i++)
                arr.push({value: res.data[i]._id, label: res.data[i].name, wardList: res.data[i].wards})
            setDistrict(arr)
          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }

    const handleWard = function(id){
        var arr = []
        for(var i = 0; i < district.length; i++){
            if(district[i].value == id){
                for(var j = 0; j < district[i].wardList.length; j++)
                    arr.push({value: district[i].wardList[j].code, label: district[i].wardList[j].name})
                break
            }
        }
        setWard(arr)
    }

    const closeModal = function(){
        setModalVisible(!modalVisible)
        setValue1(null)
        setValue2(null)
    }

    const resetValue = function(){
        setFilterDestinations([])
        setChecked([])
        setChecked2([])
        setValue1(null)
        setValue2(null)
    }

    const filterDestination = function(){
        var req1, req2, req3, req4
        if(value1)
            req1 = value1
        else
            req1 = "0"
        if(value2)
            req2 = value2
        else
            req2 = "0"
        if(checked.length > 0)
            req3 = checked.join("&")
        else
            req3 = "0"
        if(checked2.length > 0)
            req4 = checked2.join("&")
        else
            req4 = "0"
            
        axios.get(`${address}/destinations/filter/${req1}/${req2}/${req3}/${req4}`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
        .then(function(res){

            var arr = []
            for(var i = 0; i < res.data.destinations.length; i++){
                arr.push(res.data.destinations[i])
            }
            setFilterDestinations(arr)
        })
        .catch(function(err){
            console.log("Err:", err)
        })

        setModalVisible(!modalVisible)
    }

    const handleChange = (id) => {
        const clickedCategory = checked.indexOf(id)
        const all = [...checked]
        if (clickedCategory === -1)
            all.push(id)
        else
            all.splice(clickedCategory, 1)
  
        setChecked(all)
    }

    const display = (id) => {
        const temp = [...checked]
        for(var i = 0; i < temp.length; i++)
            if(temp[i] == id)
                return true
        return false
    }

    const handleChangeService = (id) => {
        const clickedCategory = checked2.indexOf(id)
        const all = [...checked2]
        if (clickedCategory === -1)
            all.push(id)
        else
            all.splice(clickedCategory, 1)
  
        setChecked2(all)
    }

    const displayService = (id) => {
        const temp = [...checked2]
        for(var i = 0; i < temp.length; i++)
            if(temp[i] == id)
                return true
        return false
    }

    
    useEffect(()=>{
        if(search == "")
            findAllDestination()
    }, [destinations])

    useEffect(()=>{
        findAllAddress()
    }, [])

    return ( 
        <View style={{backgroundColor: "white", flex: 1}}>
            <Header navigation={navigation} route={route} reset={resetValue}/>
            <View style={{flexDirection: "row"}}>
                <TextInput
                    value={search} 
                    placeholder='Search...' 
                    style={styles.input}
                    onChangeText = {(text) => searchDestination(text)}
                >
                </TextInput>
                <Pressable
                    style={[styles.modal]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={{textAlign: "center", marginTop: 5}}><Icon name="filter" size={20} /></Text>
                </Pressable>
            </View>
            <ScrollView>
            {
                filterDestinations.length != 0 ?
                filterDestinations.map(function(item, index){
                    return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailDes",  {_id: item._id})}}>
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
                : destinations.map(function(item, index){
                    return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailDes",  {_id: item._id})}}>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                        style={{borderRadius: 20, paddingVertical: 5, width: "20%", alignSelf: "flex-end",}}
                        onPress={closeModal}>
                            <Text style={styles.textStyle}>X</Text>
                        </Pressable>
                        <View style={styles.container}>
                            <View style={{flexDirection: "row"}}>
                            <Dropdown
                                style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={district}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus1 ? 'Select district' : '...'}
                                searchPlaceholder="Search..."
                                value={value1}
                                onFocus={() => setIsFocus1(true)}
                                onBlur={() => setIsFocus1(false)}
                                onChange={item => {
                                    setValue1(item.value);
                                    setIsFocus1(false);
                                    handleWard(item.value)
                                }}
                            />
                            <Dropdown
                                style={[styles.dropdown, isFocus2 && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={ward}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus2 ? 'Select ward' : '...'}
                                searchPlaceholder="Search..."
                                value={value2}
                                onFocus={() => setIsFocus2(true)}
                                onBlur={() => setIsFocus2(false)}
                                onChange={item => {
                                    setValue2(item.value);
                                    setIsFocus2(false);
                                }}
                            />
                            </View>
                        </View>
                        <Text style={{margin: 5, fontSize: 15}}>Select types: </Text>
                        <View style={{flexDirection: "row", flexWrap: 'wrap'}}>
                            
                            {
                                types.map((item, index)=>{
                                    return  <View key={index} style={{flexDirection: "row", width: "50%"}}>
                                                <Checkbox
                                                value={display(item._id)}
                                                onValueChange={()=>{handleChange(item._id)}}
                                                color={display(item._id) ? '#4630EB' : undefined}
                                                style={{marginVertical: 5, marginHorizontal: 10, width: 20, height: 20}}
                                                />
                                                <Text style={{marginVertical: 5}}>{item.name}</Text>
                                            </View> 
                                })
                            }
                        </View>
                        <Text style={{margin: 5, fontSize: 15}}>Select services: </Text>
                        <View style={{flexDirection: "row", flexWrap: 'wrap'}}>
                            
                            {
                                services.map((item, index)=>{
                                    return  <View key={index} style={{flexDirection: "row", width: "50%"}}>
                                                <Checkbox
                                                value={displayService(item._id)}
                                                onValueChange={()=>{handleChangeService(item._id)}}
                                                color={displayService(item._id) ? '#4630EB' : undefined}
                                                style={{marginVertical: 5, marginHorizontal: 10, width: 20, height: 20}}
                                                />
                                                <Text style={{marginVertical: 5}}>{item.name}</Text>
                                            </View> 
                                })
                            }
                        </View>
                        <Pressable style={styles.button} onPress={filterDestination}>
                            <Text>Filter</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
    },
    modal:{

        backgroundColor: "lightgreen",
        marginVertical: 15,
        marginHorizontal: 0,
        height: "50%",
        width: 50,
        borderRadius: 5
    },
    centeredView: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        //padding: 85,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        height: 500
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: "20%",
        alignSelf: "flex-end",
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    modalText: {
        marginBottom: 15,
        //textAlign: 'center',
    },

    //------Modal------
    container: {
        backgroundColor: 'white',
        padding: 16,
        //justifyContent: "center",
        //flex: 1,
      },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        //marginBottom: 20,
        width: "50%",
        marginHorizontal: 1
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})

export default Destinations