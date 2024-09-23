import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import ProfileScreen from '../../components/ProfileScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {
  const { state } = useContext(AppContext);

  return (
    <SafeAreaView>
      <ProfileScreen/>
      {/* <Text>Profile</Text> */}
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({})