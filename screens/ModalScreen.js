import React, { useState, useLayoutEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const ModalScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [image, setImage] = useState(
    "https://media-exp1.licdn.com/dms/image/C4E03AQHCkf8qzXOaaQ/profile-displayphoto-shrink_400_400/0/1629025790813?e=1645660800&v=beta&t=ddcu122jAcilUuYowAY1E42Mo6jQ5IRVSCXkYEneP4w"
  );
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((err) => {
        alert(error.message);
      });
  };

  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tw("text-xl text-gray-500 font-bold p-2")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step:1 The Profile Pic
      </Text>
      <TextInput
        onChangeText={setImage}
        value={image}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter a Profile Pic URL"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step:2 The Job
      </Text>
      <TextInput
        onChangeText={setJob}
        value={job}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your occupation"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step:3 The Age
      </Text>
      <TextInput
        maxLength={2}
        onChangeText={setAge}
        value={age}
        keyboardType="numeric"
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your Age"
      />

      <TouchableOpacity
        disabled={incompleteForm}
        onPress={updateUserProfile}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-10"),
          incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
      >
        <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
