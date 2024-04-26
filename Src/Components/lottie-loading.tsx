import React,{useEffect} from 'react'
import {View,Text,BackHandler } from 'react-native'
import LottieView from 'lottie-react-native';

interface LottieProps{
  text:string
}
export default function LottieLoading(props:LottieProps) {
  const {text} = props;
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Prevent default back action
        return true;
      }
    );

    // Cleanup function to remove the event listener
    return () => backHandler.remove();
  }, []);
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          style={{ width: '100%', height: 500,resizeMode:'cover'}}
          source={require('../../assets/Animation - 1710513221775.json')} // path to your Lottie JSON file
          autoPlay
          loop
        />
        <Text style={{fontSize:27,fontWeight:600,textAlign:'center'}}>{text}</Text>
        {/* <Text style={{fontSize:27,fontWeight:600,color:'white'}}>Please wait</Text> */}
      </View>
    );
  }
  
