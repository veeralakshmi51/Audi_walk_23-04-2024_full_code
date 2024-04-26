import React,{useState} from 'react';
import {View,Text,TouchableOpacity,Modal,FlatList} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'; 
interface dropDownProps{
    options:string[]
    selectedOption:string
    onSelect:()=>void

}

const Dropdown = (props:dropDownProps) => {
    const {onSelect,options,selectedOption} = props;
    const [visible, setVisible] = useState(false);
 

    const toggleDropdown = () => {
      setVisible(!visible);
    };
  
    const handleSelectOption = (option:any) => {
      onSelect(option);
      toggleDropdown();
    };
  
    return (
      <View style={{ marginVertical: 20 }}>
        <TouchableOpacity onPress={toggleDropdown} style={{ elevation:5,backgroundColor:'#1c618b',paddingVertical: 8,paddingHorizontal: 25,  borderRadius: 5,  flexDirection:'row',alignItems:'center' }}>
          <Text style={{color:'white'}}>{selectedOption}   </Text>
          <Icon name="angle-down" size={25} color="white"/>
        </TouchableOpacity>
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={toggleDropdown}
        >
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={toggleDropdown}>
            <View style={{ backgroundColor: 'white',height:200,width:200}}>
                <View style={{ padding: 20, borderRadius: 5,justifyContent:'center' ,alignItems:'center'}}>
              <FlatList
                data={options}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectOption(item)} style={{ padding: 10 }}>
                    <Text style={{borderBottomWidth:0.2,paddingBottom:12,width:200,textAlign:'center'}}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.toString()}
              />
                </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  export default Dropdown;