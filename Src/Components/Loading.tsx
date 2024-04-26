import { Text, View, ActivityIndicator} from 'react-native' 
import React  from 'react'
 

interface LoadingIndicatorProps {
    isLoading: boolean; // Define the type of isLoading prop
    text: string; // Define the type of text prop
  }

  
export function Loading (props:LoadingIndicatorProps){
    const { isLoading, text} = props;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading && (
        <View style={{ alignItems: 'center',marginTop:25 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>{text}</Text>
        </View>
      )}
    </View>

  )
}

export function LoadingScreen (text:string){
     
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      { 
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>{text}</Text>
        </View>
       }
    </View>

  )
}

 