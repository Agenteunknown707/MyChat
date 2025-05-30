import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default () => {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleEnter = () => {
        if (username.trim() !== '') {
            Keyboard.dismiss(); // Oculta el teclado
            router.push({ pathname: '/chat', params: { user: username } });
        }
    };

    return (
        <SafeAreaView style={style.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Text style={style.title}>Bienvenido al chat</Text>

            <TextInput
                style={style.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={handleEnter}
                returnKeyType="done"
            />

            <TouchableOpacity
                style={style.button}
                onPress={handleEnter}
            >
                <Text style={style.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Link href="/settings" asChild>
                <TouchableOpacity>
                    <Text style={style.link}>Configuración</Text>
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff0f5', // rosa muy claro (lavanda/rosado pastel)
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#d63384', // rosa fuerte aesthetic
        fontFamily: 'sans-serif-medium',
    },
    input: {
        width: '90%',
        height: 52,
        borderColor: '#f8c2d0',
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fffafc',
        marginBottom: 16,
        shadowColor: '#f8c2d0',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#ff69b4', // rosa vibrante
        paddingVertical: 14,
        paddingHorizontal: 34,
        borderRadius: 16,
        shadowColor: '#ff69b4',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    link: {
        marginTop: 22,
        fontSize: 16,
        color: '#d63384', // rosa aesthetic
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
});