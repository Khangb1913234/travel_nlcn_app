import { View, Text, Pressable, TextInput, StyleSheet, Keyboard, ScrollView} from 'react-native'
import Header from '../components/header'
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/auth'
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native'

// const address = "http://192.168.1.12:5000"
const Add = ({navigation, route}) => {
    const go = useNavigation()
    const {userToken} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    const [value, setValue] = useState("")
    const [page, setPage] = useState(route.params.addStyle)
    const [fileType, setFileType] = useState(null)
    const [fileService, setFileService] = useState(null)
    const [fileDes, setFileDes] = useState(null)
    const [fileTour, setFileTour] = useState(null)

    if(page == "destinations"){
        var [name, setName] = useState("")
        var [content, setContent] = useState("")
        var [address1, setAddress1] = useState("")
        var [operatingTime, setoperatingTime] = useState("")
        var [price, setPrice] = useState("")
        var [capacity, setCapacity] = useState("")
        var [contact, setContact] = useState("")
        var [map, setMap] = useState("")
        var [types, setTypes] = useState([])
        var [checked, setChecked] = useState([])
        var [services, setServices] = useState([])
        var [checked1, setChecked1] = useState([])
        var [image, setImage] = useState([])
        var [district, setDistrict] = useState([])
        var [ward, setWard] = useState([])
        var [value1, setValue1] = useState(null)
        var [value2, setValue2] = useState(null)
        var [isFocus1, setIsFocus1] = useState(false)
        var [isFocus2, setIsFocus2] = useState(false)

        var [number, setNumber] = useState(0)

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
        var [image, setImage] = useState([])
        var [destinations, setDestinations] = useState([])
        var [checked, setChecked] = useState([])
        var [number, setNumber] = useState(0)

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
    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          //allowsEditing: true,
          aspect: [4, 6],
          quality: 1,
          allowsMultipleSelection: true
        });
    
        //console.log(result);
    
        if (!result.canceled) {
          var arr = []
          var random =  Math.floor(Math.random() * 1000)
          for(var i = 0; i < Object.keys(result.assets).length; i++){
              var temp = {
                uri: result.assets[i].uri,
                name: 'SomeImageName' + i + random + ".jpg",
                type: 'image/jpg',
              }
              arr.push(temp)
          }
          setImage(arr)
          setNumber(arr.length)
        }
    };

    const pickFile = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        if (result.type === 'success') {
            console.log(
                `URI: ${result.uri}\n` +
                `Type: ${result.type}\n` +
                `Name: ${result.name}\n` +
                `Size: ${result.size}\n`
            );
            if(route.params.addStyle == "types")
                setFileType(result)
            else if(route.params.addStyle == "services")
                setFileService(result)
            else if(route.params.addStyle == "destinations")
                setFileDes(result)
            else if(route.params.addStyle == "tours")
                setFileTour(result)
        } 
        else if (result.type === 'cancel') {
            console.log('User cancelled the file picker.');
        }
    };

    const createDes = async function(){
        try {
            console.log(image)
            const data = new FormData();
            for(var i = 0; i < image.length; i++)
              data.append("image", image[i]);
            data.append("name", name)
            data.append("content", content)
            data.append("address", address1)
            data.append("districtId", value1)
            data.append("wardCode", value2)
            data.append("operatingTime", operatingTime)
            data.append("contact", contact)
            data.append("price", price)
            data.append("capacity", capacity)
            data.append("map", map)
            data.append("types", checked)
            data.append("services", checked1)
            await fetch(`${address}/destinations/create`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken.token}`,
              },
              body: data,
            });
            axios.get(`${address}/me/stored/destinations`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
            .then(function(res){
            var arr1 = []
            for(var i = 0; i < res.data.destinations.length; i++){
                arr1.push(res.data.destinations[i])
            }
                route.params.rerender(arr1)
            })
            .catch(function(err){
                console.log("Err:", err)
            })

            navigation.navigate("manageDestination")
        } catch (error) {
            console.log(error);
        }
    }
    const createTour = async function(){
        try {
            console.log(image)
            const data = new FormData();
            for(var i = 0; i < image.length; i++)
              data.append("image", image[i]);
            data.append("title", title)
            data.append("content", content)
            data.append("time", time)
            data.append("contact", contact)
            data.append("price", price)
            data.append("destinations", checked)
            await fetch(`${address}/tours/create`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken.token}`,
              },
              body: data,
            });
            axios.get(`${address}/me/stored/tours`, {
                headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
            })
            .then(function(res){
                var arr1 = []
                for(var i = 0; i < res.data.tours.length; i++){
                    arr1.push(res.data.tours[i])
                }
                route.params.rerender(arr1)
            })
            .catch(function(err){
                console.log("Err:", err)
            })
            
            navigation.navigate("manageTour")
        } catch (error) {
            console.log(error);
        }
    }
    const create = function(){
        if(value.length == 0){
            alert("Please enter...")
            return false
        }
        axios.post(`${address}/${route.params.addStyle}/create`, {
            name: value.trim()
        }, {
            headers: {Authorization: `Bearer ${userToken.token}`},
        })
            .then(function(res){
                //console.log(res.data.msg)
                if(route.params.addStyle == "types"){
                    axios.get(`${address}/me/stored/types`, {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                    })
                    .then(function(res){
                        var arr1 = []
                        for(var i = 0; i < res.data.types.length; i++){
                            arr1.push(res.data.types[i])
                        }
                        route.params.rerender(arr1)
                    })
                    .catch(function(err){
                        console.log("Err:", err)
                    })
                    navigation.navigate("manageType")
                }
                    
                else if(route.params.addStyle == "services"){
                    axios.get(`${address}/me/stored/services`, {
                        headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
                    })
                      .then(function(res){
                        var arr1 = []
                        for(var i = 0; i < res.data.services.length; i++){
                            arr1.push(res.data.services[i])
                        }
                        route.params.rerender(arr1)
                      })
                      .catch(function(err){
                        console.log("Err:", err)
                      })
                      navigation.navigate("manageService")
                }
                    
            })
            .catch(function(err){
                console.log("Err:", err)
        })
        setValue("")
        Keyboard.dismiss()
    }
    const createWithFile = async () => {
        if(route.params.addStyle == "types"){
            const formData = new FormData();
            formData.append('file', {
            uri: fileType.uri,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            name: fileType.name,
            });
        
            const response = await fetch(`${address}/types/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken.token}`,
            },
            body: formData,
            });
        
            navigation.navigate("manageType")
        }
        else if(route.params.addStyle == "services"){
            const formData = new FormData();
            formData.append('file', {
            uri: fileService.uri,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            name: fileService.name,
            });
        
            const response = await fetch(`${address}/services/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken.token}`,
            },
            body: formData,
            });
        
            navigation.navigate("manageService")
        }
        else if(route.params.addStyle == "destinations"){
            const formData = new FormData();
            formData.append('file', {
            uri: fileDes.uri,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            name: fileDes.name,
            });
            formData.append("excel", "yes")
        
            const response = await fetch(`${address}/destinations/create/excel`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken.token}`,
            },
            body: formData,
            });
        
            navigation.navigate("manageDestination")
        }
        else if(route.params.addStyle == "tours"){
            const formData = new FormData();
            formData.append('file', {
            uri: fileTour.uri,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            name: fileTour.name,
            });
            formData.append("excel", "yes")
        
            const response = await fetch(`${address}/tours/create/excel`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken.token}`,
            },
            body: formData,
            });
        
            navigation.navigate("manageTour")
        }
    };
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
                        <Text style={{marginBottom: 10, fontSize: 15, fontWeight: "bold"}}>Name</Text>
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
                        <View style={{marginTop: 10, flexDirection: "row"}}>
                            <Text style={{fontSize: 15, fontWeight: "bold"}}>Or upload with File</Text>
                            <Text 
                                style={{marginLeft: 5, fontSize: 15, color: "orange"}} 
                                onPress={() => Linking.openURL('https://docs.google.com/spreadsheets/d/1cL5OHRTcJeASlZVX3LKYGVoLX67IXeIW/edit?usp=sharing&amp;ouid=114759917748435653610&amp;rtpof=true&amp;sd=true')}>
                                Download sample file
                            </Text>
                        </View>
                        <Pressable style={{marginTop: 10, padding: 10, backgroundColor: "lightgray", width: 70, flexDirection: "row", borderRadius: 5}} onPress={pickFile}>
                            <Text>Browse</Text>
                            <Text style={{marginLeft: 20, width: 300}}>{fileType ? `${fileType.name}` : ""}</Text>
                        </Pressable>
                        <View style={{alignItems: 'flex-end'}}>
                        <Pressable onPress={createWithFile} style={styles.btn}>
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
                    <Text style={{marginBottom: 10, fontSize: 15, fontWeight: "bold"}}>Name</Text>
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
                    <View style={{marginTop: 10, flexDirection: "row"}}>
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>Or upload with File</Text>
                        <Text 
                            style={{marginLeft: 5, fontSize: 15, color: "orange"}} 
                            onPress={() => Linking.openURL('https://docs.google.com/spreadsheets/d/1cL5OHRTcJeASlZVX3LKYGVoLX67IXeIW/edit?usp=sharing&amp;ouid=114759917748435653610&amp;rtpof=true&amp;sd=true')}>
                            Download sample file
                        </Text>
                    </View>
                    <Pressable style={{marginTop: 10, padding: 10, backgroundColor: "lightgray", width: 70, flexDirection: "row", borderRadius: 5}} onPress={pickFile}>
                        <Text>Browse</Text>
                        <Text style={{marginLeft: 20, width: 300}}>{fileService ? `${fileService.name}` : ""}</Text>
                    </Pressable>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={createWithFile} style={styles.btn}>
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
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Name</Text>
                    <TextInput
                        value={name} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setName(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Content</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        value={content} 
                        placeholder='Enter...' 
                        style={styles.inputArea}
                        onChangeText = {(text) => setContent(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Address</Text>
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
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Operating Time</Text>
                    <TextInput
                        value={operatingTime} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setoperatingTime(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Price</Text>
                    <TextInput
                        value={price} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setPrice(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Capacity</Text>
                    <TextInput
                        value={capacity} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setCapacity(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Contact</Text>
                    <TextInput
                        value={contact} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setContact(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Google map</Text>
                    <TextInput
                        value={map} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setMap(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Type </Text>
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
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Service </Text>
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
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Image</Text>
                    <Pressable style={{padding: 10, backgroundColor: "lightgray", width: 70, flexDirection: "row", borderRadius: 5}} onPress={pickImage}>
                        <Text>Browse</Text>
                        <Text style={{marginLeft: 20, width: 300}}>{number > 0 ? `Number of files selected: ${number}` : ""}</Text>
                    </Pressable>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={createDes} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                    <View style={{marginTop: 10, flexDirection: "row"}}>
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>Or upload with File</Text>
                        <Text 
                            style={{marginLeft: 5, fontSize: 15, color: "orange"}} 
                            onPress={() => Linking.openURL('https://docs.google.com/spreadsheets/d/1-iAZe1aB-tqTvtigK80pGowue84P8O2S/edit?usp=sharing&amp;ouid=114759917748435653610&amp;rtpof=true&amp;sd=true')}>
                            Download sample file
                        </Text>
                    </View>
                    <Pressable style={{marginTop: 10, padding: 10, backgroundColor: "lightgray", width: 70, flexDirection: "row", borderRadius: 5}} onPress={pickFile}>
                        <Text>Browse</Text>
                        <Text style={{marginLeft: 20, width: 300}}>{fileDes ? `${fileDes.name}` : ""}</Text>
                    </Pressable>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={createWithFile} style={styles.btn}>
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
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Title</Text>
                    <TextInput
                        value={title} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setTitle(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Content</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        value={content} 
                        placeholder='Enter...' 
                        style={styles.inputArea}
                        onChangeText = {(text) => setContent(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Time</Text>
                    <TextInput
                        value={time} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setTime(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10,fontSize: 15, fontWeight: "bold"}}>Price</Text>
                    <TextInput
                        value={price.toString()} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setPrice(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Contact</Text>
                    <TextInput
                        value={contact} 
                        placeholder='Enter...' 
                        style={styles.input}
                        onChangeText = {(text) => setContact(text)}
                    >
                    </TextInput>
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Destination </Text>
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
                    <Text style={{marginVertical: 10, fontSize: 15, fontWeight: "bold"}}>Image</Text>
                    <Pressable style={{padding: 10, backgroundColor: "lightgray", width: 70, flexDirection: "row", borderRadius: 5}} onPress={pickImage}>
                        <Text>Browse</Text>
                        <Text style={{marginLeft: 20, width: 300}}>{number > 0 ? `Number of files selected: ${number}` : ""}</Text>
                    </Pressable>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={createTour} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                    <View style={{marginTop: 10, flexDirection: "row"}}>
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>Or upload with File</Text>
                        <Text 
                            style={{marginLeft: 5, fontSize: 15, color: "orange"}} 
                            onPress={() => Linking.openURL('https://docs.google.com/spreadsheets/d/1-rpCYteyRQER0GdJtAZ0dSNT8iCIzYxW/edit?usp=sharing&amp;ouid=114759917748435653610&amp;rtpof=true&amp;sd=true')}>
                            Download sample file
                        </Text>
                    </View>
                    <Pressable style={{marginTop: 10, padding: 10, backgroundColor: "lightgray", width: 70, flexDirection: "row", borderRadius: 5}} onPress={pickFile}>
                        <Text>Browse</Text>
                        <Text style={{marginLeft: 20, width: 300}}>{fileDes ? `${fileDes.name}` : ""}</Text>
                    </Pressable>
                    <View style={{alignItems: 'flex-end'}}>
                    <Pressable onPress={createWithFile} style={styles.btn}>
                        <Text style={{color: "#000", textAlign: "center"}}>Create</Text>
                    </Pressable>
                    </View>
                </View>
                </ScrollView>
                : <Text>Not found</Text>
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