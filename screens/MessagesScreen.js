import React from "react";
import { View, Text,SafeAreaView } from "react-native";
import CustomHeader from "../components/CustomHeader";
import ChatList from "../components/ChatList";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import {useRoute} from "@react-navigation/native";

export const MessagesScreen = () => {
    const {user} = useAuth();
    const {params} = useRoute();
    const {matchDetails} = params;
    console.log("matchDetails",matchDetails)
    return (
        <SafeAreaView>
            <CustomHeader callEnabled title={getMatchedUserInfo(matchDetails?.users,user.uid).displayName}/>
        </SafeAreaView>
    );
};
