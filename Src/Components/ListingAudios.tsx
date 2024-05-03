import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, Modal, ToastAndroid, Alert } from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs'; // Import RNFS for file system operations

interface ListingAudios {
  apiData: any,
  filePath: string,
  syncNowModal:boolean,
  setSyncModalVisible:boolean,
}

const ListingAudio = (props: ListingAudios) => {
  const navigation = useNavigation();
  const { apiData, filePath,setSyncModalVisible } = props;

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listingData, setListingData] = useState<any>([]);


  const [modalData, setModalData] = useState<any>([])
  const [showModal, setShowModal] = useState(false)

  let sortedFiles: any = [];
  useEffect(() => {
    console.log('use effect', filePath)
    sortedFiles = apiData[0].Areas.slice().sort((a: any, b: any) => a.Position - b.Position);
    setListingData(sortedFiles)
    console.log('sorted')

  }, []);

  const handlePlayPause = async (file: any) => {
    const audioFilePath = filePath + file.Link;
    const exists = await RNFS.exists(audioFilePath); 

    if (exists) {
      if (isPlaying) {
        sound.pause();
      } else {
        const soundObj = new Sound(audioFilePath, '', (error) => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          setSound(soundObj);
          soundObj.play((success) => {
            if (!success) {
              console.error('Failed to play the sound');
            }
          });
        });
        setSound(soundObj);
      }
      setIsPlaying(!isPlaying);
    } else {
      Alert.alert('Title',
      'File Does Not Exists, Please Sync again',
    [
      // {text:'OK', onPress:()=>navigation.goBack()
      
      // }
      {
        text:'ok', onPress:()=>{setSyncModalVisible(true),navigation.goBack()}
      }
    ])
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={{ margin: 5, width: 150 }}
      onPress={() => {
        const audioLinks = item.AreaContents[0].ContentFiles.filter(file => file.Type === 1);
        console.log('renderm item audioLink',audioLinks);
        
        handlePlayPause(item.AreaContents[0].ContentFiles[0] )
        console.log('Item  is', item)
        navigation.navigate('AudioPlayer', { data: item.AreaContents[0].ContentFiles, placeName: item.AreaContents[0].Title });
      }}>
      <View style={{ width: 150, height: 150, borderRadius: 8 }}>
        {
          item.AreaContents[0].ContentFiles.filter((file: any) => file.Type === 0).map((file: any, index: number) => (
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

  const keyExtractor = (item: any) => item.Id.toString();

  return (
    <View>
      <FlatList
        data={listingData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  videoOverLay: {
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
    borderWidth: 2,
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    marginTop: '25%',
    marginBottom: '25%',
    borderRadius: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
export default ListingAudio;
