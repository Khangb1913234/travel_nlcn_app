import { View, Text, StyleSheet, Linking, ScrollView, Pressable, Modal, Alert, Keyboard} from 'react-native'
import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import axios from 'axios';
import Header from '../components/header';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { Card, TextInput } from 'react-native-paper';
import { WebView } from 'react-native-webview'; 
import Swiper from 'react-native-swiper';

// const address = "http://192.168.1.12:5000"
const DetailTour = ({navigation, route}) => {
  const {userToken} = useContext(AuthContext)
  const {address} = useContext(AuthContext)
  const [tour, setTour] = useState({})
  const [destinations, setDestinations] = useState([])
  const [similarTour, setSimilarTour] = useState([])

  const [image, setImage] = useState([])
  const [link, setLink] = useState("")
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = function(){
    setModalVisible(!modalVisible)
  }

  const findOneTour = function(){
    axios.get(`${address}/tours/${route.params._id}`, {
      headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
    })
    .then(function(res){
      var tempPrice
      var temp = res.data.tour.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      res.data.tour.price = temp
      setTour(res.data.tour)
      var arr1 = []
      var arr2 = []
      for(var i = 0; i < res.data.destinations.length; i++){
        arr1.push(res.data.destinations[i])
      }
      for(var i = 0; i < res.data.tourSimilar.length; i++){
        tempPrice = res.data.tourSimilar[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        res.data.tourSimilar[i].price = tempPrice
        arr2.push(res.data.tourSimilar[i])
      }

      setDestinations(arr1)
      setSimilarTour(arr2)
    })
    .catch(function(err){
      console.log("Err:", err)
    })
  }

  const findImage = function(){
    axios.get(`${address}/tours/${route.params._id}`, {
      headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
    })
    .then(function(res){
      var arrImage = res.data.tour.image.split(",")
      for(var i = 0; i < arrImage.length; i++)
          arrImage[i] = `${address}${arrImage[i]}`
      setImage(arrImage)
    })
    .catch(function(err){
      console.log("Err:", err)
    })
  }

  // const bookTour = function(){
  //   axios.post(`${address}/tours/book`, 
  //   {
  //     price: tour.price
  //   }, 
  //   {
  //     headers: {Authorization: `Bearer ${userToken.token}`},
  //   })
  //   .then(function(res){
  //     // Linking.openURL(res.data.link)
  //     setLink(res.data.link)
  //     setModalVisible(true)
  //   })
  //   .catch(function(err){
  //     console.log("Err:", err)
  //   })
  // }

  // const checkStatus = function(){
  //   if(link.length > 0){
  //     let price = Math.floor(tour.price / 23000.0, 2)
  //     axios.get(`${address}/tours/book/execute/${price}`)
  //   }
  // }

  // const executePayment = function(){
  //   axios.post(`${address}/tours/execute`, 
  //   {
  //     price: tour.price
  //   }, 
  //   {
  //     headers: {Authorization: `Bearer ${userToken.token}`},
  //   })
  //   .then(res => res.json())
  //   .then(payment => {
  //     console.log(payment)
  //   })
  //   .catch(function(err){
  //     console.log("Err:", err)
  //   })
  // }

  useEffect(()=>{
    findOneTour()
  }, [tour])

  useEffect(()=>{
    findImage()
  }, [])


  // console.log(link.length)

  // useEffect(()=>{
  //   bookTour()
  // }, [])
  return (
    <View style={{backgroundColor: "#fff", flex: 1}}>
      <Header navigation={navigation} route={route}/>
      <ScrollView>
      <View style={{alignItems: 'center', marginVertical: 10}}>
        <Text style={{fontWeight: "bold", fontSize: 20, marginVertical: 10}}>{tour.title}</Text>
        {/* <Image style={{width: "90%", height: 300}} source={{uri: `${address}${tour.image}`}}/> */}
      </View>
      <View>
        <Swiper showsButtons={false} autoplay={false} style={{height: 400}}>
          {image.map((item, i) => (
            <View key={i} style={{alignItems: "center"}}>
              <Image key={i} style={{width: "100%", height: 300}} source={{uri: item}}/>
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.content}>
        <Text style={{paddingVertical: 7, fontSize: 15, fontWeight: "bold"}}>Destinations: </Text>
        {
          destinations.map((item, index)=>{
            return  <Pressable key={index} style={styles.content2} onPress={()=>{navigation.navigate("detailDes", {_id: item._id})}}>
                      <Text style={{color: "#FF9900", fontWeight: "bold"}}>{item.name}</Text>
                    </Pressable>
                    
          })
        }
      </View>
      <View style={styles.content}>
        <Icon name = "clock-o" size={20} />
        <Text style={{paddingHorizontal: 5}}>{tour.time}</Text>
      </View>
      <View style={styles.content}>
        <Icon name = "money" size={20} />
        <Text style={{paddingHorizontal: 5}}>{tour.price + " VND"}</Text>
      </View>
      <View style={styles.content}>
        <Icon2 name = "web" size={20} />
        <Text 
          style={{paddingHorizontal: 5, color: "orange"}}
          onPress={() => Linking.openURL(tour.contact)}
        >
          {tour.contact} 
        </Text>
      </View>
      {/* <Pressable 
        style={{marginVertical: 10, width: 70, height: 40, backgroundColor: "green", justifyContent: "center", borderRadius: 5, }}
        onPress={bookTour}
      >
        <Text style={{textAlign: "center", color: "#fff"}}>Book</Text>
      </Pressable> */}
      <View style={styles.content}>
        <Text style={{paddingHorizontal: 5, lineHeight: 25}}>{tour.content}</Text>
      </View>
      <View renderToHardwareTextureAndroid={true} style={styles.content}>
      </View>
      <View style={{}}>
        <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>Similar Tours</Text>
        {
          userToken.token ?
          similarTour.map((item, index)=>{
            return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailTour",  {_id: item._id})}}>
                    <Card style={{height: 400, width: "90%", marginVertical: 20}}>
                      <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                      <View style={{flexDirection: "row", padding: 5}}>                                    
                          <Text style={styles.paragraph}>{item.title}</Text>
                      </View>
                      <View>
                      <Swiper showsButtons={false} autoplay={false} style={{height: 400}}>
                        {image.map((item, i) => (
                          <View key={i} style={{alignItems: "center"}}>
                            <Image key={i} style={{width: "100%", height: 300}} source={{uri: item}}/>
                          </View>
                        ))}
                      </Swiper>
                    </View>
                    <Text style={{padding: 20, fontSize: 20, color: "red", fontWeight: "bold"}}>{item.price + " VND"}</Text>
                    </Card>
                    </Pressable>
          })
          : <Text style={{textAlign: "center", fontSize: 20, fontStyle: "italic", marginBottom: 10}}>(Please login to view)</Text>
        }
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        Alert.alert('The transaction has been canceled.');
        setModalVisible(!modalVisible);
    }}>
        <WebView source={{uri: link}} />
      </Modal>
      </ScrollView>
    </View>
    
  )
}

const styles = StyleSheet.create({
  content: {
    marginVertical: 5, 
    marginHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start"

  },
  content2: {
    backgroundColor: "lightblue", 
    margin: 2,
    padding: 5, 
    borderRadius: 10,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    color: "#25a5be",
  },
  rating: {
    marginVertical: 10, 
    marginHorizontal: 10,
    flexWrap: "wrap",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 5

  },
  point: {
    marginVertical: 10,
    alignContent: "center",
    backgroundColor: "green",
    borderRadius: 44,
    width: 44,
    height: 44,
    marginHorizontal: 5
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
      height: 400
  },
  button: {
      borderRadius: 5,
      padding: 10,
      //elevation: 2,
      width: "20%",
      alignSelf: "flex-end",
      backgroundColor: "lightblue",
      marginHorizontal: 25,
      marginVertical: 20
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
  inputArea: {
    height: 100,
    width: 300,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#21a3d0",
    //borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 20,
    marginTop: 10
},
})
export default DetailTour