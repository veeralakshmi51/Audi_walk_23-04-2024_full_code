import React, { useEffect, useState } from 'react'
import { Linking, Text,View, Platform,StyleSheet,ToastAndroid,SafeAreaView,StatusBar,Image,useWindowDimensions,TouchableOpacity,Modal, Alert } from 'react-native';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import colors from '../Constants/colors' 
import Dropdown from '../Components/DropDown';
import { PERMISSIONS, request } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome' 
import IconEntypo from 'react-native-vector-icons/Entypo' 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import LottieLoading from '../Components/lottie-loading'; 
import ListingAudio from '../Components/ListingAudios';

const renderTabBar = (props: React.JSX.IntrinsicAttributes) => (
  <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.appBackgroundColor,height:4 }} // Color of the active tab indicator
          style={{ backgroundColor: 'white' }} // Background color of the tab bar
          
          renderLabel={({ route, focused}) => (
            <Text style={{ color: focused ? colors.appBackgroundColor : 'black',fontSize:15,fontWeight:800 }}>{route.title}</Text> // Change color for active tab
            )}
            />
            );
            
  const PlaceDetails = () => { 
    const layout = useWindowDimensions();
   
   const [apiData,setApiData] = useState<any>([])
   const [showLoading,setLoading] = useState(true)
   const [syncNowModal, setSyncModalVisible] = useState(false);

   const [index, setIndex] = React.useState(0);
   const [routes] = React.useState([
     { key: 'Info', title: 'Info' },
     { key: 'Tours', title: 'Tours' },
    ]);
              
 //following are for dropdown  
    const [selectedOption, setSelectedOption] = React.useState('Tamil');
    const options = ['Hindi', 'English', 'Tamil'];
 
    const handleSelect = (option:any) => {
      setSelectedOption(option);
    };
  

  const checkPermission = async (downloadType:string,data:any) => {
        try {
          const granted = await request(
            Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.MEDIA_LIBRARY
                  : (Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) ,
             {
              title:   'Storage Permission Required',
              message: 'App needs access to your storage to download content',
              buttonNeutral:'Ask me later',
              buttonPositive:'Ok',
              buttonNegative:'Cancel'
             }
          );
          if (granted === 'granted') {
            // Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            console.log('Download type',downloadType);
    
            if(downloadType !== 'single'){
              downloadMultiFiles(data);
            }
          
          } else {
            // If permission denied then show alert
            console.log('Storage Permission Not Granted');
          }
           } catch (err) {
          // To handle permission related exception
              ToastAndroid.show('Something went wrong. Check internet or restart the application.', ToastAndroid.SHORT);
              console.warn(err);
        }
      
    };
    
    const downloadMultiFiles = async (data:any) => {
     setLoading(true);
      try {
       for (const area of data.Areas) {
           for (const content of area.AreaContents) {
             for (const file of content.ContentFiles) {
             const filePath=`${RNFS.ExternalDirectoryPath}/${file.Link}`;
             const fileExists=await RNFS.exists(filePath);
             if(!fileExists){
              await RNFS.downloadFile({
                fromUrl: file.Path,
                toFile: filePath+file.Link,
              }).promise.then((result:any)=>{
                console.log('downloaded file',file.Link)
                console.log('downloaded status',filePath+file.Link)                
              }).catch((error:any)=>{
                console.log('filePath is:',filePath);
                console.log('error to download',error)});              
              }
              else{
                Alert.alert('File Exists',`The File ${file.Link} already exists`,[
                  {
                    text:'Ok' ,onPress:()=>console.log('pressed')
                  }
                ],
              {
                cancelable:false
              })
              return;
              }
              
             }
                  
             
          }
        }
        console.log('Downloaded sucessfully all files');
        await  AsyncStorage.setItem('isSync','yes')
      } catch (error) {
        console.error('Error downloading file:', error);
        ToastAndroid.show('Something went wrong. Check internet or restart the application.', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
        setSyncModalVisible(false);
      }
    };
    
    
  // const downloadSingleFile = async (dataSingle: any) => {
  //     if (!dataSingle) {
  //       console.error('apiData or its properties are undefined.', dataSingle);
  //       return;
  //     }
    
  //     const fileName = dataSingle[0].Features[0].Link;
  //     const PictureDir = RNFetchBlob.fs.dirs.PictureDir + '/audiwalknew/'; // Directory path
    
  //     try {
  //       // Check if file already exists
  //       const fileInfo = await RNFetchBlob.fs.exists(PictureDir + fileName);
    
  //       // If file exists, return without downloading
  //       if (fileInfo) {
  //         console.log('File already exists:', fileName);
  //         return;
  //       }
    
  //       // Proceed with file download
  //       const { config } = RNFetchBlob;
  //       const options = {
  //         fileCache: true,
  //         addAndroidDownloads: {
  //           useDownloadManager: true,
  //           notification: false,
  //           mediaScannable: true,
  //           title: fileName,
  //           path: PictureDir + fileName,
  //         },
  //         visible: true, // Not sure what this option does, but it's included from your original code
  //       };
    
  //       // Initiate file download
  //       const response = await config(options).fetch('GET', dataSingle[0].Features[0].Path);
  //       console.log('File downloaded successfully:', fileName, response);
  //     } catch (error) {
  //       console.error('Error downloading file:', error);
  //     }
  //   };   
  let isSync = '';
  let dataCheck = '';
  const fetchData = async () => {
      try {
        const dataCheck = await AsyncStorage.getItem('apiData');
        
       if (!dataCheck) {
          const response = await fetch('https://portal.audiwalk.com/api/GetOrganizationByName?name=Khazana%20Mahal');
          if (response.status === 200) {
            console.log('status : 200');
            const data = await response.json();
            await AsyncStorage.setItem('apiData', JSON.stringify(data));
            console.log('Data stored in AsyncStorage');
            setApiData(data); 
            console.log('response data',data);
            console.log('Data set in state');
           
          } else {
            console.log('Error:', response); 
          }
          setLoading(false)
        } 
        else {
          const dataIsAvail = JSON.parse(dataCheck);
          console.log('dataCheck',dataIsAvail[0].Features[0].Link);
          setApiData(dataIsAvail);
          setLoading(false) 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false)
        ToastAndroid.show('Something went wrong. Check internet or restart the application.', ToastAndroid.SHORT);
    
      } 
      isSync = await AsyncStorage.getItem('isSync');
    };
     
  const filePath = 'file:///storage/emulated/0/Android/data/com.audiwalknew/files/';

   useEffect(() => {
          console.log('isSync :',isSync)
         fetchData();
      }, []);
    const handleCallButtonPress = () => {
       const phoneNumber = apiData[0].Phone; // Replace with the phone number you want to call
       const phoneUrl = `tel:${phoneNumber}`;
            Linking.openURL(phoneUrl)
          .then(() => console.log('Phone call initiated'))
          .catch((error:string) => console.error('Error opening phone app:', error));
      };

  return (
  <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor:showLoading ? colors.appBackgroundColor : colors.white }}>
     {
        showLoading && <LottieLoading text='Downloading your content....' />
     }
   { !showLoading && <View style={{ flex: 1.2 , backgroundColor: '#fff', alignItems:'center'}}>
        <StatusBar barStyle="light-content" backgroundColor={colors.appBackgroundColor} />
       <View style={{width:'100%',backgroundColor:colors.appBackgroundColor,textAlign:'center'}}>
             <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:15}}>
              <Text></Text>
             <Text style={{fontSize:20,fontWeight:700,color:'white',textAlign:'center',padding:20}}>{apiData[0]?.Name}</Text>
             <TouchableOpacity onPress={() => setSyncModalVisible(true)}>
                  <IconEntypo name="dots-three-vertical" size={24} color="white" />
      </TouchableOpacity>
             </View> 
            </View>
      
       <Image style={{width:'100%',height: '80%',resizeMode: 'cover',}} source={{uri: filePath + apiData[0]?.Features[0]?.Link }} />  
       {/* {homescreen image} */}
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={syncNowModal}
        onRequestClose={() => {
          setSyncModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setSyncModalVisible(false)}>
              <Text style={{textAlign:'right'}}><IconFontAwesome size={35} color='red' name="window-close"/></Text>
            </TouchableOpacity>
            <Text style={{fontSize:22,fontWeight:700,marginTop:25}}>Do you want to sync content now ?</Text>
              <View style={{width:'100%',marginTop:25}}>
               <View style={{flexDirection:'row',marginTop:25,justifyContent:'flex-end'}}>
               <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={() => {
                setLoading(true)
                checkPermission('multi',apiData[0])
                }}>
                 <Text style={styles.buttonText}>Sync now</Text>
                </TouchableOpacity>
               <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => {setSyncModalVisible(false)}}>
                 <Text style={styles.buttonText}> Cancel </Text>
                </TouchableOpacity>
               
              </View>
             </View>
          </View>
        </View>
      </Modal>
      </View>  }
    { !showLoading &&
       <View style={{           
           flex:2.2,         
          borderRadius:50,
          width:'100%', 
            }}>
           <TabView
              swipeEnabled={false}
              navigationState={{ index, routes }}
              renderScene={SceneMap({
                Info: ()=>{
                    return (
                        <View style={{  backgroundColor: '#fff',height:'100%'  }} >
                         
                         <View style={{paddingVertical:25,paddingHorizontal:20,}}>
                            <Text style={{fontSize:18,fontWeight:700,color:'black'}}>{apiData[0]?.Name}</Text>
                            <View style={{flexDirection:'row',alignItems:'start',paddingTop:15}}>
                                <IconEntypo style={{paddingTop:3}} name="location-pin" size={17} color="gray"/>
                                <Text style={{fontSize:15}}>  { apiData[0]?.Address}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'start',paddingTop:8}}>
                      
                                <Text style={{fontSize:14,lineHeight:20,color:"grey"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis .</Text>
                            </View>
                         </View>
                         <View style={{flexDirection:'row',justifyContent:'center',marginTop:40}}>
                          <TouchableOpacity onPress={handleCallButtonPress}>
                          {/* <TouchableOpacity onPress={async()=>{ await AsyncStorage.clear()}}> */}
                           <View style={{backgroundColor:colors.appBackgroundColor,paddingVertical:15,paddingHorizontal:25,borderRadius:7,elevation:2}}>
                              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <IconFontAwesome name="phone" size={22} color="white"/>
                                <Text style={{color:'white',fontSize:18}}>  Contact now</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                         </View>
                       </View>
                    )
                },
                Tours:()=>{
                    return (
                        <View style={{  backgroundColor: '#fff',height:'100%'  }} >
                        <View style={{width:'100%'}}>
                         <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,paddingHorizontal:20}}>
                            <Text style={{fontSize:17,fontWeight:400,color:colors.customBlack}}>Tour language</Text>
                            <Dropdown options={options} selectedOption={selectedOption} onSelect={handleSelect} />
                         </View>
                        </View>
                       
                       <View>
                       <View style={{paddingVertical:0,paddingHorizontal:20,}}>
                        <Text style={{fontSize:17,fontWeight:400,color:"red"}}>Places</Text>
                          {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{flexDirection:'row'}}>
                            </ScrollView> */}
                           
                          
                           <ListingAudio apiData={apiData} filePath={filePath}/> 
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',marginTop:15}}>
                           <View style={{backgroundColor:colors.appBackgroundColor,paddingVertical:15,paddingHorizontal:25,borderRadius:7,elevation:2}}>
                              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <IconEntypo name="controller-play" size={18} color="white"/>
                                <Text style={{color:'white',fontSize:18,paddingLeft:15}}>Start tour</Text>
                             </View>
                           </View>
                        </View>
                      </View> 
                         {/* <TouchableOpacity onPress={()=>{
                          setLoading(true)
                          checkPermission('multi',apiData[0])

                         }}>
                          <View style={{flexDirection:'row',justifyContent:'center',marginTop:15}}>
                         <View style={{backgroundColor:colors.appBackgroundColor,paddingVertical:15,paddingHorizontal:25,borderRadius:7,elevation:2}}>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                              
                              <Text style={{color:'white',fontSize:18,paddingLeft:15}}>Sync now</Text>
                           </View>
                         </View>
                      </View>
                         </TouchableOpacity> */}
                     
                      </View>
                    )
                },
              })}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
              initialLayout={{ width: layout.width }}
    />
       </View>  }
</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  videoOverLay:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust opacity as needed
    borderRadius: 8,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
    height:250,
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

export default PlaceDetails

 