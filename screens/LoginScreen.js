import React, {useLayoutEffect} from "react";
import {View, Text, Button, ImageBackground, Image} from "react-native";
import useAuth from "../hooks/useAuth";
import {TouchableOpacity} from "react-native";
import tw from "tailwind-rn";

const LoginScreen = () => {
    const {signInWithGoogle, loading} = useAuth();

    return (
        <View style={tw("flex-1")}>
            <ImageBackground
                style={[tw("flex-1"), {opacity: .5}]}
                resizeMode="cover"
                source={{uri: "https://hips.hearstapps.com/ell.h-cdn.co/assets/cm/14/52/549ba8e764c82_-_elle-relationship-couple-tips-xln-xln.jpg"}}
            >
                <View style={{position:"absolute",top:"22%",alignSelf:"center"}}>
                    <Image
                        style={tw("h-32 w-32 rounded-full")}
                        source={require("../assets/logo2.jpeg")}
                    />
                </View>
                <TouchableOpacity
                    onPress={signInWithGoogle}
                    style={[
                        tw("absolute bottom-40 w-52 p-4 rounded-2xl"),
                        {marginHorizontal: "25%",backgroundColor:"#3e0034"},
                    ]}
                >
                    <Text style={[tw("font-semibold text-center text-white"),{color:"#b6a8ad"}]}>
                        Sign in & Get Swiping
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;
