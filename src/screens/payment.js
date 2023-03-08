import { View, Text } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/auth'

const Payment = ({navigation, route}) => {
    const {userToken} = useContext(AuthContext)
    const {address} = useContext(AuthContext)
    return (
      <View>
        <Text>Payment</Text>
      </View>
    )
}

export default Payment