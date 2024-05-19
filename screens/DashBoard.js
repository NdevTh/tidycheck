import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Dashboard(props) {
  const navigation = useNavigation();

  const goToCameraScreen = () => {
    navigation.navigate('CameraScreen');
  };

  console.log(props);
  return (
    <View>
      <Header title="Vous êtes connectés" />
      <Paragraph>Bienvenue {props.route.params.username}</Paragraph>
      <Paragraph>Commencer à prendre une photo</Paragraph>
  
      <Button onPress={goToCameraScreen} title="Prendre une photo" />

      <Button onPress={() => navigation.navigate('PhotoListScreen')} title="Afficher les photos" />
      <Button onPress={() => navigation.navigate('HomePage')} title="Déconnexion" />
    </View>
  );
}
