import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View, TextInput, Linking, Alert, SafeAreaView } from 'react-native';
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

// Container for the image viewer
const ImageViewerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

// Image styles
const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ApproveClaim = () => {
  const [claimData, setClaimData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Added state for filtered data
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
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
      setFilteredData(res.data); // Set initial filtered data
    });
  };

  const handleBackPress = () => {
    if (selectedImageUrl) {
      setSelectedImageUrl(null);
    } else {
      navigation.goBack();
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    // Filter claims based on search query
    const filtered = claimData.filter(item => {
      const empIdMatch = item.employee_name.match(/\[(.*?)\]/); // Extract employee ID
      const empId = empIdMatch ? empIdMatch[1] : ''; // Get the employee ID or empty string
      return empId.includes(text); // Check if the employee ID matches the search query
    });

    setFilteredData(filtered); // Update filtered data
  };

  const handleViewFile = (fileUrl) => {
    const fileExtension = fileUrl.split('.').pop().split('?')[0].toLowerCase();

    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      // Set the selected image URL to display the image
      setSelectedImageUrl(fileUrl);
    } else if (fileExtension === 'pdf') {
      // Show alert and open the PDF URL for download
      Alert.alert('File Downloading', 'The file is being downloaded.');
      Linking.openURL(fileUrl).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    } else {
      console.warn('Unsupported file type:', fileExtension);
    }
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
       
      </ClaimStatusContainer>
      <ClaimStatusContainer>
        {/* View Button */}
        {item.submitted_file_1 && (
          <ViewButton onPress={() => handleViewFile(item.submitted_file_1)}>
            <MaterialIcons name="visibility" size={20} color="#333" />
            <ClaimText style={{ marginLeft: 5 }}>View File</ClaimText>
          </ViewButton>
        )}

        {/* Action Button */}
        {/* <ActionButton onPress={() => {}}>
          <ButtonText>Action</ButtonText>
        </ActionButton> */}

        {/* Approve Button */}
        {/* <ApproveButton onPress={() => {}}>
          <ButtonText>Approve</ButtonText>
        </ApproveButton> */}
      </ClaimStatusContainer>
    </ClaimCard>
  );

  if (selectedImageUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent headerTitle="View Image" onBackPress={handleBackPress} />
        <ImageViewerContainer>
          <StyledImage source={{ uri: selectedImageUrl }} resizeMode="contain" />
        </ImageViewerContainer>
      </SafeAreaView>
    );
  }

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
          data={filteredData} // Use filtered data
          renderItem={renderClaimItem}
          keyExtractor={(item) => item.claim_id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </>
  );
};

export default ApproveClaim;
