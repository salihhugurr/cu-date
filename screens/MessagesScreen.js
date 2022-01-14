import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Keyboard, FlatList
} from "react-native";
import CustomHeader from "../components/CustomHeader";
import ChatList from "../components/ChatList";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import {useRoute} from "@react-navigation/native";
import tw from "tailwind-rn";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import {collection, addDoc, serverTimestamp, orderBy, onSnapshot, query,doc,setDoc} from "@firebase/firestore";
import {db} from "../firebase";
import firebase from "firebase/compat";

export const MessagesScreen = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const {user} = useAuth();
    const {params} = useRoute();
    const {matchDetails} = params;

    useEffect(() => {
        return onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')),
            snapshot => setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))))
    },
        [matchDetails])

    const sendMessage = () => {
        console.log("messages", messages)
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input
        });
        setInput("");
    }
    return (
        <SafeAreaView style={tw("flex-1")}>
            <CustomHeader callEnabled title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw("flex-1")}
                keyboardVerticalOffset={10}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList data={messages} style={tw("pl-4")}
                              keyExtractor={item => item.id}
                              inverted={-1}
                              renderItem={({item: message}) =>
                                  message.userId === user.uid ?
                                      <SenderMessage key={message.id} messages={message}/> :
                                      <ReceiverMessage key={message.id} messages={message}/>
                              }
                    />
                </TouchableWithoutFeedback>

                <View
                    style={tw("flex-row justify-between items-center border-t border-gray-200 px-5 py-2")}
                >
                    <TextInput
                        style={tw("h-10 text-lg")}
                        placeholder={"Send a message..."}
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button onPress={sendMessage} title="Send" color="#FF5864"/>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};
