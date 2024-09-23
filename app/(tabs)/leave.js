import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LeaveScreen from '../../components/LeaveScreen'
import { SafeAreaView } from 'react-native-safe-area-context';

const leave = () => {
  return (
    <SafeAreaView>
      <LeaveScreen/>
    </SafeAreaView>
  )
}

export default leave

const styles = StyleSheet.create({})