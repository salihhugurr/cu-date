import React, { useLayoutEffect } from "react";
import { View, Text, Button, ImageBackground } from "react-native";
import useAuth from "../hooks/useAuth";
import { TouchableOpacity } from "react-native";
import tw from "tailwind-rn";

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        style={tw("flex-1")}
        resizeMode="cover"
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
        >
          <Text style={tw("font-semibold text-center")}>
            Sign in & Get Swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
