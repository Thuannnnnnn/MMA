import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen"

import {
    responsiveHeight,
    responsiveWidth,
  } from "react-native-responsive-dimensions";
  import {
    useResponsiveHeight,
    useResponsiveWidth
  } from "react-native-responsive-dimensions";

const styles = StyleSheet.create({
    firstContainer:{
        alignItems: "center",
        marginTop: 50,
    },
    logo:{
        width: wp("30%"),
        height: hp("15%"),
        position: "relative",
        right: "-28%"
    },
    titleWrapper:{
        flexDirection:"row"
    },
    titleTextShape1:{
        position: "absolute",
        left: -28,
        top: -20
    },
    titleText:{
        fontSize: hp("4%"),
        textAlign: "center",
        fontWeight: 700,
    },
    titleTextShape2:{
        position: "absolute",
        right : -40,
        top: -20
    },
    titleTextShape3:{
        position: "absolute",
        left: 60
    },
    dscpWrapper:{
        marginTop: 30
    },
    dscpText:{
        textAlign: "center",
        color: "#575757",
        fontSize: hp("2%")
    },
    buttonWrapper:{
        backgroundColor: "#2467EC",
        width: wp("92%"),
        paddingVertical: 18,
        borderRadius: 4,
        marginTop: 50,
        color: "#F6F7F9"
    },
    buttonText:{
        color: "#fff",
        fontSize: hp("2%"),
        textAlign: "center",
        fontWeight: 600
    },
    welcomeButtonStyle:{
        backgroundColor: "#2467EC",
        width: responsiveWidth(92),
        height: responsiveHeight(5.5),
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        
      },
      title: {
        fontSize: hp("4%"),
        textAlign: "center",
        fontWeight: 700,
        top: -60
      },
      description: {
        fontSize: hp("2.5%"),
        color: "#575757",
        textAlign: "center",
        top: -40
      },
      
})

export default styles