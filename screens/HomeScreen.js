import {useNavigation} from "@react-navigation/core";
import React, {useLayoutEffect, useRef, useState, useEffect} from "react";
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import {AntDesign, Entypo, Ionicons} from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {doc, onSnapshot, collection, setDoc, getDocs, getDoc, query, where} from "@firebase/firestore";
import {db} from "../firebase";
import generateId from "../lib/generateId";
import {serverTimestamp} from "firebase/firestore";

export const HomeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);

    useLayoutEffect(
        () =>
            onSnapshot(doc(db, "users", user.uid), (snapshot) => {
                if (!snapshot.exists()) {
                    navigation.navigate("Modal");
                }
            }),
        []
    );

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            const swipes = await getDocs(collection(db, "users", user.uid, "swipes")).then(snapshot => snapshot.docs.map((doc) => doc.id))
            const passes = await getDocs(collection(db, "users", user.uid, "passes")).then(snapshot => snapshot.docs.map((doc) => doc.id))
            console.log("passess", passes.length)
            const passedUserIds = passes.length > 0 ? passes : ['test']
            const swipedUserIds = swipes.length > 0 ? swipes : ['test']
            console.log("passedUserIds", passedUserIds)
            unsub = onSnapshot(query(collection(db, "users"), where("id", "not-in", [...passedUserIds,...swipedUserIds])), snapshot => {
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== user.uid).map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                )
            })
        }
        fetchCards();
        return unsub;
    }, [])

    const swipeLeft = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped)

    }

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const matchId = generateId(userSwiped.id,user.uid);
        console.log(userSwiped.id)
        console.log(user.uid)
        console.log("generated id",matchId)
        const loggedInProfile = await (await getDoc(doc(db,"users",user.uid))).data()
        console.log("loggedInProfile",loggedInProfile)
        //Check if the user swiped on you
        getDoc(doc(db,'users',userSwiped.id,'swipes',user.uid)).then(documentSnapshot=>{
            if(documentSnapshot.exists()){
                console.log(`Congratulations,you have matched with ${userSwiped.displayName}`)
                //user has matched you before you matched
                setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
                //CREATE A MATCH
                setDoc(doc(db,'matches',generateId(user.uid,userSwiped.id)),{
                    users:{
                        [user.uid]:loggedInProfile,
                        [userSwiped.id]:userSwiped
                    },
                    usersMatched:[user.uid,userSwiped.id],
                    timestamp:serverTimestamp()
                });
                navigation.navigate('Match',{loggedInProfile,userSwiped})
            } else {
                //User has swiped as first interaction between the two or didn't get swiped on
                console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`)
                setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
            }
        })
    }

    return (
        <SafeAreaView style={tw("flex-1 bg-white")}>
            {/* HEADER */}
            <View style={tw("flex-row items-center relative justify-between px-5")}>
                <TouchableOpacity onPress={logout}>
                    <Image
                        style={tw("h-10 w-10 rounded-full")}
                        source={{uri: user.photoURL}}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image
                        style={tw("h-14 w-14 rounded-full")}
                        source={require("../assets/logo.jpeg")}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864"/>
                </TouchableOpacity>
            </View>

            {/* END OF HEADER */}

            {/* CARDS */}

            <View style={tw("flex-1")}>
                <Swiper
                    cards={profiles}
                    ref={swipeRef}
                    containerStyle={{backgroundColor: "transparent"}}
                    stackSize={5}
                    cardIndex={0}
                    backgroundColor="#4FD0E9"
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log("Swiped Pass");
                        swipeLeft(cardIndex)
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log("Swiped Match");
                        swipeRight(cardIndex)
                    }}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4DED30",
                                },
                            },
                        },
                    }}
                    renderCard={(card) =>
                        card ? (
                            <View
                                key={card.id}
                                style={tw("relative bg-white h-3/4 rounded-xl")}
                            >
                                <Image
                                    style={tw("absolute top-0 h-full w-full rounded-xl")}
                                    source={{uri: card.photoURL}}
                                />

                                <View
                                    style={[
                                        tw(
                                            "absolute bottom-0 bg-white justify-between items-center flex-row h-20 w-full px-6 py-2 rounded-b-xl"
                                        ),
                                        styles.cardShadow,
                                    ]}
                                >
                                    <View>
                                        <Text style={tw("text-xl font-bold")}>
                                            {card.displayName}
                                        </Text>
                                        <Text style={tw("")}>{card.job}</Text>
                                    </View>
                                    <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                                </View>
                            </View>
                        ) : (
                            <View
                                style={[
                                    tw(
                                        "relative bg-white h-3/4 rounded-xl justify-center items-center"
                                    ),
                                    styles.cardShadow,
                                ]}
                            >
                                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                                <Image
                                    style={tw("h-20 w-full")}
                                    height={100}
                                    width={100}
                                    source={{uri: "https://links.papareact.com/6gb"}}
                                />
                            </View>
                        )
                    }
                />
            </View>

            <View style={tw("flex flex-row justify-evenly")}>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    style={tw(
                        "items-center justify-center rounded-full w-16 h-16 bg-red-200"
                    )}
                >
                    <Entypo name="cross" size={28} color="red"/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    style={tw(
                        "items-center justify-center rounded-full w-16 h-16 bg-green-200"
                    )}
                >
                    <AntDesign name="heart" size={28} color="green"/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});
