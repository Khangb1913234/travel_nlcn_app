import Login from '../screens/login';
import Register from '../screens/register';
import PrivateHome from './privateHome';
import Destinations from './destinations'
import DetailDestination from './detailDestination';
import Tours from './tour';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';
const Stack = createNativeStackNavigator();


const Navigation = () => {
  const {userToken} = useContext(AuthContext)
  return (
    <NavigationContainer>
    <Stack.Navigator 
        initialRouteName="login"
        screenOptions={{
          headerShown: false
        }}
      >
        {userToken.token ? (
          <>
          <Stack.Screen name="private" component={PrivateHome} />
          <Stack.Screen name="destination" component={Destinations} /> 
          <Stack.Screen name="detailDes" component={DetailDestination} />
          <Stack.Screen name="tour" component={Tours} /> 
          </>
          ) : (
          <>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="destination" component={Destinations} /> 
          <Stack.Screen name="detailDes" component={DetailDestination} />
          <Stack.Screen name="tour" component={Tours} />  
          </>
          )
        }
        
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation