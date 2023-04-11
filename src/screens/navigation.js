import Login from './form/login';
import Register from './form/register';
import PrivateHome from './privateHome';
import Destinations from './destination/destinations'
import DetailDestination from './destination/detailDestination';
import ManageAccount from './manage/manageAccount';
import ManageType from './manage/manageType';
import ManageService from './manage/manageService';
import ManageApproval from './manage/manageApproval';
import ManageUnApproval from './manage/manageUnApproval';
import ManageDestination from './manage/manageDestination';
import ManageTour from './manage/manageTour';
import Edit from './form/edit'
import Add from './form/add'
import Tours from './tour/tour';
import DetailTour from './tour/detailTour';
import HomePage from './homePage'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';
const Stack = createNativeStackNavigator();


const Navigation = () => {
  const {userToken} = useContext(AuthContext)
  //console.log(userToken.account.role)
  return (
    <NavigationContainer>
    <Stack.Navigator 
        initialRouteName="test2"
        screenOptions={{
          headerShown: false
        }}
      >
        {
        userToken.token ? (
          <>
          <Stack.Screen name="home" component={HomePage} />
          <Stack.Screen name="private" component={PrivateHome} />
          <Stack.Screen name="destination" component={Destinations} /> 
          <Stack.Screen name="detailDes" component={DetailDestination} />
          <Stack.Screen name="tour" component={Tours} /> 
          <Stack.Screen name="detailTour" component={DetailTour} />
          <Stack.Screen name="manageAccount" component={ManageAccount} />
          <Stack.Screen name="manageType" component={ManageType} />
          <Stack.Screen name="manageService" component={ManageService} />
          <Stack.Screen name="manageApproval" component={ManageApproval} />
          <Stack.Screen name="manageUnapproval" component={ManageUnApproval} />
          <Stack.Screen name="manageDestination" component={ManageDestination} />
          <Stack.Screen name="manageTour" component={ManageTour} />
          <Stack.Screen name="edit" component={Edit} />
          <Stack.Screen name="add" component={Add} />
          
          </>
          ) 
        : (
          <> 
          {/* <Stack.Screen name="test2" component={Test2} /> */}
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="home" component={HomePage} />
          <Stack.Screen name="destination" component={Destinations} /> 
          <Stack.Screen name="detailDes" component={DetailDestination} />
          <Stack.Screen name="tour" component={Tours} />  
          <Stack.Screen name="detailTour" component={DetailTour} />
          </>
          )
        }
        
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation