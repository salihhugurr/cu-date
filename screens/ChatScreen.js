import React from "react";
import { View, Text,SafeAreaView } from "react-native";
import CustomHeader from "../components/CustomHeader";
import ChatList from "../components/ChatList";

export const ChatScreen = () => {
  return (
    <SafeAreaView>
      <CustomHeader title={"Chat"}/>
        <ChatList/>
    </SafeAreaView>
  );
};
