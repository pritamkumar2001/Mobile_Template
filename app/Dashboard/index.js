import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LeaveScreen from './../../components/LeaveScreen'

const index = () => {
  return (
    <View style={{ flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50}}>
        <LeaveScreen></LeaveScreen>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})