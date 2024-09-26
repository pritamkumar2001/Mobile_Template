// HeaderComponent.js
import React from 'react';
import { Text, Image } from 'react-native';
import styled from 'styled-components/native';

// Container for the header
const HeaderContainer = styled.View`
  background-color: white;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

// Styled text for the header title
const HeaderText = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

// Styled container for the back button
const BackButton = styled.TouchableOpacity`
  padding: 5px;
`;

// Path to the local back icon
const BackIcon = require('../assets/images/back_icon.png'); // Adjust the path according to your file structure

const HeaderComponent = ({ headerTitle, onBackPress }) => {
  return (
    <HeaderContainer>
      
      <HeaderText>{headerTitle}</HeaderText>
      <BackButton onPress={onBackPress}>
        <Image source={BackIcon} style={{ width: 24, height: 24 }} />
      </BackButton>
    </HeaderContainer>
  );
};

export default HeaderComponent;
