import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { Camera } from 'expo-camera';

import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getProfileInfo } from './services/authServices';
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from './HeaderComponent';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: 20px;
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
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => (props.checked ? '#28a745' : '#007bff')};
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const CheckStatusButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
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
  const [employeeData, setEmployeeData] = useState({
    empId: 'Employee_Id',
    designation: 'Position',
  });
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [fileMimeType, setFileMimeType] = useState('');
  const [imgMode, setImgMode] = useState('');
  const [checkedIn, setCheckedIn] = useState(false); // Tracks check-in status

  const navigation = useNavigation();

  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const date = moment().format('DD/MM/YYYY');
    const time = moment().format('hh:mm A');
    setCurrentDate(date);
    setCurrentTime(time);

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    getProfileInfo().then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleFilePick = async () => {
    try {
      Alert.alert(
        'Face-Id Verification',
        'Click On the capture photo to submit your face-id',
        [
          {
            text: 'Capture Photo',
            onPress: async () => {
              const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
              if (cameraPermission.granted) {
                let result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                  cameraType: ImagePicker.CameraType.front, // Use front camera
                });

                if (!result.canceled) {
                  setFileName(result.assets[0].fileName);
                  setFileUri(result.assets[0].uri);
                  setFileMimeType(result.assets[0].mimeType);
                  setImgMode('camera');
                  setCheckedIn(true); // Set check-in state to true after capturing image

                  
                }
              } else {
                alert('Camera permission is required to capture photos');
              }
            },
          },
          console.log('Face Data------>',fileName,fileMimeType,fileUri)
        ],
        
        { cancelable: true }
      );
    } catch (err) {
      alert('You have not selected a file. So, Please select a file.');
    }
  };

  const handleCheckOut = () => {
    // Logic for check-out
  };

  return (
    <>
    <HeaderComponent headerTitle="My Attendance" onBackPress={handleBackPress} />
    <Container>
      
    
      <Header>Add Attendance</Header>
      <Label>Date: {currentDate}</Label>
      <Label>Time: {currentTime}</Label>
      <Image
        source={{ uri: `${employeeData && employeeData?.image}` }}
        style={{ width: 60, height: 60, borderRadius: 30 }}
      />
      <Value>Emp-Id: {employeeData && employeeData?.emp_data?.emp_id}</Value>
      <Value>Designation: {employeeData && employeeData?.emp_data?.grade_name}</Value>
      <AttendanceCard>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Attendance</Text>
        <Button onPress={handleFilePick} checked={checkedIn}>
          <ButtonText>{checkedIn ? 'Checked-In' : 'CHECK IN'}</ButtonText>
        </Button>
        
        {checkedIn && (
          <Button onPress={handleCheckOut}>
            <ButtonText>CHECK OUT</ButtonText>
          </Button>
        )}
      </AttendanceCard>
      <CheckStatusButton>
        <CheckStatusText>Check Status</CheckStatusText>
      </CheckStatusButton>
    </Container>
    </>
  );
};

export default AddAttendance;
