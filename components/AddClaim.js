import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform, Text, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { getExpenseItem, getExpenseProjectList, postClaim } from './services/productServices';
import { useNavigation, useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Dropdown } from 'react-native-element-dropdown';
import HeaderComponent from './HeaderComponent';

const Container = styled.ScrollView`
  flex: 1;
  padding: 10px;
  background-color: #fff;
  height: 100%;
`;

const Title = styled.Text`
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
  margin-top: 5px;
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

const InputText = styled.Text`
  color: black;
  font-size: 16px;
  font-weight: normal;
`;

const TextArea = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  text-align-vertical: top;
  border-radius: 8px;
  font-size: 16px;
`;

const FileButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const AddClaim = () => {
  const [item, setItem] = useState('');
  const [project, setProject] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [fileMimeType, setFileMimeType] = useState('');
  const [imgMode, setImgMode] = useState('');
  const [claimItem, setClaimItem] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchClaimItemList();
    fetchProjectList();
  }, []);

  const fetchClaimItemList = () => {
    getExpenseItem().then((res) => {
      setClaimItem(res.data);
    });
  };

  const fetchProjectList = () => {
    getExpenseProjectList().then((res) => {
      setProjectList(res.data);
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

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
                  setFileName(result.assets[0].fileName)
                  setFileUri(compressedImage.uri)
                  setFileMimeType(result.assets[0].mimeType)
                  setImgMode('camera');
                }
              } else {
                Alert.alert('Permission Required','Camera permission is required to capture photos');
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
                  const mimeType = result.assets[0].mimeType || result.type;
          
                  let compressedImageUri = fileUri;
                  if (result.assets[0].mimeType && result.assets[0].mimeType.startsWith('image/')) {
                    const compressedImage = await compressImage(fileUri);
                    compressedImageUri = compressedImage.uri || compressedImage;
                  }
          
                  setFile({
                    uri: fileUri,
                    name: fileName,
                    mimeType: mimeType
                  });
                  setFileName(fileName);
                  setFileUri(compressedImageUri);
                  setFileMimeType(mimeType);
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
      Alert.alert('No File Selected', 'You have not selected a file. Please select a file.');
    }
  };

  const compressImage = async (uri) => {
    let compressQuality = 1;
    let targetSize = 200 * 1024;
    let compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
    );
  
    let imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
  
    while (imageInfo.size > targetSize && compressQuality > 0.1) {
      compressQuality -= 0.1;
  
      compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
    }
  
    if (imageInfo.size > targetSize) {
      const resizeFactor = Math.sqrt(targetSize / imageInfo.size);
      compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: compressedImage.width * resizeFactor, height: compressedImage.height * resizeFactor } }],
        { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
    }
  
    return compressedImage;
  };


  const handleSubmit = () => {
    if (!claimAmount || !expenseDate ) {
      Alert.alert('Submission Error', 'Please fill all fields and attach a valid file.');
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
    formData.append('item', item);
    formData.append('quantity', "1");
    formData.append('expense_amt', claimAmount);
    formData.append('expense_date', expense_date);

    if (project) {
      formData.append('project', project);
    }
    
    postClaim(formData)
      .then((res) => {
        if (res.status === 200) {
        Alert.alert('Success', 'Claim submitted successfully.');
        router.push('ClaimScreen')
        } else {
              console.error('Unexpected response:', res);
              Alert.alert('Claim Submission Error', 'Failed to claim. Unexpected response.');
        }
      })
      .catch((error) => {
        Alert.alert('Claim Submission Failed', `Failed to claim: ${error.response?.data?.detail || error.message}`);
      });
  };

  return (
    <>
      <HeaderComponent headerTitle="Add Claim" onBackPress={handleBackPress} />
      <Container>
        <FieldContainer>
          <Label>Expense Item</Label>
          <ClaimTypePicker>
            <Dropdown
              data={claimItem.map((claim) => ({
                label: claim.name,
                value: claim.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select Expense Item"
              value={item}
              onChange={(item) => setItem(item.value)}
              style={{
                padding: 10,
              }}
              placeholderStyle={{
                color: '#ccc',
                fontSize: 16,
              }}
              selectedTextStyle={{
                fontSize: 16,
              }}
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

        {projectList.length > 0 && (
          <FieldContainer>
            <Label>Project</Label>
            <ClaimTypePicker>
              <Dropdown
                data={projectList.map((project) => ({
                  label: project.title,
                  value: project.id,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select Project"
                value={project}
                onChange={(project) => setProject(project.value)}
                style={{
                  padding: 10,
                }}
                placeholderStyle={{
                  color: '#ccc',
                  fontSize: 16,
                }}
                selectedTextStyle={{
                  fontSize: 16,
                }}
              />
            </ClaimTypePicker>
          </FieldContainer>
        )}

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
              }}
            />
          )}
        </FieldContainer>
        <Label>Attach File :</Label>
        <FileButton onPress={handleFilePick}>
          <InputText>{fileName}</InputText>
          <Icon source={require('../assets/images/Upload-Icon.png')} />
        </FileButton>

        <Label>Remarks :</Label>
        <TextArea
          placeholder="Remark"
          value={remark}
          onChangeText={setRemark}
          multiline
          numberOfLines={4}
        />

        <SubmitButton onPress={handleSubmit}>
          <ButtonText>Submit</ButtonText>
        </SubmitButton>
      </Container>
    </>
  );
};

export default AddClaim;
