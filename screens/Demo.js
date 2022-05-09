import React, { useState, useEffect } from "react";
import {
    ImageBackground,
    Image,
    StyleSheet,
    StatusBar,
    Dimensions,    
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import Controles from "../components/Controles";

const { height, width } = Dimensions.get("screen");

import { Images, argonTheme } from "../constants";



const Demo = (props) => {

    const { navigation } = props;

    useEffect(()=>{                            
        //console.log(navigation);
      },[]);
   
    
    return (
        <Block flex style={styles.container}>            
            <Block flex center>
                <ImageBackground
                    source={Images.Onboarding}
                    style={{ height, width, zIndex: 1 }}
                />
            </Block>
            <Block center>
                <Image source={Images.LogoOnboarding} style={styles.logo} />
            </Block>
                  
            <Controles/>
        </Block>
    );

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.BLACK
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        position: "relative",
        bottom: theme.SIZES.BASE,
        zIndex: 2,
    },
    button: {
        width: width - theme.SIZES.BASE * 4,
        height: theme.SIZES.BASE * 3,
        shadowRadius: 0,
        shadowOpacity: 0
    },
    logo: {
        width: 200,
        height: 60,
        zIndex: 2,
        position: 'relative',
        marginTop: '-70%'
    },
    title: {
        marginTop: '-5%'
    },
    subTitle: {
        marginTop: 20
    },
    recorder_stop: {
        width: 150,
        height: 150,
        margin: 20,
        marginLeft: 1,
    },
    play_pause: {
        width: 80,
        height: 60,
        marginTop: 45,

    },
    send: {
        width: 80,
        height: 60,
        marginTop: 45,
        marginLeft: -10
    },
    block_row: {
        flexDirection: "row",
        marginBottom: 45,
    }

});

export default Demo;