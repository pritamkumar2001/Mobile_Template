import {View } from 'react-native'
import ApplyLeave from '../../components/ApplyLeave'
import { useRoute } from '@react-navigation/native';
const index = () => {
  const route = useRoute();
  const emp_data_id = route?.params?.id
  // console.log(route)
  return (
    <View style={{ flex: 1,
        
        }}>
            <ApplyLeave id={emp_data_id}/>
    </View>
  )
}

export default index