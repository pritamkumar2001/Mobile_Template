import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StatusBar, View, SafeAreaView, Linking } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useNavigation, useRouter } from 'expo-router';
import { getEmpClaim } from './services/productServices';
import HeaderComponent from './HeaderComponent';

// Container for the whole screen
const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #fff;
`;

// Card container for claim information
const ClaimCard = styled.View`
  background-color: #e1d7f5;
  border-radius: 12px;
  border-width: 1px;
  border-color: #ccc;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

// Claim text styles
const ClaimText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ClaimAmountContainer = styled.View`
  position: absolute;
  right: 16px;
  top: 16px;
  background-color: #fff5e6;
  padding: 4px 8px;
  border-radius: 8px;
`;

const ClaimAmountText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #ff8800;
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

// View button styles
const ViewButton = styled.TouchableOpacity`
  background-color: #fff;
  border: 1px solid #4d88ff;
  border-radius: 24px;
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: 12px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

const ViewButtonText = styled.Text`
  color: #4d88ff;
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
`;

const ClaimScreen = () => {
  const router = useRouter();
  const [claimData, setClaimData] = useState([]);
  const navigation = useNavigation();
  const requestData = 'GET';

  useEffect(() => {
    fetchClaimDetails();
  }, []);

  const fetchClaimDetails = () => {
    getEmpClaim(requestData).then((res) => {
      setClaimData(res.data);
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePress = () => {
    router.push({
      pathname: 'ClaimApply',
    });
  };

  const handleViewFile = (fileUrl) => {
    Linking.openURL(fileUrl).catch((err) => console.error("Failed to open URL:", err));
  };

  const handleViewPress = (claimId) => {
    // Handle the view button press (e.g., navigate to a detailed view)
    console.log(`View claim with ID: ${claimId}`);
  };

  const renderClaimItem = ({ item }) => (
    <ClaimCard>
      <View>
        <ClaimText>Emp ID: {item.emp_id}</ClaimText>
        <ClaimText>Item Name: {item.item_name}</ClaimText>
        <ClaimText>Claim ID: {item.claim_id}</ClaimText>
        <ClaimText>Expense Date: {item.expense_date}</ClaimText>
      </View>
      <ClaimAmountContainer>
        <ClaimAmountText>₹ {item.expense_amt}</ClaimAmountText>
      </ClaimAmountContainer>
      <ViewButton onPress={() => handleViewFile(item.submitted_file_1)}>
        <MaterialIcons name="visibility" size={20} color="#4d88ff" />
        <ViewButtonText>View File</ViewButtonText>
      </ViewButton>
    </ClaimCard>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderComponent headerTitle="My Claim" onBackPress={handleBackPress} />

      <Container>
        <FlatList
          data={claimData}
          renderItem={renderClaimItem}
          keyExtractor={(item) => item.claim_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for the button
        />
        {/* Apply Claim Button */}
      <ApplyClaimButton onPress={handlePress}>
        <MaterialIcons name="add-circle" size={24} color="#fff" />
        <ButtonText>Apply Claim</ButtonText>
      </ApplyClaimButton>
      </Container>

      
    </SafeAreaView>
  );
};

export default ClaimScreen;
