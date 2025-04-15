import { StyleSheet } from "react-native";

export default StyleSheet.create({
    login: {
        flex: 1,
        paddingVertical: 60,
        paddingHorizontal: 40,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'left',
        gap: 20
    },
    guestInput: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#262626'
    },
    loginHeaderText: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    inputLabel:{
        fontSize: 16
    }
})