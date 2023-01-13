import { View, Text, Pressable, TouchableOpacity} from 'react-native'
import React, { useContext, useState } from 'react'
import styles from "./style"
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/AntDesign'
import { TextInput } from 'react-native-paper'
import { Searchbar } from 'react-native-paper';

const Header = (props) => {
  const {userToken} = useContext(AuthContext)
  const [show, setShow] = useState(false)
  return (
    <View>
      <View style={{flexDirection: "row"}}>
        <Pressable
            style={styles.nav}
            title="Main page"
            onPress={() => {props.navigation.navigate("destination")}}
        >
          <Text style={styles.textStyle}>Ktravel</Text>
        </Pressable>
        <Pressable
            style={styles.des}
            onPress={() => {props.navigation.navigate("destination")}}
        >
          <Text style={styles.textStyle}>Destination</Text>
        </Pressable>
        <Pressable
            style={styles.tour}
            onPress={() => {props.navigation.navigate("tour")}}
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
              <Text style={{color: "orange", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Login</Text>
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
            <Pressable
              style={styles.show}
              onPress={() => {props.navigation.navigate("destination")}}
            >
              <Text style={{color: "orange", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Manage</Text>
            </Pressable> 
            </View>
            
        : <></>
      }
    </View>
  )
}

export default Header