import React, { useState } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { postEmpLeave } from './services/productServices';

const ModalComponentReject = ({ isVisible, leave, onClose, props }) => {
  const fromDate = leave.from_date;
  const toDate = leave.to_date;
  const [remarks, setRemarks] = useState(leave.remarks);
  const call_mode = 'REJECT';

  const rejectLeave = () => {
    const leavePayload = {
      emp_id: `${leave.emp_data.id}`,
      from_date: fromDate,
      to_date: toDate,
      remarks,
      leave_type: leave.leave_type,
      call_mode,
      leave_id: `${leave.id}`
    };

    postEmpLeave(leavePayload)
      .then((res) => {
        alert('Leave canceled successfully');
        onClose(); // Close the modal on success
      })
      .catch((error) => {
        alert('Failed to cancel leave');
      });
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <ModalContainer>
        <ModalContent>
          <Header>
            <TitleText>Reject Leave - {leave.emp_data.emp_id}</TitleText>
            <CloseButton onPress={onClose}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>X</Text>
            </CloseButton>
          </Header>

          <LabelText>Leave Form :</LabelText>

          <InputField disabled>
            <DateText>{leave.from_date}</DateText>
          </InputField>

          <InputField disabled>
            <DateText>{leave.to_date}</DateText>
          </InputField>

          <LabelText>Remarks :</LabelText>
          <RemarksInput
            placeholder="Enter your remarks"
            multiline={true}
            numberOfLines={3}
            value={remarks}
            onChangeText={setRemarks}
          />

          <CancelButton onPress={rejectLeave}>
            <ButtonText>Reject</ButtonText>
          </CancelButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// Styled Components for Modal
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  align-items: center;
  border-width: 1px;
  border-color: #000;
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
  border-radius: 50px;
`;

const LabelText = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  align-self: flex-start;
`;

const InputField = styled.View`
  background-color: #d3d3d3;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  align-items: center;
`;

const DateText = styled.Text`
  font-size: 16px;
  color: black;
`;

const RemarksInput = styled.TextInput`
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #d3d3d3;
  margin-bottom: 20px;
  width: 100%;
  text-align-vertical: top;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: red;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

export default ModalComponentReject;
