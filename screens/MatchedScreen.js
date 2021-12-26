import React from "react";
import {View,Text,TouchableOpacity,Image} from "react-native";
import tw from "tailwind-rn";
import {useNavigation} from "@react-navigation/core";
import {useRoute} from "@react-navigation/native";

const MatchedScreen = () => {
    const navigation = useNavigation();
    const {params} = useRoute();
    const {loggedInProfile,userSwiped}=params;
    return (
        <View style={[tw("h-full bg-red-400 pt-20"),{opacity:.95}]}>
            <View style={tw("justify-center px-10 pt-20")}>
                <Image
                    style={tw("h-20 w-full")}
                    source={{uri:"https://links.papareact.com/mg9"}}/>
            </View>
            <Text style={tw("text-center text-white mt-5")}>
                You and {userSwiped.displayName} have liked each other.
            </Text>
            <View style={tw("flex-row justify-evenly mt-5")}>
                <Image
                 style={tw("h-32 w-32 rounded-full")}
                 source={{uri:loggedInProfile.photoURL}}
                />
                <Image
                    style={tw("h-32 w-32 rounded-full")}
                    source={{uri:userSwiped.photoURL}}
                />
            </View>
            <TouchableOpacity
            style={tw("bg-white m-5 px-5 py-5 rounded-full mt-20")}
            onPress={()=>{
                navigation.goBack();
                navigation.navigate("Chat")
            }}
            >
                <Text style={tw("text-center")}>Send a Message</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MatchedScreen