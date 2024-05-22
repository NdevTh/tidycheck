import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { retrievePhotosFromDB, deletePhotoFromDB } from './Database.js';

class PhotoListScreen extends React.Component {
  constructor(props) {
    super(props);
    // Initialisation de l'état
    this.state = {
      photos: [],
      searchText: '',
      filteredPhotos: [],
    };
  }

  componentDidMount() {
    // Lancement de la récupération des photos à l'ouverture de la page
    this.fetchPhotos();
    // Répéter à chaque fois que l'utilisateur revient sur cette page
    this.unsubscribe = this.props.navigation.addListener('focus', this.fetchPhotos);
  }

  componentWillUnmount() {
    // Suppression de l'écouteur lors du démontage du composant
    this.unsubscribe();
  }

  fetchPhotos = () => {
    // Récupération des photos depuis la base de données
    retrievePhotosFromDB((photos) => {
      this.setState({ photos: photos, filteredPhotos: photos });
    });
  };

  deletePhoto = (id) => {
    // Suppression d'une photo depuis la base de données
    deletePhotoFromDB(id, (success) => {
      if (success) {
        this.fetchPhotos();
      } else {
        console.log('Erreur de suppression de la photo');
      }
    });
  };

  performSearch = () => {
    // Filtrage des photos en fonction du texte de recherche
    const filtered = this.state.photos.filter((photo) => {
      const designation = photo.designation.toLowerCase();
      const searchTextLower = this.state.searchText.toLowerCase();
      return designation.includes(searchTextLower);
    });
    this.setState({ filteredPhotos: filtered });
  };

  renderItem = ({ item }) => (
    // Affichage d'un item
    <View style={styles.container}>
      <Text>{item.designation}</Text>
      <Text>{item.quantity}</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => this.deletePhoto(item.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modifButton}
        onPress={() => this.props.navigation.navigate('PhotoModif', { photoId: item.id })}
      >
        <Text style={styles.deleteButtonText}>Modifier</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher"
            value={this.state.searchText}
            onChangeText={text => this.setState({ searchText: text }, this.performSearch)}
          />
        </View>
        <FlatList
          data={this.state.filteredPhotos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

// Définition des styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modifButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 10,
  },
});

export default PhotoListScreen;
