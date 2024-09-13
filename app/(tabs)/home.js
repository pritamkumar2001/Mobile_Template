import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
const home = () => {
  const { state } = useContext(AppContext);

  return (
    <View style={{padding:30}}>
      <Text>{state}</Text>
    </View>
  )
}

export default home

const styles = StyleSheet.create({})