import React, { useState, useEffect } from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { connectSocket } from "../../src/sockets";
import { Socket } from "socket.io-client";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage } from "../../src/chatMessage";
import { useLocalSearchParams } from "expo-router";

type MessageBubbleProps = {
    ChatMessage: ChatMessage;
    mySocketId?: string;
};

const MessageBubble = ({ ChatMessage, mySocketId }: MessageBubbleProps) => {
    const ownMessage = ChatMessage.socketId === mySocketId;
    const bubbleStyle = ownMessage ? styles.mimensaje : styles.tumensaje;

    return (
        <View style={bubbleStyle}>
            {!ownMessage && <Text style={styles.username}>{ChatMessage.user}</Text>}
            <Text style={styles.messageText}>{ChatMessage.message}</Text>
        </View>
    );
};

type lsp = {
    user: string;
};

export default function ChatScreen() {
    const { user } = useLocalSearchParams<lsp>();
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isloading, setLoading] = useState<boolean>(true);
    const [mySocketId, setMySocketId] = useState<string>();
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const setupSocket = async () => {
            try {
                const newSocket = await connectSocket(user);
                if (newSocket) {
                    setSocket(newSocket);
                    console.log("Socket conectado, enviando join...");
                    newSocket.emit("join", { username: user });
                }
            } catch (error) {
                console.error("Error al conectar socket:", error);
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            console.log("Socket conectado, enviando join...");
            setMySocketId(socket.id);
            socket.emit("join", { username: user });
        });

        socket.on("users:update", () => {
            console.log("Usuario registrado correctamente");
            setIsRegistered(true);
            setLoading(false);
        });

        socket.on("message", (message: ChatMessage) => {
            setMessages((messages) => [...messages, message]);
        });

        return () => {
            socket.off("message");
            socket.off("users:update");
            socket.off("connect");
        };
    }, [socket]);

    const sendMessage = () => {
        if (message.trim() && isRegistered) {
            socket?.emit("message", message);
            setMessage("");
        } else if (!isRegistered) {
            console.log("Usuario no registrado aún, no se puede enviar mensaje");
        }
    };

    if (isloading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <MessageBubble ChatMessage={item} mySocketId={mySocketId} />
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Escribe un mensaje"
                />
                <Button title="Mandar" onPress={sendMessage} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
    },
    mimensaje: {
        marginVertical: 6,
        backgroundColor: "#ff85a2",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        alignSelf: "flex-end",
        maxWidth: "80%",
        shadowColor: "#ff85a2",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    tumensaje: {
        marginVertical: 6,
        backgroundColor: "#fce4ec",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        alignSelf: "flex-start",
        maxWidth: "80%",
        shadowColor: "#f8bbd0",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    username: {
        fontWeight: "bold",
        marginBottom: 4,
        color: "#555",
    },
});
