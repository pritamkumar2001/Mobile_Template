import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LeaveScreen from './../../components/LeaveScreen'
import ApplyLeave from '../../components/ApplyLeave'

const index = () => {
  return (
    <View style={{ flex: 1,
        
        }}>
            <ApplyLeave/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})