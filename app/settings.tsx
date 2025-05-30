import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const router = useRouter();
    const [serverAddress, setServerAddress] = useState("http://localhost:3000");

    useEffect(() => {
        (async () => {
            const localServerAddress = await AsyncStorage.getItem("serverAddress");
            if (localServerAddress) {
                setServerAddress(localServerAddress);
            }
        })();
    }, []);

    const handleSave = async () => {
        if (serverAddress.trim() === "") return;

        try {
            await AsyncStorage.setItem("serverAddress", serverAddress);
            Keyboard.dismiss();
            router.back();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={style.container}>
            <Text style={style.label}>Dirección del Servidor</Text>

            <TextInput
                style={style.input}
                value={serverAddress}
                onChangeText={setServerAddress}
                placeholder="http://tu-servidor.com"
                onSubmitEditing={handleSave}
                returnKeyType="done"
            />

            <TouchableOpacity style={style.button} onPress={handleSave}>
                <Text style={style.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff0f5', // Rosa pastel muy claro (fondo)
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#b03060', // Rosa fuerte estilo cereza
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 4,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fffafa', // Casi blanco con un toque rosa
        borderColor: '#f8cdda', // Borde rosita pastel
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        shadowColor: '#ff69b4', // Sombras rosadas sutiles
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2, // Para Android
    },
    button: {
        backgroundColor: '#ff69b4', // Rosa brillante
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 14,
        shadowColor: '#ff69b4',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 4, // Android
    },
    buttonText: {
        color: '#fffafa', // Blanco rosado
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});