import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router';
import { getEmpClaim } from './services/productServices';

// Container for the whole screen
const Container = styled.View`
height: 100%;
  padding: 10px;
  background-color: #fff;
`;

// Title for the claims section
const Title = styled.Text`
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
`;

// Card container for claim information
const ClaimCard = styled.TouchableOpacity`
  background-color: ${props => props.bgColor || '#fff'};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => props.borderColor || '#ddd'};
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

// Claim text styles
const ClaimText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const ClaimAmountText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${props => props.color || '#000'};
  margin-top: 5px;
  margin-bottom: 5px;
`;

// Button for applying a new claim
const ApplyClaimButton = styled.TouchableOpacity`
  background-color: #4d88ff;
  padding: 12px 16px;
  border-radius: 24px;
  align-self: center;
  margin: 20px 0;
  flex-direction: row;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

// Claim details container
const ClaimDetails = styled.View`
  margin-top: 10px;
`;

// StatusBar styled component for each claim
const ClaimStatusContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ApproveClaim = () => {
  const router = useRouter();
  const [claimData, setClaimData] = useState([]);
  const requestData = 'APPROVE'

  useEffect(() => {
    fetchClaimDetails();
  }, []);

  const fetchClaimDetails = () => {
    getEmpClaim(requestData).then((res) => {
      setClaimData(res.data);
      // console.log(res.data);
    });
  };

//   const handlePress = () => {
//     router.push({
//       pathname: 'ClaimApply',
//     });
//   };

  const renderClaimItem = ({ item }) => {
    return (
      <ClaimCard bgColor="#E1D7F5" borderColor="#ccc">
        <ClaimStatusContainer>
          <View>
            <ClaimText>Claim ID: {item.claim_id}</ClaimText>
            <ClaimText>Item Name: {item.item_name}</ClaimText>
            <ClaimText>Expense Date: {item.expense_date}</ClaimText>
          </View>
          <View>
            <ClaimAmountText color="#007bff">₹ {item.expense_amt}</ClaimAmountText>
          </View>
        </ClaimStatusContainer>
      </ClaimCard>
    );
  };

  return (
    <Container>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Title>Approve Claims</Title>

      {/* Claim List Section */}
      <FlatList
        data={claimData}
        renderItem={renderClaimItem}
        keyExtractor={(item) => item.claim_id.toString()}
        showsVerticalScrollIndicator={false}  // Hide scrollbar
      />

      {/* Apply Claim Button */}
      {/* <ApplyClaimButton onPress={handlePress}>
        <MaterialIcons name="add-circle" size={24} color="#fff" />
        <ButtonText>Apply Claim</ButtonText>
      </ApplyClaimButton> */}
    </Container>
  );
};

export default ApproveClaim;
