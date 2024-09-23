import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import styled from 'styled-components/native';
// import * as DocumentPicker from 'react-native-document-picker';

const AddClaim = () => {
  const [expenseName, setExpenseName] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState(null);

  // const handleFilePick = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
  //     });
  //     if (res[0].type === 'application/pdf' || res[0].type.includes('image')) {
  //       setFile(res[0]);
  //       Alert.alert('File Selected', `File Name: ${res[0].name}`);
  //     } else {
  //       Alert.alert('Invalid File', 'Only PDF and JPG files are allowed.');
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       Alert.alert('Canceled', 'File selection was canceled.');
  //     } else {
  //       Alert.alert('Error', 'Something went wrong with file selection.');
  //     }
  //   }
  // };

  const handleSubmit = () => {
    if (!expenseName || !expenseDate || !claimAmount || !file) {
      Alert.alert('Error', 'Please fill all fields and attach a valid file.');
      return;
    }

    const claimData = {
      expenseName,
      expenseDate,
      claimAmount,
      remark,
      file,
    };

    // Make your API call to submit the claimData
    // Example:
    // fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: claimData,
    // }).then((response) => {
    //   // handle success
    // }).catch((error) => {
    //   // handle error
    // });

    console.log('Claim Data:', claimData);
    Alert.alert('Success', 'Claim submitted successfully.');
  };

  return (
    <Container>
      <Header>Add Claim</Header>
      <Input
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />
      <Input
        placeholder="Expense Date :"
        value={expenseDate}
        onChangeText={setExpenseDate}
      />
      <Input
        placeholder="Claim Amount :"
        keyboardType="numeric"
        value={claimAmount}
        onChangeText={setClaimAmount}
      />
      <TextArea
        placeholder="Remark :"
        value={remark}
        onChangeText={setRemark}
        multiline
        numberOfLines={4}
      />
      <FileButton >
        <ButtonText>{file ? file.name : 'Attach File'}</ButtonText>
      </FileButton>
      <SubmitButton onPress={handleSubmit}>
        <ButtonText>Submit</ButtonText>
      </SubmitButton>
    </Container>
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

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 16px;
`;

const TextArea = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 16px;
  height: 100px;
`;

const FileButton = styled.TouchableOpacity`
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
