import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddClaim from '../../components/AddClaim'

import { useRoute } from '@react-navigation/native';

const index = () => {

  const route = useRoute();
  const leave = route.params;
  const emp_data_id = leave.id
  console.log(emp_data_id,"data--->")
  return (
    <View style={{ flex: 1,
        
        }}>
            <AddClaim/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})