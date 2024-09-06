import { StyleSheet } from "react-native";
import {
    useResponsiveHeight,
    useResponsiveWidth
  } from "react-native-responsive-dimensions";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";

export const CommonStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer:{
        backgroundColor:"#2467EC",
        width: useResponsiveWidth(88),
        height:useResponsiveWidth(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },
    doStyles:{
        backgroundColor:"#C6C7CC",
        width: useResponsiveWidth(2.5),
        height: useResponsiveWidth(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },
    activeDostyle:{
        backgroundColor: "#2467Ec",
        width: useResponsiveWidth(2.5),
        height: useResponsiveWidth(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },
    title: {
        fontSize: hp("3.5%"),
        textAlign: "center",
      },
      description: {
        fontSize: hp("2.5%"),
        color: "#575757",
        textAlign: "center",
      },
      input: {
        height: 55,
        marginHorizontal: 16,
        borderRadius: 8,
        paddingLeft: 35,
        fontSize: 16,
        backgroundColor: "white",
        color: "#A1A1A1",
      },
      errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        position: "absolute",
        top: 60,
      },
})