import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import AttendanceScreen from '../../components/AttendanceScreen';
import LeaveScreen from '../../components/LeaveScreen'


const index = () => {

  const route = useRoute();
  const leave = route.params;
  // const emp_data_id = leave.id
  return (
    <View style={{ flex: 1,
        
        }}>
            <LeaveScreen/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})