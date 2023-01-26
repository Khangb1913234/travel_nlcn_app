import { View, Text, Pressable, TextInput, StyleSheet, Keyboard, ScrollView} from 'react-native'
import Header from '../components/header'
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/auth'
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';

const address = "http://192.168.1.12:5000"
const Add = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const [value, setValue] = useState("")
    const [page, setPage] = useState(route.params.addStyle)

    if(page == "destinations"){
        var [name, setName] = useState("")
        var [content, setContent] = useState("")
        var [address1, setAddress1] = useState("")
        var [operatingTime, setoperatingTime] = useState("")
        var [price, setPrice] = useState("")
        var [capacity, setCapacity] = useState("")
        var [contact, setContact] = useState("")
        var [map, setMap] = useState("")
        var [image, setImage] = useState("")
        var [types, setTypes] = useState([])
        var [checked, setChecked] = useState([])
        var [services, setServices] = useState([])
        var [checked1, setChecked1] = useState([])

        var [district, setDistrict] = useState([])
        var [ward, setWard] = useState([])
        var [value1, setValue1] = useState(null)
        var [value2, setValue2] = useState(null)
        var [isFocus1, setIsFocus1] = useState(false)
        var [isFocus2, setIsFocus2] = useState(false)

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
        const findAllService = function(){
            axios.get(`${address}/me/stored/services`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
                .then(function(res){
                    var arr1 = []
                    for(var i = 0; i < res.data.services.length; i++){
                        arr1.push(res.data.services[i])
                    }
                    setServices(arr1)
                })
                .catch(function(err){
                    console.log("Err:", err)
                })
        }

        var handleChange = (id) => {
            const clickedCategory = checked.indexOf(id)
            const all = [...checked]
            if (clickedCategory === -1)
                all.push(id)
            else
                all.splice(clickedCategory, 1)
      
            setChecked(all)
        }
    
        var display = (id) => {
            const temp = [...checked]
            for(var i = 0; i < temp.length; i++)
                if(temp[i] == id)
                    return true
            return false
        }

        var handleChangeService = (id) => {
            const clickedCategory = checked1.indexOf(id)
            const all = [...checked1]
            if (clickedCategory === -1)
                all.push(id)
            else
                all.splice(clickedCategory, 1)
      
            setChecked1(all)
        }
    
        var displayService = (id) => {
            const temp = [...checked1]
            for(var i = 0; i < temp.length; i++)
                if(temp[i] == id)
                    return true
            return false
        }

        var findAllAddress = function(){
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
    
        var handleWard = function(id){
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

        useEffect(()=>{
            findAllType()
        }, [])
        useEffect(()=>{
            findAllService()
        }, [])
        useEffect(()=>{
            findAllAddress()
        }, [])
    }
    else if(page == "tours"){
        var [title, setTitle] = useState("")
        var [content, setContent] = useState("")
        var [time, setTime] = useState("")
        var [price, setPrice] = useState("")
        var [contact, setContact] = useState("")
        var [image, setImage] = useState("")
        var [destinations, setDestinations] = useState([])
        var [checked, setChecked] = useState([])

        const findAllDestination = function(){
            axios.get(`${address}/destinations/all`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
                .then(function(res){ 
                    var arr1 = []
                    for(var i = 0; i < res.data.destination.length; i++){
                        arr1.push(res.data.destination[i])
                    }
                    setDestinations(arr1)
                })
                .catch(function(err){
                    console.log("Err1:", err)
                })
        }
        var handleChange = (id) => {
            const clickedCategory = checked.indexOf(id)
            const all = [...checked]
            if (clickedCategory === -1)
                all.push(id)
            else
                all.splice(clickedCategory, 1)
      
            setChecked(all)
        }
    
        var display = (id) => {
            const temp = [...checked]
            for(var i = 0; i < temp.length; i++)
                if(temp[i] == id)
                    return true
            return false
        }


        useEffect(()=>{
            findAllDestination()
        }, [])
    }

    const create = function(){
        if(value.length == 0 && page != "destinations" && page != "tours"){
            alert("Please enter...")
            return false
        }
        if(page != "destinations" && page != "tours"){
            axios.post(`${address}/${route.params.addStyle}/create`, {
                name: value.trim()
            }, {
                headers: {Authorization: `Bearer ${userToken.token}`},
            })
                .then(function(res){
                    //console.log(res.data.msg)
                    if(route.params.addStyle == "types")
                        navigation.navigate("manageType")
                    else if(route.params.addStyle == "services")
                        navigation.navigate("manageService")
                })
                .catch(function(err){
                    console.log("Err:", err)
            })
            setValue("")
            Keyboard.dismiss()
        }
        else if(page == "destinations"){
            axios.post(`${address}/destinations/create`, {
                name: name, 
                content: content, 
                address: address1,
                districtId: value1,
                wardCode: value2,
                operatingTime: operatingTime,
                contact: contact,
                price: price,
                capacity: capacity,
                map: map,
                types: checked,
                services: checked1,
                image: image
            }, {
                headers: {Authorization: `Bearer ${userToken.token}`},
            })
                .then(function(res){
                    navigation.navigate("manageDestination")
                })
                .catch(function(err){
                    console.log("Err:", err)
            })
            setValue("")
            Keyboard.dismiss()
        }
        else if(page == "tours"){
            axios.post(`${address}/tours/create`, {
                title: title, 
                content: content, 
                time: time,
                contact: contact,
                price: price,
                image: image,
                destinations: checked,
            }, {
                headers: {Authorization: `Bearer ${userToken.token}`},
            })
                .then(function(res){
                    navigation.navigate("manageTour")
                })
                .catch(function(err){
                    console.log("Err:", err)
            })
            setValue("")
            Keyboard.dismiss()
        }
    }
    return (
        
        <View style={{alignItems: "center", backgroundColor: "#fff", flex: 1}}>
            <Header navigation={navigation} route={route} />
            {
            page == "types" ? 
                <View>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>Create Type</Text>
                </View>
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{marginBottom: 10}}>Name</Text>
                    <TextInput
                        value={value} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setValue(text)}
                    >
                    </TextInput>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={create} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                </View>
                </View>
                : page == "services" ? 
                <View>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>Create Service</Text>
                </View>
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{marginBottom: 10}}>Name</Text>
                    <TextInput
                        value={value} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setValue(text)}
                    >
                    </TextInput>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={create} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                </View>
                </View>
                : page == "destinations" ?
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>Create Destination</Text>
                </View>
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{marginVertical: 10}}>Name</Text>
                    <TextInput
                        value={name} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setName(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Content</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        value={content} 
                        placeholder='Enter...' 
                        style={styles.inputArea}
                        onChangeText = {(text) => setContent(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Address</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        value={address1} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setAddress1(text)}
                    >
                    </TextInput>
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
                    <Text style={{marginVertical: 10}}>Operating Time</Text>
                    <TextInput
                        value={operatingTime} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setoperatingTime(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Price</Text>
                    <TextInput
                        value={price} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setPrice(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Capacity</Text>
                    <TextInput
                        value={capacity} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setCapacity(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Contact</Text>
                    <TextInput
                        value={contact} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setContact(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Google map</Text>
                    <TextInput
                        value={map} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setMap(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Type </Text>
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
                    <Text style={{marginVertical: 10}}>Service </Text>
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
                    <Text style={{marginVertical: 10}}>Image</Text>
                    <TextInput
                        value={image} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setImage(text)}
                    >
                    </TextInput>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={create} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                </View>
                </ScrollView>
                : page == "tours" ? 
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>Create Tour</Text>
                </View>
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{marginVertical: 10}}>Title</Text>
                    <TextInput
                        value={title} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setTitle(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Content</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        value={content} 
                        placeholder='Enter...' 
                        style={styles.inputArea}
                        onChangeText = {(text) => setContent(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Time</Text>
                    <TextInput
                        value={time} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setTime(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Price</Text>
                    <TextInput
                        value={price.toString()} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setPrice(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Contact</Text>
                    <TextInput
                        value={contact} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setContact(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10}}>Destination </Text>
                    <View style={{}}>
                        {
                            destinations.map((item, index)=>{
                                return  <View key={index} style={{flexDirection: "row", width: "100%"}}>
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
                    <Text style={{marginVertical: 10}}>Image</Text>
                    <TextInput
                        value={image} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setImage(text)}
                    >
                    </TextInput>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={create} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                </View>
                </ScrollView>
                : <Text>abc</Text>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 44,
        width: 300,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#21a3d0",
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    inputArea: {
        height: 100,
        width: 300,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#21a3d0",
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    btn: {
        backgroundColor: "lightblue", 
        padding: 10, 
        width: 75, 
        borderRadius: 5, 
        marginVertical: 10,
        
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



export default Add