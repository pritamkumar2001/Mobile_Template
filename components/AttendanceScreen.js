import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import * as Location from 'expo-location';
import { useNavigation, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { getProfileInfo } from './services/authServices';
import HeaderComponent from './HeaderComponent';
import { getEmpAttendance, postCheckIn } from './services/productServices';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Header = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Value = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
`;

const AttendanceButton = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => 
    props.disabled && props.type === 'checkout' ? '#D12E2E' : // Red when Check-Out is disabled
    props.checked || props.type === 'checkin' ? '#0EAE10' : '#ffffff'};
  padding: 10px;
  /* margin: 10px 0; */
  border-radius: 10px;
  align-items: center;
  flex-direction: row;
  border: 1px solid #007bff;
`;


const ButtonText = styled.Text`
  color: white;
  font-size: 12px;
`;

const CheckStatusButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
`;

const EmpDataContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const EmpImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: #a970ff;
  height: 60px;
  width: 60px;
  margin-right: 10px;
  border-radius: 30px;
`;

const CheckStatusText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const AttendanceCard = styled.View`
  border: 1px solid #007bff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
`;

const AddAttendance = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [attendance, setAttendance] = useState({});
  const [attData, setAttData] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    empId: 'Employee_Id',
    designation: 'Position',
  });
  const [hasPermission, setHasPermission] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const navigation = useNavigation();
  const router = useRouter();

  // console.log('Attendance Data----->', attData);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const date = moment().format('DD-MM-YYYY');
    const time = moment().format('hh:mm A');
    setCurrentDate(date);
    setCurrentTime(time);

    getProfileInfo().then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const data = {
        emp_id: employeeData?.emp_data,
        month: moment().format('MM'),
        year: moment().format('YYYY'),
      };
      fetchAttendanceDetails(data);
    }, [employeeData])
  );

  const fetchAttendanceDetails = (data) => {
    getEmpAttendance(data).then((res) => {
      setAttData(res.data);
      processAttendanceData(res.data);
    });
  };

  const processAttendanceData = (data) => {
    const todayAttendance = data.find(
      (item) => item.a_date === currentDate
    );
  
    if (todayAttendance) {
      setCheckedIn(todayAttendance.end_time === null);
      setStartTime(todayAttendance.start_time);
      setAttendance(todayAttendance);
    } else {
      setCheckedIn(false);
      setStartTime(null);
      setAttendance({});
    }
  };
  

  const handleCheck = async (data) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to check.');
      return;
    }
  
    const location = await Location.getCurrentPositionAsync({});
    // console.log('Location:', location);
  
    // Find the attendance record for the current date
    const todayAttendance = attData.find((item) => item.a_date === currentDate);
  
    // If attendance record exists, use its ID, otherwise set a default ID or handle the error
    const attendanceId = todayAttendance ? todayAttendance.id : null;
  
    if (!attendanceId) {
      Alert.alert('Error', 'No attendance record found for today.');
      return;
    }

  
    const checkPayload = {
      emp_id: employeeData?.emp_data?.emp_id,
      call_mode: data,
      time: currentTime,
      geo_type: data === 'ADD' ? 'I' : 'O',
      a_date: currentDate,
      latitude_id: `${location?.coords?.latitude}`,
      longitude_id: `${location?.coords?.longitude}`,
      remarks: 'Test',
      id: attendanceId,
    };

    // console.log('Att Id ------',attendanceId)
  
    console.log('Check Payload:', checkPayload);
  
    postCheckIn(checkPayload)
      .then((res) => {
        Alert.alert('Success', 'Action successfully completed');
        console.log('Check Response:', res.data);
        setCheckedIn(true);
        setStartTime(currentTime);
      })
      .catch((error) => {
        console.error('Error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to Check');
      });
  };

  
  

  const handlePressStatus = () => {
    router.push({
      pathname: 'AttendanceStatusDisplay',
      params: employeeData?.emp_data,
    });
  };

  console.log('Attendace Dta per day-----',attendance)

  return (
    <>
      <HeaderComponent headerTitle="My Attendance" onBackPress={() => navigation.goBack()} />
      <Container>
        {/* <Header>Add Attendance</Header> */}
        <Label>Date: {currentDate}</Label>
        <Label>Time: {currentTime}</Label>
        <EmpDataContainer>
          <EmpImageContainer>
            <Image
              source={{ uri: `${employeeData?.image}` }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          </EmpImageContainer>
          <View>
            <Value>Emp-Id: {employeeData?.emp_data?.emp_id}</Value>
            <Value>Designation: {employeeData?.emp_data?.grade_name}</Value>
          </View>
        </EmpDataContainer>
        <AttendanceCard>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Attendance</Text>
          <AttendanceButton>
          <Button
            onPress={() => handleCheck('ADD')}
            checked={checkedIn}
            type="checkin" // Add type for Check-In
            disabled={checkedIn || attendance.geo_status === 'O'}
          >
            <Entypo name="location-pin" size={24} color="white" />
            <ButtonText>
              {checkedIn || attendance.geo_status === 'O' ? `Checked-In at ${attendance.start_time}` : 'CHECK IN'}
            </ButtonText>
          </Button>
          {checkedIn && (
            <Button
              onPress={() => handleCheck('UPDATE')}
              type="checkout" // Add type for Check-Out
              disabled={attendance.geo_status === 'O'}
            >
                <Feather name="log-out" size={24} color="white" />              
                <ButtonText>
                {attendance.geo_status === 'O' ? `Checked-Out at ${attendance.end_time}` : 'CHECK OUT'}
              </ButtonText>
            </Button>
          )}
        </AttendanceButton>
        </AttendanceCard>
        <CheckStatusButton onPress={handlePressStatus}>
          <CheckStatusText>Check Status</CheckStatusText>
        </CheckStatusButton>
      </Container>
    </>
  );
};

export default AddAttendance;

