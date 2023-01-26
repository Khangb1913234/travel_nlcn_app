import { View, Text, Image, StyleSheet, ScrollView, Pressable, TextInput, Modal} from 'react-native'
import React from 'react'
import Header from '../components/header'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';

const address = "http://192.168.1.12:5000"
const Tours = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const [tours, setTours] = useState([])

    const [filterTours, setFilterTours] = useState([])
    const [search, setSearch] = useState("")
    const [modalVisible, setModalVisible] = useState(false);

    const [destinations, setDestinations] = useState([])
    const [checked, setChecked] = useState([])
    
    const prices = [
        {
            _id: 1,
            price: "< 500.000" 
        },
        {
            _id: 2,
            price: "500.000 - 1.000.000" 
        },
        {
            _id: 3,
            price: "> 1.000.000" 
        }
    ]

    const [checked2, setChecked2] = useState([])

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

    const searchTour = function(search){
        if(search){
            setSearch(search)
            axios.get(`${address}/destinations/search/${search}`, {
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
        else{
            setSearch("")
            findAllTour()
        }
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

    const handleChangePrice = (id) => {
        const clickedCategory = checked2.indexOf(id)
        const all = [...checked2]
        if (clickedCategory === -1)
            all.push(id)
        else
            all.splice(clickedCategory, 1)
  
        setChecked2(all)
    }

    const displayPrice = (id) => {
        const temp = [...checked2]
        for(var i = 0; i < temp.length; i++)
            if(temp[i] == id)
                return true
        return false
    }

    const filterTour = function(){
        var req1, req2
        if(checked.length > 0)
            req1 = checked.join("&")
        else
            req1 = "0"
        if(checked2.length > 0)
            req2 = checked2.join("&")
        else
            req2 = "0"
            
        axios.get(`${address}/tours/filter/${req1}/${req2}`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
        .then(function(res){

            var arr = []
            for(var i = 0; i < res.data.tours.length; i++){
                arr.push(res.data.tours[i])
            }
            setFilterTours(arr)
        })
        .catch(function(err){
            console.log("Err:", err)
        })

        setModalVisible(!modalVisible)
    }
    const findAllDestination = function(){
        axios.get(`${address}/destinations/all`,  {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr = []
            for(var i = 0; i < res.data.destination.length; i++)
                arr.push(res.data.destination[i])
            setDestinations(arr)

          })
          .catch(function(err){
            console.log("Err:", err)
          })
    }
    const closeModal = function(){
        setModalVisible(!modalVisible)
    }
    const resetValue = function(){
        setFilterTours([])
        setChecked([])
        setChecked2([])
    }

   //console.log(checked2)

    useEffect(()=>{
        if(search == "")
            findAllTour()
    }, [tours])

    useEffect(()=>{
        findAllDestination()
    }, [])
    return ( 
        <View style={{backgroundColor: "white", flex: 1}}>
            <Header navigation={navigation} route={route} reset={resetValue}/>
            <View style={{flexDirection: "row"}}>
                <TextInput
                    value={search} 
                    placeholder='Search...' 
                    style={styles.input}
                    onChangeText = {(text) => searchTour(text)}
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
                filterTours.length != 0 ?
                filterTours.map(function(item, index){
                    return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailTour",  {_id: item._id})}}>
                                <Card style={{height: 500, width: "90%", marginVertical: 20}}>
                                    <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                                    <View style={{flexDirection: "row"}}>                                    
                                        <Text style={styles.paragraph}>{item.title}</Text>
                                    </View>
                                    <Text style={{paddingHorizontal: 20}}>{item.time}</Text>
                                    <Text style={{padding: 20, fontSize: 20, color: "red", fontWeight: "bold"}}>{item.price + " VND"}</Text>
                                </Card>
                            </Pressable>
                            
                })
                :tours.map(function(item, index){
                    return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailTour",  {_id: item._id})}}>
                                <Card style={{height: 500, width: "90%", marginVertical: 20}}>
                                    <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                                    <View style={{flexDirection: "row"}}>                                    
                                        <Text style={styles.paragraph}>{item.title}</Text>
                                    </View>
                                    <Text style={{paddingHorizontal: 20}}>{item.time}</Text>
                                    <Text style={{padding: 20, fontSize: 20, color: "red", fontWeight: "bold"}}>{item.price + " VND"}</Text>
                                </Card>
                            </Pressable>
                })
            }
            </ScrollView>
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
                        <Text style={{margin: 5, fontSize: 15}}>Select destinations: </Text>
                        <View style={{flexDirection: "row", flexWrap: 'wrap'}}>
                            
                            {
                                destinations.map((item, index)=>{
                                    return  <View key={index} style={{flexDirection: "row", width: "50%"}}>
                                                <Checkbox
                                                value={display(item._id)}
                                                onValueChange={()=>{handleChange(item._id)}}
                                                color={display(item._id) ? '#4630EB' : undefined}
                                                style={{marginVertical: 5, marginHorizontal: 10, width: 20, height: 20}}
                                                />
                                                <Text style={{marginVertical: 5, width: "80%"}}>{item.name}</Text>
                                            </View> 
                                })
                            }
                        </View>
                        <Text style={{margin: 5, fontSize: 15}}>Select price: </Text>
                        <View style={{flexDirection: "row", flexWrap: 'wrap'}}>
                            {
                                prices.map((item, index)=>{
                                    return  <View key={index} style={{flexDirection: "row", width: "50%"}}>
                                                <Checkbox
                                                value={displayPrice(item._id)}
                                                onValueChange={()=>{handleChangePrice(item._id)}}
                                                color={displayPrice(item._id) ? '#4630EB' : undefined}
                                                style={{marginVertical: 5, marginHorizontal: 10, width: 20, height: 20}}
                                                />
                                                <Text style={{marginVertical: 5}}>{item.price}</Text>
                                            </View> 
                                })
                            }
                        </View>
                        <Pressable style={styles.button} onPress={filterTour}>
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

export default Tours