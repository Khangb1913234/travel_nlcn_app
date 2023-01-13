import { View, Text, Pressable, TouchableOpacity} from 'react-native'
import React, { useContext, useState } from 'react'
import styles from "./style"
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/AntDesign'

const Footer = (props) => {
  const [show, setShow] = useState(false)
  return (
    <View>
    <View style={styles.headerFooterStyle}>
        {
            console.log(props.navigation.navigate)
        }
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
    </View>
    </View>
  )
}

export default Footer