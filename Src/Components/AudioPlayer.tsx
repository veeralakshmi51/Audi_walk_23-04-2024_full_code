import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity,BackHandler } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Sound from 'react-native-sound';
import { useNavigation } from '@react-navigation/native'; 
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'; 
import colors from '../Constants/colors';

interface AudioFile {
  Id: number;
  LanguageCode: string;
  Link: string;
  Name: string;
  Path: string;
  Type: number;
}

interface AudioPlayerProps {
  route: any; // Add route prop
}

const AudioPlayer = ({ route }: AudioPlayerProps) => {
  const { data,placeName } = route.params; // Access data from route.params
  const filePath = 'file:///storage/emulated/0/Android/data/com.audiwalknew/files/'; 
  const [sound, setSound] = useState<Sound | null>(null);
  const [isAlreadyPlaying, setIsPlaying] = useState(false);
  const navigating = useNavigation();

  useEffect(() => { 
    // Load the audio file when the component mounts
    const newSound=()=> new Sound(filePath, null, (error: any) => {
      if (error) {
        console.error('Failed to load the sound:', error);
      } else {
        setSound(newSound);
      }
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Deny going back when the back button is pressed
       
      return true;
    });

    return () => backHandler.remove();
    
  }, []);

  const handlePlayPause = () => {
    if (sound) {
      console.log('came to handle play pause')
      if (sound.isPlaying()) {
        console.log('sound is playing')
        sound.pause();
        setIsPlaying(false);
      } else {
        console.log('started playing')
        sound.play();
        setIsPlaying(true);
      }
    }
  };
  const newSound = (audioUrl: any) => {
    if (!audioUrl) {
      console.error('Invalid audio URL');
      return null; // Return null if audioUrl is invalid
    }
    
    const sound = new Sound(audioUrl, null, (error: any) => {
      if (error) {
        console.error('Failed to load the sound:', error);
        return;
      }  
      console.log('Audio is available to play');
      setSound(sound);
      sound.play();
      setIsPlaying(true);
    });
   
  };
  
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    data.map((item, index) => ({ key: index.toString(), ...item })) 
  );

  const renderScene = ({ route }) => {
    return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       {
       route.Type === 0 &&
       <Image   style={{ width: '96%', height: '39%', resizeMode: 'contain', marginTop: 5, marginBottom: 15, borderRadius: 8 }} source={{ uri: filePath + route.Link }} />
       }
       {
       route.Type === 1 &&
       <TouchableOpacity 
          onPress={()=>{
              console.log('audio is ',route.Link)
              if(sound){
                console.log('going to play')
                handlePlayPause()
              }
              else{
                console.log('assigning sound')
                newSound(filePath+route.Link);
              }
            }
            }>
         <View style={{backgroundColor:colors.appBackgroundColor,borderRadius:5,elevation:5}}>
          <Text style={{fontSize:25,paddingHorizontal:55,paddingVertical:13,color:'white'}}>{isAlreadyPlaying ? 'Pause' : 'Play' }</Text>
         </View>
       </TouchableOpacity>
       }
      </View> 
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'blue' }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route }) => (
        <Text style={styles.tabLabel}>{route.Name}</Text>
      )}
    />
  );

  return (
  <View style={{height:'100%'}}>
  <View style={{height:'7%',backgroundColor:'red',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:30}}>
    <TouchableOpacity onPress={()=>{
          console.log('object')
          if(isAlreadyPlaying){sound.release()}
          setIsPlaying(false)
          setSound(null)
          navigating.goBack();
          }}>
      <IconFontAwesome name="angle-left" color="white" size={50}/>
    </TouchableOpacity>
    <Text style={{fontSize:23,color:"white",fontWeight:'700',letterSpacing:2}}>{placeName}</Text>
    <Text></Text>
  </View>
    <View style={{height:'93%'}}>
     <TabView     
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={()=>{
        console.log('Index is changed')
        setIndex
        if(isAlreadyPlaying){sound.release()}
        setIsPlaying(false)
        setSound(null)
      }}
      initialLayout={{ width: 300 }}
      renderTabBar={renderTabBar}
    />
     </View>
   </View>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // For Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AudioPlayer;
