import React from 'react'
import { View, Text,TextInput,FlatList,ScrollView, StyleSheet,Image, StatusBar,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import colors from '../Constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';


const HomeScreen = () => {
  const navigation = useNavigation();
    const data=[
        {
            placeName:'Taj mahal',
            imageUrl:'https://www.hlimg.com/images/stories/738X538/taj-mahal_1546927799-3874e.jpg',
            placeAddress:'Forest Colony, Tajganj, Agra',
            phone:'98-876-55482'
        },
        {
            placeName:'Eqypt pyramid',
            imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZz6EqV37iOrDiVeWP3gVl86S3nprzhxMn5g&usqp=CAU',
            placeAddress:'Al Haram Str., Giza 12611 Egypt',
            phone:'97-654-32102'
        },
        {
            placeName:'Colosseum',
            imageUrl:'https://t4.ftcdn.net/jpg/00/46/31/85/360_F_46318554_szw6m2QCmELADs1xI0gswwpOBHlJCFdu.jpg',
            placeAddress:'1, 00184 Roma RM, Italy',
            phone:'65-498-73252'
        },
        {
            placeName:'Christ the Redeemer',
            imageUrl:'https://www.thefactsite.com/wp-content/uploads/2021/08/seven-wonders-740x370.jpg',
            placeAddress:'central Rio de Janeiro, Brazil',
            phone:'98-876-55487'
        },
    ];
       
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.appBackgroundColor }}>
    <ScrollView>
    <StatusBar barStyle="light-content" backgroundColor={colors.appBackgroundColor} />
    <View style={{ flex: 1, backgroundColor: '#fff', borderBottomWidth: 0 ,alignItems:'center'}}>
       <View style={{width:'100%',backgroundColor:colors.appBackgroundColor,textAlign:'center'}}>
            <Text style={{fontSize:20,fontWeight:700,color:'white',textAlign:'center',padding:20}}>AUDIWALK</Text>
         </View>
       <View style={{           
          backgroundColor:'white',
          elevation:5,
          borderRadius:50,
          width:'90%',
          marginTop:15,
          marginBottom:30,
          marginHorizontal:12}}>
         <View style={{
            flexDirection:'row',
            border:'grey',
            alignItems:'center',
            
            }}>
        <Icon name="search" color="grey" size={20} style={{marginLeft:20}}/>
         <TextInput
              style={{fontSize:17,paddingLeft:18}}
              placeholder="Search organization by name..."
              placeholderTextColor="grey"
              borderColor="grey"
              textAlign="center"
              color= {colors.appBackgroundColor}
                />

            </View>
       </View>
    
      {data.map((item,index)=>{
       
            return (
              <View key={index} style={{ width:'90%',backgroundColor:'white',elevation:5,padding:15,margin:5 }}>
               <TouchableOpacity onPress={()=>{navigation.navigate('PlaceDetails',{details:item})}}>
                <Image style={{  height: 200,resizeMode: 'cover',borderRadius:8 }} source={{uri:item.imageUrl}}/>
                <Text style={{textAlign:'center',paddingTop:5,fontSize:16,fontWeight:700,letterSpacing:1.2}}>{item.placeName}</Text>
                <Text style={{textAlign:'center',paddingTop:5,fontSize:14, letterSpacing:1.2}}>{item.placeAddress}</Text>
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                  <View style={{ flexDirection: 'row',alignItems: 'center',backgroundColor: '#107a5d',justifyContent: 'center',paddingHorizontal: 15,paddingVertical: 7,margin: 8,maxWidth:160,borderRadius:5,elevation:5}}>
                     <Icon name="phone" size={20} color="white"/>
                     <Text style={{textAlign: 'center',fontSize: 16,color: 'white',paddingTop: 0,marginLeft: 5,}}>  {item.phone}</Text>
                  </View>
                </View>
                </TouchableOpacity>
                </View>
            );
      })
    }
    </View>
    </ScrollView>
</SafeAreaView>
  )
}


const styles = StyleSheet.create({
    
})

export default HomeScreen;