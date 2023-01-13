import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    info: {
        backgroundColor: 'lightblue',
        paddingVertical: 16,
        width: "40%",
        marginTop: 25,
    },
    input: {
        backgroundColor: '#fff',
        width: "60%",
        marginTop: 26,
        height: 51,
        borderWidth: 0.3,
        borderColor: "gray"
    },
    nav: {
        //alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'lightblue',
        paddingVertical: 8,
        width: "20%",
        marginTop: 25,
    },
    des: {
        backgroundColor: 'lightblue',
        paddingVertical: 8,
        width: "25%",
        marginTop: 25,
    },
    tour: {
        backgroundColor: 'lightblue',
        paddingVertical: 8,
        width: "15%",
        marginTop: 25,
    },
    textStyle: {
        fontWeight: "bold", 
        paddingLeft: 10, 
        color: "orange", 
        paddingVertical: 8,
        fontSize: 15
    },
    show: {
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        width: "30%",
        alignSelf: "flex-end",
        marginTop: 0.4
    }

})

export default styles