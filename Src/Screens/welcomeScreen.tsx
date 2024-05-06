import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import colors from '../Constants/colors';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../Components/Sizer';
import Geolocation from '@react-native-community/geolocation';
const WelcomeScreen = () => {
  let dataCheck = '';
  const navigation = useNavigation();
  const [location, setLocation] = useState(false);
  const [showLoading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>([]);
  const filePath =
    'file:///storage/emulated/0/Android/data/com.audiwalknew/files/';
  useEffect(() => {
    const reqPermission = async () => {
      try {
        const permission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.MEDIA_LIBRARY
            : Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
            : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

        const value = await request(permission);
        console.log(Platform.Version, 'value is: ', value);
      } catch (e) {
        ToastAndroid.show(
          `Permission denied in useEffect  -  ${e}`,
          ToastAndroid.SHORT,
        );
        console.log('from use effect ', e);
      }
    };
    console.log('useEffect in welcome screen before req');
    reqPermission();
    console.log('useEffect in welcome screen');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataCheck = await AsyncStorage.getItem('apiData');

      if (!dataCheck) {
        const response = await fetch(
          'https://portal.audiwalk.com/api/GetOrganizationByName?name=Khazana%20Mahal',
        );
        if (response.status === 200) {
          console.log('status : 200');
          const data = await response.json();
          await AsyncStorage.setItem('apiData', JSON.stringify(data));
          setApiData(data);
          console.log('Data stored in AsyncStorage');
        } else {
          ToastAndroid.show(
            'Something went wrong,Check internet or restart the application',
            ToastAndroid.SHORT,
          );
          console.log('Error:', response);
        }
        setLoading(false);
      } else {
        const dataIsAvail = JSON.parse(dataCheck);
        console.log('dataCheck', dataIsAvail[0].Features[0].Link);
        console.log('exact location lat', dataIsAvail[0].Latitude);
        console.log('exact location longi', dataIsAvail[0].Longitude);
        setApiData(dataIsAvail);
        
        setLoading(false);
        //  checkPermission('single',dataIsAvail);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      ToastAndroid.show(
        'Something went wrong,Check internet or restart the application',
        ToastAndroid.SHORT,
      );
    }
  };

  const checkPermission = async (data: any) => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MEDIA_LIBRARY
          : Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

      const granted = await request(permission);
      if (granted === 'granted') {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');

        downloadSingleFile(data);
      } else {
        // If permission denied then show alert
        ToastAndroid.show('Permission denied', ToastAndroid.SHORT);
        console.log('Storage Permission Not Granted', granted);
        setLoading(false);
      }
    } catch (err) {
      ToastAndroid.show(
        'Requesting permission got problem',
        ToastAndroid.SHORT,
      );
      // To handle permission related exception
      console.warn(err);
    }
  };

  const downloadSingleFile = async (dataSingle: any) => {
    try {
      if (!dataSingle) {
        console.error('apiData or its properties are undefined.', dataSingle);
        return;
      }
      const fileName = dataSingle[0].Features[0].Link;// image link
      // Check if file already exists
      const fileInfo = await RNFS.exists(filePath + fileName);

      // If file exists, return without downloading
      if (fileInfo) {
        setLoading(false);
        console.log('File already exists in the:', filePath + fileName);
        navigation.navigate('PlaceDetails');
        return;
      }
      try {
        await RNFS.downloadFile({
          fromUrl: dataSingle[0].Features[0].Path,//khazana mahal image
          toFile: filePath + fileName,
        })
          .promise.then((result: any) => {  
            console.log('download success', result);
            console.log('File downloaded successfully:');
            setLoading(false);
            navigation.navigate('PlaceDetails');
          })
          .catch((error: any) => {
            console.log('error to download', error);
          });
      } catch (error) {
        console.error('Error downloading file:', error);
        setLoading(false);
      } // Initiate file download
    } catch (error) {
      console.error('Error downloading file===', error);
      setLoading(false);
    }
  };

  const requestLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask me later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok',
        },
      );
      console.log('location permission granted');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('you cannot use Geolocation');
        return false;
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
      return false;
    }
  };
  const permission = async () => {
    try {
      const granted = await requestLocation();
      console.log('permission granted', granted);
      if (granted) {
        Geolocation.getCurrentPosition(
          position => {
            console.log('position', position);
            console.log('apilat', apiData[0].Latitude);
            console.log('apilan', apiData[0].Longitude);
            if (
              position.coords.latitude === 9.50306 && position.coords.longitude ===77.586115
            ) {
              navigation.navigate('PlaceDetails');
            }
             else 
            {
              setLoading(false); 
              Alert.alert('Title', 'You are not in khazana mahal', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('WelcomeScreen'),
                },
              ]);
              
            }
            
          },
          error => {
            console.log('Error getting location:', error.code, error.message);
            setLocation(false);
            
          },
          {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 10000,
          },
        );
      }
      else{
        setLoading(false);
      Alert.alert('Location Permission Denied', 'Please grant location permission to continue.');
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
      setLoading(false);
    }
  };

  // const getCurrentLocation=()=>{
  //   setLoading(true);
  //   Geolocation.getCurrentPosition(
  //     position=>{
  //       setLoading(false);
  //       const latitude=position.coords.latitude;
  //       const longitude=position.coords.longitude;
  //       console.log('Latitude',latitude);
  //       console.log('Longitude',longitude);
  //       compareLocation(latitude,longitude);
  //     },
  //     error=>{
  //       setLoading(false);
  //       console.error('Error getting location:',error.code,error.message);
  //       Alert.alert('Error','Failed to get Location');
  //     },
  //     {
  //       enableHighAccuracy:true,timeout:30000,
  //       maximumAge:10000
  //     }
  //   )
  // }

  // const compareLocation=(latitude:any,longitude:any)=>{
  //   const desiredLat=9.50306;
  //   const desiredLong=77.586115;
  //   const thres=0.0001;
  //   const withinRange=Math.abs(latitude-desiredLat)<thres && Math.abs(longitude-desiredLong)<thres;
  //     console.log(withinRange);
      
  //   if(withinRange){
  //     console.log('User is within the desired location range');
  //     navigation.navigate('PlaceDetails');
  //     checkPermission(apiData);

  //   }
  //   else{
  //     Alert.alert('Location Alert','You are not in desired location',[
  //       {
  //         text:'Ok',onPress:()=>navigation.navigate('WelcomeScreen')
  //       }
  //     ])
  //   }
  // }

  // const handleGetStarted=async()=>{
  //   const hasPermission=await requestLocation();
  //   if(hasPermission){
  //     getCurrentLocation();
  //   }
  //   else{
  //     Alert.alert('Permission Denied');
  //   }
  // }
  return (
    <View
      style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      {showLoading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={60} color="green" />
          <Spacer size={25} />
          <Text>Please wait....</Text>
        </View>
      )}

      {!showLoading && (
        <TouchableOpacity
          style={[
            style.button,
            {
              backgroundColor: colors.appBackgroundColor,
              marginTop: 25,
              elevation: 5,
            },
          ]}
          onPress={() => {
             permission();
             setLoading(true);
             checkPermission(apiData)
          }}>
          <Text style={style.buttonText}>Get started </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    paddingVertical: 25,
    paddingHorizontal: 60,
    marginRight: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default WelcomeScreen;
