import React from 'react'
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlaceDetails from './Src/Screens/PlaceDetails';
import { LoadingScreen } from './Src/Components/Loading';
import TestingScreen from './Src/Screens/testing'; 
import LottieLoading from './Src/Components/lottie-loading';
import WelcomeScreen from './Src/Screens/welcomeScreen';
import AudioPlayer from './Src/Components/AudioPlayer';
import TabViewExample from './Src/Components/TabView';
import StartTour from './Src/Components/StartTour';
 
export default function App () {
  const Stack = createNativeStackNavigator();
  return  (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="WelcomeScreen" options={{headerShown:false}} component={WelcomeScreen} />  
      <Stack.Screen name="AudioPlayer" options={{headerShown:false}}  component={AudioPlayer}  />  
      <Stack.Screen name="PlaceDetails" options={{headerShown:false}} component={PlaceDetails} />  
      <Stack.Screen name="LottieLoading" options={{headerShown:false}} component={LottieLoading} />  
      <Stack.Screen name="TestingScreen" options={{headerShown:false}} component={TestingScreen} />  
      <Stack.Screen name="LoadingScreen" options={{headerShown:false}} component={LoadingScreen} />
      <Stack.Screen name='StartTour' options={{headerShown:false}} component={StartTour}/>
    </Stack.Navigator>
 </NavigationContainer>

  )
}