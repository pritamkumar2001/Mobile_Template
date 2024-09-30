import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View, TextInput, Linking } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { getEmpClaim } from './services/productServices';
import HeaderComponent from './HeaderComponent';

// Container for the whole screen
const Container = styled.View`
  flex: 1;
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

// Styled card container for claim information
const ClaimCard = styled.View`
  background-color: #E1D7F5;
  border-radius: 12px;
  border-width: 1px;
  border-color: #ccc;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

// Row container for Claim details and action button
const ClaimStatusContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Claim text styles
const ClaimText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

// Amount text style
const ClaimAmountText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #ff5722;
`;

// View button container
const ViewButton = styled.TouchableOpacity`
  background-color: #fff;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

// Action button for approving/rejecting
const ActionButton = styled.TouchableOpacity`
  background-color: #4d88ff;
  padding: 10px 20px;
  border-radius: 24px;
  margin-top: 10px;
`;

const ApproveButton = styled.TouchableOpacity`
  background-color: #4d88ff;
  padding: 10px 20px;
  border-radius: 24px;
  margin-top: 10px;
`;

// Action button text
const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

// Search bar container
const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 24px;
  margin-bottom: 10px;
`;

// Search input field
const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
  padding-left: 8px;
`;

const ApproveClaim = () => {
  const [claimData, setClaimData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const router = useRouter();
  const requestData = 'APPROVE';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchClaimDetails();
  }, []);

  const fetchClaimDetails = () => {
    getEmpClaim(requestData).then((res) => {
      setClaimData(res.data);
    });
  };

  console.log(claimData)

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    // You can also add logic to filter the claims based on searchQuery.
  };

  const handleViewFile = (fileUrl) => {
    Linking.openURL(fileUrl).catch((err) => console.error("Failed to open URL:", err));
  };

  const renderClaimItem = ({ item }) => (
    <ClaimCard>
      <ClaimStatusContainer>
        <View>
          <ClaimText>Emp: {item.employee_name}</ClaimText>
          <ClaimText>Item Name: {item.item_name}</ClaimText>
          <ClaimText>Claim ID: {item.claim_id}</ClaimText>
          <ClaimText>Expense Date: {item.expense_date}</ClaimText>
        </View>
        <View>
          <ClaimAmountText>₹ {item.expense_amt}</ClaimAmountText>
        </View>
      </ClaimStatusContainer>

      <ClaimStatusContainer>
        {/* View Button */}
        <ViewButton onPress={() => handleViewFile(item.submitted_file_1)}>
          <MaterialIcons name="visibility" size={20} color="#333" />
          <ClaimText style={{ marginLeft: 5 }}>View File</ClaimText>
        </ViewButton>

        
        {/*Action Button */}
        <ActionButton onPress={() => { /* Handle action click */ }}>
          <ButtonText>Action</ButtonText>
        </ActionButton>

        {/* Action Button */}
        <ApproveButton onPress={() => { /* Handle action click */ }}>
          <ButtonText>Approve</ButtonText>
        </ApproveButton>

      </ClaimStatusContainer>
    </ClaimCard>
  );

  return (
    <>
      <HeaderComponent headerTitle="Approve Claim" onBackPress={handleBackPress} />
      <Container>
        {/* Search Bar */}
        <SearchContainer>
          <MaterialIcons name="search" size={24} color="#888" />
          <SearchInput
            placeholder="Search Employee ID"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </SearchContainer>

        {/* Claim List */}
        <FlatList
          data={claimData}
          renderItem={renderClaimItem}
          keyExtractor={(item) => item.claim_id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </>
  );
};

export default ApproveClaim;
