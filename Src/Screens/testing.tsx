import React, { useEffect,useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import Required Components
import {StyleSheet,Text,View,TouchableOpacity,PermissionsAndroid,Image,Platform,SafeAreaView} from 'react-native';
// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import LottieView from 'lottie-react-native';
import LottieLoading from '../Components/lottie-loading';

const TestingScreen = () => {
  const [apiData,setApiData] = useState<any>([])
  const REMOTE_IMAGE_PATH =
    'https://img.freepik.com/free-photo/pink-sky-background-with-crescent-moon_53876-129048.jpg'

  const [showLoading,setLoading] = useState(true)
  const checkPermission = async (downloadType:string,data:any) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
         {
          title:   'Storage Permission Required',
          message: 'App needs access to your storage to download content',
         }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
        console.log('Download type',downloadType);

        if(downloadType !== 'single'){
          downloadMultiFiles(data);
        }
        else{
           downloadSingleFile(data);
        }
      } else {
        // If permission denied then show alert
        console.log('Storage Permission Not Granted');
      }
       } catch (err) {
      // To handle permission related exception
        console.warn(err);
    }
  
};

const downloadMultiFiles = (data:any) => {
  try{
 
  const { config, fs } = RNFetchBlob;
  let PictureDir = fs.dirs.PictureDir; 
  setLoading(true);
   data.Areas.forEach((area:any) => {
    area.AreaContents.forEach((content:any) => {
      content.ContentFiles.forEach((file:any) => {
        const options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: false,
            mediaScannable: true,
            mime: file.Type === 0 ? 'image/jpeg' : 'audio/mp3',
            title: file.Link,
            path: PictureDir + '/audiwalknew/' + file.Link,
          },
          visible:true,
          useDownloadManager: true,
          notification: false,
          mediaScannable: true,
          title: file.Link,
          path: PictureDir + '/audiwalknew/' + file.Link,
        };
        
        config(options)
          .fetch('GET', file.Path)
          .then((res) => {
            console.log('Downloaded file:', file.Name);
          })
          .catch((error:string) => {
            console.error('Error downloading file:', error);
          });
      });
    });
  });
  setLoading(false)
  }
    catch(e:any){
      console.log(e.toString())
    }
};

const downloadSingleFile = (dataSingle:any) => {
  if (!dataSingle) {
    console.error('apiData or its properties are undefined.',dataSingle);
    return;
  }
  console.log('single download path', JSON.stringify(dataSingle[0].Name));
  try {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;

   
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: dataSingle[0].Features[0].Link,
        path: PictureDir + '/audiwalk/' + dataSingle[0].Features[0].Link,
      },
      visible:true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: dataSingle[0].Features[0].Link,
      path: PictureDir + '/audiwalk/' + dataSingle[0].Features[0].Link,
    };

    config(options)
      .fetch('GET', dataSingle[0].Features[0].Path)
      .then((res: any) => {
        console.log('res -> ', JSON.stringify(res));
        console.log('Image Downloaded Successfully.');
        setLoading(false)
      });
  } catch (error) {
    console.log(error.toString());
  }
};


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
        console.log('Data set in state');
        checkPermission('single',data)
        console.log('calling for download single file');
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
      // checkPermission('single',dataIsAvail);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    setLoading(false)

  } 
};
  const filePath = 'file:///storage/emulated/0/Pictures/audiwalk/';
  useEffect(() => {

    fetchData();
  }, []);
  return (
   <View>
     {
        showLoading && <LottieLoading  />
     }
     { !showLoading &&
      <View style={styles.container}>
   
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
           Image Download 
        </Text>
      </View>
     
      <View style={{ height:250,width:200 }}>
      <LottieView
        source={require('../../assets/infinity-loading.json')} // path to your Lottie JSON file
        autoPlay
        loop
      />
    </View>
      <Image source={{uri: REMOTE_IMAGE_PATH,}}style={{width: '100%',height: 100,resizeMode: 'contain',margin: 5}}/>
      <Image source={{uri: REMOTE_IMAGE_PATH,}}style={{width: '100%',height: 100,resizeMode: 'contain',margin: 5}}/>
      <Image source={{uri: filePath + apiData[0].Features[0].Link}}
             style={{width: '100%',height: 100,resizeMode: 'contain',margin: 5}}/>
      
      <TouchableOpacity style={styles.button} onPress={() => setLoading(true)}>
      {/* <TouchableOpacity style={styles.button} onPress={() => checkPermission('multi', apiData[0])}> */}
      {/* <TouchableOpacity style={styles.button} onPress={async()=>{downloadMultiFiles}}> */}
        <Text style={styles.text}>Download Image</Text>
      </TouchableOpacity>
      
    </View>
    }
   </View>
  );
};

export default TestingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop:30
  },
  button: {
    width: '70%',
    padding: 10,
    backgroundColor: '#00BFFF',
    margin: 10,
    height:50
  },
  text: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
});