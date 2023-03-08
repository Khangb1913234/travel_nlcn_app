import { View, Text, Pressable, TouchableOpacity, Modal} from 'react-native'
import React, { useContext, useState } from 'react'
import styles from "./style"
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/AntDesign'
import { TextInput } from 'react-native-paper'
import { Searchbar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const Header = (props) => {
  const state = useRoute();
  //console.log(state.name);
  const {userToken} = useContext(AuthContext)
  const [show, setShow] = useState(false)
  const handle = function(){
    if(state.name == "destination")
      props.reset()
    props.navigation.navigate("destination")
  }
  const handle1 = function(){
    if(state.name == "tour")
      props.reset()
    props.navigation.navigate("tour")
  }
  const directLink = function(){
    if(userToken.account.role == "qtv"){
      props.navigation.navigate("manageAccount")
    }
    else if(userToken.account.role == "ctv1"){
      props.navigation.navigate("manageDestination")
    }
    else if(userToken.account.role == "ctv2"){
      props.navigation.navigate("manageTour")
    }
  }
  return (
    <View>
      <View style={{flexDirection: "row"}}>
        <Pressable
            style={styles.nav}
            title="Main page"
            onPress={() => {props.navigation.navigate("home")}}
        >
          <Text style={styles.textStyle}>Ktravel</Text>
        </Pressable>
        <Pressable
            style={styles.des}
            onPress={handle}
        >
          <Text style={styles.textStyle}>Destination</Text>
        </Pressable>
        <Pressable
            style={styles.tour}
            onPress={handle1}
        >
          <Text style={styles.textStyle}>Tour</Text>
        </Pressable>
        <Pressable style={styles.info} onPress={()=>{setShow(!show)}}>
          <Text style={{fontWeight: "bold", paddingHorizontal: 10, color: "orange", fontSize: 15, textAlign: "right"}}>
            {Object.keys(userToken).length === 0 ? "" : userToken.account.username}
            <Icon name="caretdown" size={15} color="orange" />
          </Text>
        </Pressable>
      </View>
      { 
        show ?
          Object.keys(userToken).length === 0 ? 
            <View style={{backgroundColor: "white"}}>
            <Pressable
                style={styles.show}
                onPress={() => {setShow(false); props.navigation.navigate("login")}}
            >
              <Text style={{color: "orange", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Sign in</Text>
            </Pressable> 
            <Pressable
                style={styles.show}
                onPress={() => {setShow(false); props.navigation.navigate("register")}}
            >
              <Text style={{color: "orange", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Sign up</Text>
            </Pressable> 
            </View>
          : 
            <View style={{backgroundColor: "white"}}> 
            <Pressable
              style={styles.show}
              onPress={() => {setShow(!show); props.navigation.navigate("private")}}
            >
              <Text style={{color: "orange", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Private Home</Text>
            </Pressable>
            {
            userToken.account.role == "tv" ? 
            <></>
            :<Pressable
              style={styles.show}
              onPress={directLink}
            >
              <Text style={{color: "orange", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Manage</Text>
            </Pressable> 
            }
            </View>
            
        : <></>
      }
    </View>
  )
}

export default Header