import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Header from '../components/header'
import { AuthContext } from '../contexts/auth'
import { useContext, useState } from 'react'
import Swiper from 'react-native-swiper'
import { Image } from 'react-native';
import axios from 'axios'


const background = ["http://mauweb.monamedia.net/travelwp/wp-content/uploads/2019/01/slider-2.jpeg", 
                    "http://mauweb.monamedia.net/travelwp/wp-content/uploads/2019/01/1.1.jpeg", 
                    "http://mauweb.monamedia.net/travelwp/wp-content/uploads/2019/01/slider-1.jpg"]
const HomePage = ({navigation, route}) => {
    const {userToken, logout} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    const [famousDes, setFamousDes] = useState([])
    const findAllDestination = function(){
        axios.get(`${address}/`, {
            headers: Object.keys(userToken).length ? {Authorization: `Bearer ${userToken.token}`} : {Authorization: ``},
        })
          .then(function(res){
            var arr1 = []
            for(var i = 0; i < res.data.famousDes.length; i++){
                if(res.data.famousDes[i].image.indexOf(",") != -1)
                    res.data.famousDes[i].image = res.data.famousDes[i].image.slice(0, res.data.famousDes[i].image.indexOf(","))
                // if(res.data.destinations[i].point == "NaN")
                //     res.data.destinations[i].point = "-"
                arr1.push(res.data.famousDes[i])
            }
            setFamousDes(arr1)
          })
          .catch(function(err){
            console.log("Err1:", err)
          })
    }
    useEffect(()=>{
        findAllDestination()
    }, [])
    // console.log(famousDes)
    return (
        <View style={{flex: 1}}>
            <Header navigation={navigation} route={route}/>
            <Swiper showsButtons={false} autoplay={false} style={{height: 400, marginTop: 10}}>
            {background.map((item, i) => (
                <View key={i} style={{alignItems: "center"}}>
                    <Image key={i} style={{width: "95%", height: 300}} source={{uri: item}}/>
                    <Text style={styles.text}>Explore the world with KTRAVEL</Text>
                </View>
            ))}
            </Swiper>
            <View style={{flex:1, alignItems: "center"}}>
                <Text style={{fontWeight: "bold", fontSize: 20}}>Famous Destinations</Text>
                <Swiper showsButtons={false} autoplay={false} style={{height: 400, marginTop: 10}}>
                {famousDes.map((item, i) => (
                    <Pressable key={i} style={{alignItems: "center"}} onPress={()=>{navigation.navigate("detailDes",  {_id: item._id})}}>
                        <Image key={i} style={{width: "95%", height: 300}} source={{uri: address + item.image}}/>
                        <Text style={{color: "orange", marginTop: 2, fontWeight: "bold"}}>{item.name}</Text>
                    </Pressable>
                    
                ))}
                
                </Swiper>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        position: "absolute",
        top: 250,
        left: 20,
        right: 0,
        bottom: 0,
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "italic",
        // textAlign: "center"
    }

})

export default HomePage