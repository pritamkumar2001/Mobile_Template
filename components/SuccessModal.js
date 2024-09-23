import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const SuccessModal = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <ModalContainer>
        <ModalContent>
          <IconContainer>
            <SuccessIcon>✓</SuccessIcon>
          </IconContainer>
          <MessageContainer>
            <TitleText>Leave Rejected Successfully</TitleText>
            <SubText>Your Leave has been rejected successfully</SubText>
          </MessageContainer>
          <DoneButton onPress={onClose}>
            <ButtonText>Done</ButtonText>
          </DoneButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// Styled Components
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  align-items: center;
  width: 85%;
`;

const IconContainer = styled.View`
  background-color: #e6f4ff;
  border-radius: 50px;
  padding: 15px;
  margin-bottom: 20px;
`;

const SuccessIcon = styled.Text`
  font-size: 36px;
  color: #1e90ff;
`;

const MessageContainer = styled.View`
  margin-bottom: 30px;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #6c757d;
`;

const DoneButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 12px 20px;
  border-radius: 30px;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: white;
  font-weight: bold;
`;

export default SuccessModal;
