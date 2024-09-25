import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity,Platform, Text, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { getExpenseItem, getExpenseProjectList, postClaim } from './services/productServices';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const AddClaim = () => {
  const [item, setItem] = useState('');
  const [project, setProject] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [expenseDate, setExpenseDate] = useState(new Date());  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('')
  const [fileUri, setFileUri] = useState('')
  const [fileMimeType, setFileMimeType] = useState('')
  const [imgMode,setImgMode] = useState('')
  const [claimItem, setClaimItem] = useState([])
  const [projectList, setProjectList] = useState([])
 
  const navigation = useNavigation();

  useEffect(()=>{
    fetchClaimItemList();
    fetchProjectList();
  },[])

  const fetchClaimItemList = () => {
    getExpenseItem().then((res) => {
      setClaimItem(res.data);
      // console.log(res.data)
    });
  };
  const fetchProjectList = () => {
    getExpenseProjectList().then((res) => {
      setProjectList(res.data);
      // console.log(res.data)
    });
  };

  console.log('claim Items ----------',claimItem)
  console.log('Project List -----------',projectList)

  const handleFilePick = async () => {
    try {
      Alert.alert(
        'Select Option',
        'Choose a file from library or capture a photo',
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
                });
  
                if (!result.canceled) {
                  const compressedImage = await compressImage(result.assets[0].uri);
                  console.log(result)
                  setFileName(result.assets[0].fileName)
                  setFileUri(compressedImage.uri)
                  setFileMimeType(result.assets[0].mimeType)
                  setImgMode('camera');
                }
              } else {
                alert('Camera permission is required to capture photos');
              }
            },
          },
          {
            text: 'Choose File',
            onPress: async () => {
              try {
                let result = await DocumentPicker.getDocumentAsync({
                  type: ['image/*', 'application/pdf'],
                  copyToCacheDirectory: true,
                });
          
                if (result.type !== 'cancel') {
                  const fileUri = result.assets[0].uri;
                  const fileName = result.assets[0].name;
                  const mimeType = result.assets[0].mimeType || result.type; // Fallback for mimeType
          
                  // Only compress if the selected file is an image
                  let compressedImageUri = fileUri;
                  if (result.assets[0].mimeType && result.assets[0].mimeType.startsWith('image/')) {
                    const compressedImage = await compressImage(fileUri);
                    compressedImageUri = compressedImage.uri || compressedImage; // Handle compression result
                  }
          
                  // Update the state sequentially after compression and other async tasks
                  setFile({
                    uri: fileUri,
                    name: fileName,
                    mimeType: mimeType
                  });
                  setFileName(fileName);
                  setFileUri(compressedImageUri); // Use the URI after compression
                  setFileMimeType(mimeType);
          
                  // Log for debugging
                  console.log('File:', { fileName, compressedImageUri, mimeType });
                }
              } catch (error) {
                console.error('Error while picking file or compressing:', error);
              }
            },
          },
          
          
          
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } catch (err) {
      alert('You have not selected a file. So, Please select a file.');
    }
  };
  
  // Helper function to compress the image to a maximum size of 200 KB
  const compressImage = async (uri) => {
    let compressQuality = 1; // Start with the best quality
    let targetSize = 200 * 1024; // Target size between 100 and 150 KB
    let compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
    );
  
    // Get the size of the compressed image
    let imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
  
    // Continue reducing the quality and resizing until we get within the target size range
    while (imageInfo.size > targetSize && compressQuality > 0.1) {
      compressQuality -= 0.1;
  
      // Apply compression again
      compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      // Get the new size
      imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
    }
  
    // If compression alone isn't enough, resize the image
    if (imageInfo.size > targetSize) {
      const resizeFactor = Math.sqrt(targetSize / imageInfo.size); // Calculate resizing factor
      compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: compressedImage.width * resizeFactor, height: compressedImage.height * resizeFactor } }],
        { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      imageInfo = await FileSystem.getInfoAsync(compressedImage.uri); // Get final image info
    }
  
    return compressedImage;
  };
  


  const handleSubmit = () => {
    if (!claimAmount || !expenseDate ) {
      Alert.alert('Error', 'Please fill all fields and attach a valid file.');
      return;
    }

    const expense_date= `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1)
      .toString().padStart(2, '0')}-${expenseDate.getFullYear()}`;

    


    const formData = new FormData();

   

    formData.append('file_1', {
      uri: fileUri,
      name: fileName,
      type: fileMimeType,
    });
    
    

    formData.append('remarks', remark);
    formData.append('item', '6');
    formData.append('quantity', "1");
    formData.append('expense_amt', claimAmount);
    formData.append('expense_date', expense_date);
    // console.log('expense_date', expense_date)
    console.log('Testing-------->',formData)

    
    
    
  

    //API Call
    postClaim(formData)
      .then((res) => {
        if (res.status === 200) {
        Alert.alert('Success', 'Claim submitted successfully.');
        navigation.goBack(); // Navigate back after successful submission
        } else {
              console.error('Unexpected response:', res);
              alert('Failed to claim. Unexpected response.');
        }
      })
      .catch((error) => {
        console.error('Unexpected response:', error.response);
        alert(`Failed to claim: ${error.response?.data?.detail || error.message}`);
      });


  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
    <Container>
      <Header>Add Claim</Header>
      
      <FieldContainer>
            <Label>Expense Item</Label>
            <ClaimTypePicker>
              <RNPickerSelect
                onValueChange={(value) => setItem(value)}
                value={item}
                items={claimItem.map((claim) => ({
                  label: claim.name, 
                  value: claim.id,
                }))}
                placeholder={{ label: 'Select Expense Item', value: null }}
                style={pickerSelectStyles}
              />
            </ClaimTypePicker>

          </FieldContainer>

          <Label>Claim Amount</Label>
          <Input
            placeholder="Claim Amount :"
            keyboardType="numeric"
            value={claimAmount}
            onChangeText={setClaimAmount}
          />
          
          <FieldContainer>
            <Label>Project</Label>
            <ClaimTypePicker>
              <RNPickerSelect
                onValueChange={(value) => setProject(value)}
                value={project}
                items={projectList.map((project) => ({
                  label: project.title, 
                  value: project.id,
                }))}
                placeholder={{ label: 'Select Project', value: null }}
                style={pickerSelectStyles}
              />
            </ClaimTypePicker>

          </FieldContainer>
      
      
      <FieldContainer>
            <Label>From Date</Label>
            <DatePickerButton onPress={() => setShowDatePicker(true)}>
              <DateText>{expenseDate.toDateString()}</DateText>
              <Icon source={require('../assets/images/c-icon.png')} />
            </DatePickerButton>
            {showDatePicker && (
              <DateTimePicker
                value={expenseDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || expenseDate;
                  setShowDatePicker(Platform.OS === 'ios');
                  setExpenseDate(currentDate);
                  calculateDays(currentDate, toDate);
                }}
              />
            )}
          </FieldContainer>

      
      <Label>Remarks :</Label>
      <TextArea
        placeholder="Remark"
        value={remark}
        onChangeText={setRemark}
        multiline
        numberOfLines={4}
      />
      <Label>Attach File :</Label>
      <FileButton onPress={handleFilePick}>
        <InputText>{fileName}</InputText>
        <Icon source={require('../assets/images/Upload-Icon.png')} />
      </FileButton>
      <SubmitButton onPress={handleSubmit}>
        <ButtonText>Submit</ButtonText>
      </SubmitButton>
    </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddClaim;

const Container = styled.View`
  /* flex: 1; */
  padding: 20px;
  background-color: #fff;
`;

const Header = styled.Text`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ClaimTypePicker = styled.View`
    border-width: 1px;
    border-color: #ccc;
    border-radius: 5px;
  `;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 16px;
`;
const Icon = styled.Image`
    width: 24px;
    height: 24px;
  `;
  const FieldContainer = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const DatePickerButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  border-radius: 5px;
`;

const DateText = styled.Text`
  font-size: 16px;
`;

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
};


const InputText = styled.Text`
  color: black;
  font-size: 16px;
  font-weight: normal;
`;
const TextArea = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  text-align-vertical: top;
  /* margin-bottom: 15px; */
  border-radius: 8px;
  font-size: 16px;
  /* height: 100px; */
`;

const FileButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  align-items: center;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
