import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, Image, View, Platform, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';

// const address = "http://10.3.55.101:5000"
export default function Test2() {
  const {userToken} = useContext(AuthContext)
  const {address} = useContext(AuthContext)
  const [image, setImage] = useState([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      aspect: [4, 6],
      quality: 1,
      allowsMultipleSelection: true
    });

    //console.log(result);

    if (!result.canceled) {
      var arr = []
      var random =  Math.floor(Math.random() * 1000)
      for(var i = 0; i < Object.keys(result.assets).length; i++){
          var temp = {
            uri: result.assets[i].uri,
            name: 'SomeImageName' + i + random + ".jpg",
            type: 'image/jpg',
          }
          arr.push(temp)
      }
      setImage(arr)
    }
  };


  async function upload() {
    try {
      const data = new FormData();
      for(var i = 0; i < image.length; i++)
        data.append("image", image[i]);
      data.append("name", "abc")
      console.log(data)
      await fetch(`${address}/destinations/upload/image`, {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {/* {image && <Image source={{ uri: image[0].uri }} style={{ width: 400, height: 300 }} />}
      {image && <Image source={{ uri: image[1].uri }} style={{ width: 400, height: 300 }} />} */}
      <Pressable onPress={upload}>
        <Text>Upload</Text>
      </Pressable>
    </View>
  );
}
