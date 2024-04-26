import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
    size:number
}

const Spacer = (Props:SpacerProps) =>{
    const {size}=Props
    return  <View style={{ width: size, height: size }} />
};

export default Spacer;
