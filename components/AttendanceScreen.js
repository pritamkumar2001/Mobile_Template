import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { Camera } from 'expo-camera';

import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getProfileInfo } from './services/authServices';

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
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007bff;
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

const AddAttendance =()=> {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [employeeData, setEmployeeData] = useState({
    empId: 'Employee_Id',
    designation: 'Position',
  });
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('')
  const [fileUri, setFileUri] = useState('')
  const [fileMimeType, setFileMimeType] = useState('')
  const [imgMode,setImgMode] = useState('')

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
            // console.log('Test--------->',employeeData.emp_data.emp_id);
           
          });
      }, []);

 
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  

        if (hasPermission === null) {
            return <View />;
        }
      
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

  const handleCheckIn = () => {
    setCameraVisible(true);
  };

  const handleCheckOut = () => {
    // Logic for check-out
  };

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
                  // const compressedImage = await compressImage(result.assets[0].uri);
                  setFileName(result.assets[0].fileName);
                  setFileUri(result.assets[0].uri);
                  setFileMimeType(result.assets[0].mimeType);
                  setImgMode('camera');
                }
              } else {
                alert('Camera permission is required to capture photos');
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (err) {
      alert('You have not selected a file. So, Please select a file.');
    }
  };
  
  console.log('Image Data--------->', fileName,fileUri,fileMimeType)
  
  // Helper function to compress the image to a maximum size of 200 KB
//   const compressImage = async (uri) => {
//     let compressQuality = 1; // Start with the best quality
//     let targetSize = 200 * 1024; // Target size between 100 and 150 KB
//     let compressedImage = await ImageManipulator.manipulateAsync(
//       uri,
//       [],
//       { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
//     );
  
//     // Get the size of the compressed image
//     let imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
  
//     // Continue reducing the quality and resizing until we get within the target size range
//     while (imageInfo.size > targetSize && compressQuality > 0.1) {
//       compressQuality -= 0.1;
  
//       // Apply compression again
//       compressedImage = await ImageManipulator.manipulateAsync(
//         uri,
//         [],
//         { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
//       );
  
//       // Get the new size
//       imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
//     }
  
//     // If compression alone isn't enough, resize the image
//     if (imageInfo.size > targetSize) {
//       const resizeFactor = Math.sqrt(targetSize / imageInfo.size); // Calculate resizing factor
//       compressedImage = await ImageManipulator.manipulateAsync(
//         uri,
//         [{ resize: { width: compressedImage.width * resizeFactor, height: compressedImage.height * resizeFactor } }],
//         { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
//       );
  
//       imageInfo = await FileSystem.getInfoAsync(compressedImage.uri); // Get final image info
//     }
  
//     return compressedImage;
//   };
  

  if (cameraVisible) {
    return (
      <Camera
  style={{ flex: 1 }}
  type={Camera?.Constants?.Type?.front}  // Ensure this is Camera.Constants.Type.front
/>

    );
  }

  return (
    <Container>
      <Header>Add Attendance</Header>
      <Label>Date: {currentDate}</Label>
      <Label>Time: {currentTime}</Label>
      <Image source={{ uri: `${employeeData&&employeeData?.image}` }} style={{ width: 60, height: 60, borderRadius: 30 }} />
      <Value>Emp-Id: {employeeData&&employeeData?.emp_data?.emp_id}</Value>
      <Value>Designation: {employeeData&&employeeData?.emp_data?.grade_name}</Value>
      <AttendanceCard>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Attendance</Text>
        <Button onPress={handleFilePick}>
          <ButtonText>CHECK IN</ButtonText>
        </Button>
        <Button onPress={handleCheckOut}>
          <ButtonText>CHECK OUT</ButtonText>
        </Button>
      </AttendanceCard>
      <CheckStatusButton>
        <CheckStatusText>Check Status</CheckStatusText>
      </CheckStatusButton>
    </Container>
  );
}

export default AddAttendance