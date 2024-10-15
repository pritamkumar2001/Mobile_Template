import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View, TextInput, Linking, Alert, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { getEmpClaim } from './services/productServices';
import HeaderComponent from './HeaderComponent';
import ImageViewer from 'react-native-image-zoom-viewer'; // Import the Image Zoom Viewer

const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #fff;
`;

const ClaimCard = styled.View`
  background-color: #E1D7F5;
  border-radius: 12px;
  border-width: 1px;
  border-color: #ccc;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ClaimStatusContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ClaimText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const ClaimAmountText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #ff5722;
`;

const ViewButton = styled.TouchableOpacity`
  background-color: #fff;
  padding: 10px 10px;
  border-width: 1px;
  border-color: #454545;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const ApproveButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.disabled ? props.disabledColor : '#4d88ff')};
  padding: 10px 10px;
  border-radius: 24px;
  margin-top: 10px;
  border-width: 1px;
  border-color: #454545;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #ffa500;
  padding: 10px 10px;
  border-radius: 24px;
  margin-top: 10px;
  border-width: 1px;
  border-color: #454545;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 24px;
  margin-bottom: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
  padding-left: 8px;
`;

const ImageViewerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const ApproveClaim = () => {
  const [claimData, setClaimData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
      setFilteredData(res.data);
    });
  };

  const getClaimStatus = (status) => {
    switch (status) {
      case 'S':
        return 'SUBMITTED';
      case 'A':
        return 'APPROVED';
      case 'F':
        return 'FORWARDED';
      case 'R':
        return 'REJECTED';
      default:
        return 'UNKNOWN';
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = claimData.filter((item) => {
      const empIdMatch = item.employee_name.match(/\[(.*?)\]/);
      const empId = empIdMatch ? empIdMatch[1] : '';
      return empId.includes(text);
    });
    setFilteredData(filtered);
  };

  // console.log('Claim Data===',claimData)
  console.log('Filterd Data===',filteredData)

  const handleViewFile = (fileUrl) => {
    const fileExtension = fileUrl.split('.').pop().split('?')[0].toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      setSelectedImageUrl(fileUrl);
    } else if (fileExtension === 'pdf') {
      Alert.alert('File Downloading', 'The file is being downloaded.');
      Linking.openURL(fileUrl).catch((err) => console.error('Failed to open URL:', err));
    } else {
      console.warn('Unsupported file type:', fileExtension);
    }
  };

  const handleApprove = (claimDetails,callType) => {
    const formattedClaimDetails = typeof claimDetails === 'object' 
      ? JSON.stringify(claimDetails) 
      : claimDetails; // Use it directly if it's already a string

    router.push({
      pathname: 'ApproveDetails',
      params: { 
        claimDetails: formattedClaimDetails, // Pass the formatted string
        callType 
      },
    });
  };

  const handleBackPress = () => {
    if (selectedImageUrl) {
      setSelectedImageUrl(null);
    } else {
      router.push('home');
    }
  };

  const renderClaimItem = ({ item }) => {
    const status = getClaimStatus(item.expense_status);
    const isSubmitted = status === 'SUBMITTED';
    const isForwarded = status === 'FORWARDED';
    const isRejected = status === 'REJECTED';
    const isApproved = status === 'APPROVED';

    return (
      <ClaimCard>
        <ClaimStatusContainer>
          <View>
            <ClaimText>Emp: {item.employee_name}</ClaimText>
            <ClaimText>Item Name: {item.item_name}</ClaimText>
            <ClaimText>Claim ID: {item.claim_id}</ClaimText>
            <ClaimText>Expense Date: {item.expense_date}</ClaimText>
            <ClaimText>Status: {status}</ClaimText>
          </View>
          <View>
            <ClaimAmountText> ₹ {item.expense_amt}</ClaimAmountText>
          </View>
        </ClaimStatusContainer>

        <ClaimStatusContainer>
          {item.submitted_file_1 && (
            <ViewButton onPress={() => handleViewFile(item.submitted_file_1)}>
              <MaterialIcons name="visibility" size={20} color="#333" />
              <ClaimText style={{ marginLeft: 5 }}>View File</ClaimText>
            </ViewButton>
          )}

          {isSubmitted && (
            <ActionButton onPress={() => handleApprove(item,'Return')}>
              <ButtonText>Return Claim</ButtonText>
            </ActionButton>
          )}

          <ApproveButton
            disabled={!isSubmitted}
            disabledColor={isRejected ? '#ff4444' : isForwarded ? '#ffa500': isApproved ? '#00C853' : '#4d88ff'}
            onPress={() => handleApprove(item,'Approve')}
          >
            <ButtonText>{isRejected ? 'REJECTED' : isApproved ? 'APPROVED' : isForwarded ? 'FORWARDED' : 'APPROVE'}</ButtonText>
          </ApproveButton>
        </ClaimStatusContainer>
      </ClaimCard>
    );
  };

  if (selectedImageUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent headerTitle="View Image" onBackPress={handleBackPress} />
        <View style={{ flex: 1 }}>
          {/* Using ImageViewer for zoom functionality */}
          <ImageViewer 
            imageUrls={[{ url: selectedImageUrl }]} // Array of images
            enableSwipeDown={true}
            onSwipeDown={handleBackPress} // Close the image viewer on swipe down
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <HeaderComponent headerTitle="Approve Claim" onBackPress={handleBackPress} />
      <Container>
        <SearchContainer>
          <MaterialIcons name="search" size={24} color="#888" />
          <SearchInput
            placeholder="Search Employee ID"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </SearchContainer>

        <FlatList
          data={[...filteredData].reverse()}
          renderItem={renderClaimItem}
          keyExtractor={(item) => item.claim_id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </>
  );
};

export default ApproveClaim;
