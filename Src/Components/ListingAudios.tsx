import React,{useEffect,useState} from 'react';
import { FlatList, Image,ScrollView, Text, TouchableOpacity, View,StyleSheet,Modal,ToastAndroid } from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'; 
import Sound from 'react-native-sound';
import {useNavigation} from '@react-navigation/native'

interface ListingAudios{
    apiData:any,
    filePath:string
}
 
const ListingAudio = (props:ListingAudios) => {
  const navigation = useNavigation();
  const { apiData, filePath } = props;

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listingData, setListingData] = useState<any>([]);
 

  const [modalData,setModalData] =  useState<any>([])
  const [showModal,setShowModal] =  useState(false)

  let sortedFiles :any = [];
  useEffect(() => {
    console.log('use effect',filePath)
    sortedFiles = apiData[0].Areas.slice().sort((a:any, b:any) => a.Position - b.Position);
    setListingData(sortedFiles)
    console.log('sorted')

  }, []);

  const handlePlayPause = (sound:any) => {
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play((success:any) => {
        if (!success) {
          console.error('Failed to play the sound');
        }
      });
    }
    setIsPlaying(!isPlaying);
  };


  const renderItem = ({ item }:any) => (
    <TouchableOpacity style={{ margin: 5, width: 150 }} 
        onPress={() => {
           const audioLinks = item.AreaContents[0].ContentFiles.filter(file => file.Type === 1);
         
         console.log('Item  is',item)
         navigation.navigate('AudioPlayer',{data:item.AreaContents[0].ContentFiles,placeName:item.AreaContents[0].Title});
     }}>
      <View style={{ width: 150, height: 150, borderRadius: 8 }}>
        {
          item.AreaContents[0].ContentFiles.filter((file:any) => file.Type === 0).map((file:any, index:number) => (
            <Image key={index}
             source={{ uri: filePath + file.Link }}
             style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 8 }}
                />
           ))
            }
        <View style={styles.videoOverLay}>
          <IconFontAwesome name="play-circle-o" size={45} color="white" />
        </View>
      </View>
      <Text style={{ fontWeight: 700 }} numberOfLines={2} ellipsizeMode="tail">{item.Name}</Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item:any) => item.Id.toString();
 
  return (
    <View>
     <FlatList
      data={listingData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      />
     {/* {
  showModal && (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => { setShowModal(false); setModalData([]); }}>
            <Text style={{ textAlign: 'right' }}>
              <IconFontAwesome size={35} color='red' name="window-close"/>
            </Text>
          </TouchableOpacity>
          <ScrollView >
            {
              modalData.filter((file:any) => file.Type === 0).map((file:any, index:number) => (
                <Image key={index} style={{ width: '100%', height: 200, resizeMode: 'cover', marginTop: 5, marginBottom: 15, borderRadius: 8 }} source={{ uri: filePath + file.Link }} />
              ))
            }
            {
              modalData.filter((file:any) => file.Type === 1).map((file:any, index:number) => (
                <View key={index} style={{width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                   <View style={{width:'90%',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:8}}>
                     <Text style={{fontSize:20,fontWeight:700}}>{ file.Name }</Text>
                     <TouchableOpacity style={[styles.button , {backgroundColor: isPlaying ? 'red':'green' }]} 
                         onPress={async()=>{
                         await initializeSound(filePath+file.Link);
                           
                         }}>
                         <Text  style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                     </TouchableOpacity>
                   </View>
                </View>
              ))
            }
            
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 25 }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => { setShowModal(false); setModalData([]); }}>
              <Text style={styles.buttonText}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
} */}
    </View>
  );
};
const styles = StyleSheet.create({
    videoOverLay:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust opacity as needed
      borderRadius: 8,
    },
    modalContainer: {
        flex: 1,    
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        borderColor: 'black',
        borderWidth:2,
        backgroundColor: 'white',
        padding: 20,
        width:'90%',          
        marginTop:'25%',
        marginBottom:'25%',
        borderRadius: 10,
      },
      button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight:15,
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
      },
});
export default ListingAudio;
