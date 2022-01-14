import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import tw from "tailwind-rn";
import {useNavigation} from "@react-navigation/core";
import {collection, onSnapshot, query, where} from "@firebase/firestore";
import {db} from "../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "./ChatRow";
import firebase from "firebase/compat";

const ChatList = () => {
    const {user} = useAuth()
    const [matches, setMatches] = useState([]);
    const navigation = useNavigation()

    useEffect(() =>
            onSnapshot(query(collection(db, 'matches'), where('usersMatched', 'array-contains', user.uid)),
                snapshot => {
                    setMatches(snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })))
                })
        , [user])
    return (
        matches.length>0 ?
        <FlatList
            data={matches} keyExtractor={item=>item.id}
            renderItem={({item}) => <ChatRow matchDetails={item}/>}
        /> :
            <View style={tw("p-5")}>
                <Text style={tw("text-center text-lg")}>No matches at the moment 🥺</Text>
            </View>
    )

}
export default ChatList;