import React from "react";
import { Easing, Animated, Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Block } from "galio-framework";

// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Demo from "../screens/Demo";
import DemoLogin from "../screens/DemoLogin";
import Login from "../screens/Login";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Elements"
        component={Elements}  
        option={{
          headerTransparent: true
        }} 
      />     

      <Stack.Screen name="Demo" component={DemoStack} /> 
      
    </Stack.Navigator>
  );

}

export default function DemoLoginStack(props) {
  return (   
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="DemoLogin"
        component={DemoLogin}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name="Demo" component={DemoStack} /> 
      <Drawer.Screen name="Elements" component={ElementsStack} />      
    </Stack.Navigator>
  );
}

function DemoStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Demo"
        component={Demo}
        option={{
          headerTransparent: true
        }}
      />         
     <Drawer.Screen name="Elements" component={ElementsStack} />
    </Stack.Navigator>
  );
}



