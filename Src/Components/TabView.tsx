import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#fffff' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#fffff' }} />
);
const ThirdRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#fffff' }} />
  );
const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third:ThirdRoute
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Image-1' },
    { key: 'second', title: 'Hindi-1'},
    {key:'third',title:'English-1'}
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}