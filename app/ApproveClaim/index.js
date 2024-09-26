import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import ApproveLeave from '../../components/ApproveLeave'
import { useRoute } from '@react-navigation/native';
import ApproveClaim from '../../components/ApproveClaim';

const index = () => {

  const route = useRoute();
  const leave = route.params;
  const emp_data_id = leave.id
  // const extractedEmpData = route.params.leave?.map((leave) => leave.emp_data);
  console.log(emp_data_id,"data--->")
  return (
    <View style={{ flex: 1,
        
        }}>
            <ApproveClaim/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})