import LeaveScreen from "@/components/LeaveScreen";
import { Stack } from "expo-router";
import {AppProvider} from '../context/AppContext'

export default function RootLayout() {
  return (
    <AppProvider>

    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="(tabs)" options={{headerShown:false}}></Stack.Screen>
      <Stack.Screen name="AuthScreen/index" options={{headerShown:false}}/> 
    </Stack>
    
    </AppProvider>
  );
}
