import { View, Text, StyleSheet, Linking, ScrollView, Pressable, Modal, Alert, Keyboard, Dimensions } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import axios from 'axios';
import Header from '../components/header';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import { Card, TextInput } from 'react-native-paper';
import { WebView } from 'react-native-webview'; 
import { Rating, AirbnbRating } from 'react-native-ratings';
import { SliderBox } from 'react-native-image-slider-box';
import Swiper from 'react-native-swiper';

// const address = "http://192.168.1.12:5000"
const DetailDestination = ({navigation, route}) => {
  const {userToken} = useContext(AuthContext)
  const {address} = useContext(AuthContext)
  const {updateSymbol} = useContext(AuthContext)
  const [destination, setDestination] = useState({})
  const [types, setTypes] = useState([])
  const [services, setServices] = useState([])
  const [tours, setTours] = useState([])
  const [similarDestination, setSimilarDestination] = useState([])
  const [nearbyDestination, setNearbyDestination] = useState([])
  const [rating, setRating] = useState([])
  const [totalRate, setTotalRate] = useState({})
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState([])
  const [alertRating, setAlertRating] = useState("")

  const [review, setReview] = useState("")
  const [star, setStar] = useState("0")

  // const [symbol, setSymbol] = useState(userToken.account)
  const findOneDestination = function(){
    axios.get(`${address}/destinations/${route.params._id}`, {
      headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
    })
    .then(function(res){
      setDestination(res.data.destinations)
      var arr1 = []
      var arr2 = []
      var arr3 = []
      var arr4 = []
      var arr5 = []
      var arr6 = []
      for(var i = 0; i < res.data.types.length; i++){
        arr1.push(res.data.types[i])
      }
      for(var i = 0; i < res.data.services.length; i++){
        arr2.push(res.data.services[i])
      }
      for(var i = 0; i < res.data.tours.length; i++){
        arr3.push(res.data.tours[i])
      }
      for(var i = 0; i < res.data.destinationSimilar.length; i++){
        if(res.data.destinationSimilar[i].image.indexOf(",") != -1)
            res.data.destinationSimilar[i].image = res.data.destinationSimilar[i].image.slice(0, res.data.destinationSimilar[i].image.indexOf(","))
        arr4.push(res.data.destinationSimilar[i])
      }
      for(var i = 0; i < res.data.destinationNearby.length; i++){
        if(res.data.destinationNearby[i].image.indexOf(",") != -1)
            res.data.destinationNearby[i].image = res.data.destinationNearby[i].image.slice(0, res.data.destinationNearby[i].image.indexOf(","))
        arr5.push(res.data.destinationNearby[i])
      }
      for(var i = 0; i < res.data.rating.length; i++){
        arr6.push(res.data.rating[i])
      }
      
      setTypes(arr1)
      setServices(arr2)
      setTours(arr3)
      setSimilarDestination(arr4)
      setNearbyDestination(arr5)
      setRating(arr6)
      setTotalRate(res.data.rate)
    })
    .catch(function(err){
      console.log("Err:", err)
    })
  }
  const findImage = function(){
    axios.get(`${address}/destinations/${route.params._id}`, {
      headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
    })
    .then(function(res){
      var arrImage = res.data.destinations.image.split(",")
      for(var i = 0; i < arrImage.length; i++)
          arrImage[i] = `${address}${arrImage[i]}`
      setImage(arrImage)
    })
    .catch(function(err){
      console.log("Err:", err)
    })
  }
  const createRating = function(){
    if(star != 0){
      setAlertRating("")
      axios.post(`${address}/rating/create`, {
        destinationId: destination._id,
        content: review,
        rate: star,
      }, {
          headers: {Authorization: `Bearer ${userToken.token}`},
      })
          .then(function(res){
              closeModal()
              navigation.navigate("detailDes", {_id: route.params._id})
          })
          .catch(function(err){
              console.log("Err:", err)
      })
      setReview("")
      Keyboard.dismiss()
    }
    else{
      setAlertRating("Please select the number of stars")
      Keyboard.dismiss()
    }
  }

  const createFavorite = function(){
    axios.put(`${address}/destinations/save/${destination._id}`, {
      destinationId: destination._id,
    }, {
        headers: {Authorization: `Bearer ${userToken.token}`},
    })
        .then(function(res){
            updateSymbol()
            navigation.navigate("detailDes", {_id: route.params._id})
        })
        .catch(function(err){
            console.log("Err:", err)
    })
    console.log("save")
    setReview("")
    Keyboard.dismiss()
  }

  const deleteFavorite = function(){
    axios.put(`${address}/destinations/unsave/${destination._id}`, {
      destinationId: destination._id,
    }, {
        headers: {Authorization: `Bearer ${userToken.token}`},
    })
        .then(function(res){
            updateSymbol()
            navigation.navigate("detailDes", {_id: route.params._id})
        })
        .catch(function(err){
            console.log("Err:", err)
    })
    console.log("unsave")
    setReview("")
    Keyboard.dismiss()
  }
  // const updateSymbol = function(){
  //     axios.get(`${address}/account/detail`, {
  //         headers: {Authorization: `Bearer ${userToken.token}`},
  //     })
  //     .then(function(res){
  //         setSymbol(res.data.account)
  //     })
  //     .catch(function(err){
  //         console.log("Err:", err)
  //     })
  // }

  

  const closeModal = function(){
    setReview("")
    setStar("0")
    setModalVisible(!modalVisible)
  }


  const ratingCompleted = function(rating) {
    //console.log("Rating is: " + rating)
    setStar(rating)
  }

  useEffect(()=>{
    findOneDestination()
  }, [destination])

  useEffect(()=>{
    findImage()
  }, [])

  return (
    <View style={{backgroundColor: "#fff", flex: 1}}>
      <Header navigation={navigation} route={route}/>
      <ScrollView>
      
      <View style={{alignItems: 'center', marginVertical: 10}}>
        <Text style={{fontWeight: "bold", fontSize: 20, marginVertical: 10}}>{destination.name}</Text>
        {/* <Image style={{width: "90%", height: 300}} source={{uri: `${address}${destination.image}`}}/> */}
        
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
      {/* <Swiper showsButtons={false} autoplay={false}>
        {image.map((item, i) => (
          <View key={i} style={{alignItems: "center", height: 400}}>
            <Image style={{width: "80%", height: 300}} source={{uri: item}}/>
          </View>
        ))}
      </Swiper> */}
      {/* <SliderBox 
        images={image} 
        currentImageEmitter={index => console.log(`current pos is: ${index}`)}
        sliderBoxHeight={200}
        dotColor="orange"
        inactiveDotColor="gray"
      />  */}
      <View style={{flexDirection: "row", width: "100%"}}>
        <View style={styles.point}>
            <Text style={{textAlign: "center", color: "white", marginTop: 10}}>{totalRate.point != "NaN" ? totalRate.point : "-"}</Text>                     
        </View>
        {Object.keys(userToken).length != 0 && userToken.account.role == "tv" ? 
        <View>
          {userToken.account.favorite.includes(destination._id) ? 
            <Pressable style={{marginLeft: 300, marginTop: 8}} onPress={deleteFavorite}>
                <Icon3 name="favorite" size={40}></Icon3>
            </Pressable>
          : <Pressable style={{marginLeft: 300, marginTop: 8}} onPress={createFavorite}>
                <Icon3 name="favorite-border" size={40}></Icon3>
            </Pressable>
          }
        </View>
        :<View></View>
        }
      </View>
      <View style={styles.content}>
        <Icon name="map-marker" size={20}/>
        <Text style={{paddingHorizontal: 5}}>{destination.address}</Text>
      </View>
      <View style={styles.content}>
        <Text style={{paddingVertical: 7, fontSize: 15, fontWeight: "bold"}}>Types: </Text>
        {
          types.map((item, index)=>{
            return  <Pressable key={index} style={styles.content2}>
                      <Text style={{color: "#FF9900", fontWeight: "bold"}}>{item.name}</Text>
                    </Pressable>
                    
          })
        }
      </View>
      <View style={styles.content}>
        <Text style={{paddingVertical: 7, fontSize: 15, fontWeight: "bold"}}>Service: </Text>
        {
          services.map((item, index)=>{
            return  <Pressable key={index} style={styles.content2}>
                      <Text style={{color: "#FF9900", fontWeight: "bold"}}>{item.name}</Text>
                    </Pressable>
                    
          })
        }
      </View>
      <View style={styles.content}>
        <Text style={{paddingVertical: 10,}}>Capacity: {destination.capacity} people</Text>
      </View>
      <View style={styles.content}>
        <Icon name = "clock-o" size={20} />
        <Text style={{paddingHorizontal: 5}}>{destination.operatingTime}</Text>
      </View>
      <View style={styles.content}>
        <Icon name = "money" size={20} />
        <Text style={{paddingHorizontal: 5}}>{destination.price}</Text>
      </View>
      <View style={styles.content}>
        <Text style={{paddingVertical: 7, fontSize: 15, fontWeight: "bold"}}>Tours: </Text>
        {
          tours.map((item, index)=>{
            return  <View key={index} style={styles.content2}>
                      <Text style={{color: "#FF9900", fontWeight: "bold"}}>{item.title}</Text>
                    </View>
                    
          })
        }
      </View>
      <View style={styles.content}>
        <Icon2 name = "web" size={20} />
        <Text 
          style={{paddingHorizontal: 5, color: "orange"}}
          onPress={() => Linking.openURL(destination.contact)}
        >
          {destination.contact} 
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={{paddingHorizontal: 5, lineHeight: 25}}>{destination.content}</Text>
      </View>
      {/* <View renderToHardwareTextureAndroid={true} style={styles.content}>
      <WebView
          scalesPageToFit={true}
          bounces={false}
          javaScriptEnabled
          style={{ height: 300, width: 850 }}
          source={{
            html: `
                  <!DOCTYPE html>
                  <html>
                    <head></head>
                    <body>
                      <div id="baseDiv">
                        <iframe src="${destination.map != "" ? destination.map : "https://camerabox.vn/uploads/news/2018_07/chup-anh-phong-canh-thu-vi.jpg"}" title="iframe Example 1" width="400" height="300"></iframe>
                      </div>
                    </body>
                  </html>
            `,
          }}
          automaticallyAdjustContentInsets={false}
          
        />
      </View> */}
      <View style={{}}>
        <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>Similar Destinations</Text>
        {
          userToken.token ?
          similarDestination.map((item, index)=>{
            return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailDes",  {_id: item._id})}}>
                    <Card style={{height: 400, width: "90%", marginVertical: 20}}>
                      <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                      <View style={{flexDirection: "row", padding: 5}}>                                    
                          <Text style={styles.paragraph}>{item.name}</Text>
                      </View>
                      <Text style={{padding: 10}}>{item.address}</Text>
                    </Card>
                    </Pressable>
          })
          : <Text style={{textAlign: "center", fontSize: 20, fontStyle: "italic"}}>(Please login to view)</Text>
        }
      </View>
      <View style={{marginTop: 10}}>
        <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>Nearby Destinations</Text>
        {
          userToken.token ?
          nearbyDestination.map((item, index)=>{
            return  <Pressable key={index} style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={()=>{navigation.navigate("detailDes",  {_id: item._id})}}>
                    <Card style={{height: 400, width: "90%", marginVertical: 20}}>
                      <Image style={{width: "100%", height: "65%"}} source={{uri: `${address}${item.image}`}}/>
                      <View style={{flexDirection: "row", padding: 5}}>                                    
                          <Text style={styles.paragraph}>{item.name}</Text>
                      </View>
                      <Text style={{padding: 10}}>{item.address}</Text>
                    </Card>
                    </Pressable>
          })
          : <Text style={{textAlign: "center", fontSize: 20, fontStyle: "italic"}}>(Please login to view)</Text>
        }
      </View>
      <Pressable 
          style={{backgroundColor: "lightblue", width: 70, height: 40, borderRadius: 5,  justifyContent: "center", marginLeft: 10, marginTop: 20}} 
          onPress={() => setModalVisible(true)}>
        <Text style={{textAlign: "center",}}>Review</Text>
      </Pressable>
      <View style={styles.rating}>
        <Text style={{fontSize: 20, fontWeight: "bold", padding: 10}}>Recent reviews ({totalRate.count})</Text>
        {
          rating.map((item, index)=>{
            var a = new Date(item.createdAt)
            var d = a.getDate()
            var m = a.getMonth() + 1
            var y = a.getFullYear()
            var t = a.getHours() + ":" + a.getMinutes()
            var s = `${t}  ${d}/${m}/${y}`
            return  <View key={index} style={{borderWidth: 1, borderColor: "lightgray", width: "90%", marginHorizontal: 20, marginVertical: 10}}>
                      <View style={{padding: 5}}>
                        <View style={{flexDirection: "row", marginHorizontal: 10}}>
                          <Text style={{fontWeight: "bold", fontSize: 15}}>{item.creator}</Text>
                          <Text style={{fontSize: 10, margin: 4}}>{s}</Text>
                        </View>
                        <View style={styles.point}>
                            <Text style={{textAlign: "center", color: "white", marginTop: 10}}>{item.rate}</Text>                       
                        </View>
                        <Text key={index} style={{marginHorizontal: 10}}>{item.content}</Text>
                      </View>
                    </View>
          })
        }
      </View>
      </ScrollView>
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
        }}>
          {Object.keys(userToken).length !=0 && userToken.account.role == "tv" ? 
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Pressable
                style={{borderRadius: 20, paddingVertical: 5, width: "20%", alignSelf: "flex-end",}}
                onPress={closeModal}>
                    <Text style={styles.textStyle}>X</Text>
                </Pressable>
                <View>
                  <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "Not bad", "Good", "Very Good"]}
                    defaultRating={0}
                    size={25}
                    onFinishRating={ratingCompleted}
                  />
                  <TextInput
                      multiline={true}
                      numberOfLines={4}
                      value={review} 
                      placeholder='Enter...' 
                      style={styles.inputArea}
                      onChangeText = {(text) => setReview(text)}
                  >
                  </TextInput>
                </View>
                <Pressable style={styles.button} onPress={createRating}>
                    <Text>Submit</Text>
                </Pressable>
                <View style={{flex: 1, alignItems: "center"}}>
                  <Text style={{color: "red", fontSize: 18}}>{alertRating}</Text>
                </View>
            </View>
        </View>
        :<View style={styles.centeredView}>
            <View style={styles.modalView2}>
                <Pressable
                style={{borderRadius: 20, paddingVertical: 5, width: "20%", alignSelf: "flex-end",}}
                onPress={closeModal}>
                    <Text style={styles.textStyle}>X</Text>
                </Pressable>
                <View style={{alignItems: "center"}}>
                  <Text style={{fontWeight: "bold", fontSize: 20}}>You must be member to review</Text>
                </View>
            </View>
        </View>
        }
      </Modal>
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
    color: "orange",
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
    marginHorizontal: 5,
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
  modalView2: {
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
        height: 100
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
export default DetailDestination