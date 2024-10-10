import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { getProfileInfo } from './services/authServices';
import { getClaimApprover, postClaimAction } from './services/productServices';
import {Dropdown} from 'react-native-element-dropdown'; // Import Dropdown
import HeaderComponent from './HeaderComponent';


const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #ffffff;
`;
const ClaimDetailContainer = styled.View`
  background-color: #e1d7f5;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ClaimDetailText = styled.Text`
  font-size: 18px;
  color: ${(props) => props.color || '#333'};
  margin-bottom: 8px;
  font-weight: 500;
`;

const FillFieldsContainer = styled.View`
  margin-top: 10px;
`;

const InputField = styled.TextInput`
  border: 1px solid #ddd;
  padding: 12px;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 8px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 20px;
`;

const InstructionsText = styled.Text`
  color: #7b5fa3;
  text-align: center;
  margin-bottom: 16px;
  font-size: 16px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${(props) => props.color || '#4d88ff'};
  padding: 15px;
  margin: 0 5px;
  border-radius: 12px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const dropdownStyle = {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  marginTop: 10,
  paddingVertical: 15,
  paddingHorizontal: 10,
};

const ApproveClaimDetails = (props) => {
  const [profile, setProfile] = useState({});
  

  // console.log("Claim Data: ", props.claim_data);
  
  let claim;
  
  // Check if claim_data and claimDetails are defined
  const claimData = props?.claim_data;
  if (claimData) {
    const claimDetails = claimData.claimDetails;

    // Log claimDetails to see what you're working with
    // console.log("Claim Details before parsing: ", claimDetails); 

    // Check if claimDetails looks like a JSON string
    if (typeof claimDetails === 'string' && claimDetails !== "[object Object]") {
      try {
        // Attempt to parse if it seems valid
        claim = JSON.parse(claimDetails);
        // console.log("Parsed Claim: ", claim); 
      } catch (error) {
        console.error("Error parsing claimDetails: ", error);
      }
    } else {
      // If it's not a string or is '[object Object]', you may need to handle this differently
      claim = claimDetails && typeof claimDetails === 'object' ? claimDetails : {};
      console.warn("Claim Details is not a valid JSON string or is improperly formatted");
    }
  } else {
    console.warn("claim_data is undefined or null");
  }


  const callType = props?.claim_data?.callType;
  // const claim = props?.claim_data;
  const navigation = useNavigation();
  const managerData = profile?.emp_data;

  const [claimAmount, setClaimAmount] = useState(claim?.expense_amt);
  const [remarks, setRemarks] = useState(claim?.approval_remarks);
  const [selectedManager, setSelectedManager] = useState('');
  const [eligible, setEligible] = useState(false)
  const [managers, setManagers] = useState([]); // State to hold manager options
  const [managerGradeLevel, setManagerGradeLevel] = useState(0); // State to hold manager's grade level
  const claimGradeLevel = 100; // Example claim grade level from claim data
 

  useEffect(() => {
    // Fetch profile data
    getProfileInfo().then((res) => {
      setProfile(res.data);
    });

    // Fetching Manager List
  //   getClaimApprover()
  // .then((res) => {
  //   console.log('Approve api data---', res);
  //   setManagers(res);
  // })
  // .catch((error) => {
  //   console.error('Error fetching claim approvers: ', error?.response || error.message || error);
  // });
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);


  

  // Function to calculate the difference in days between two dates
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const formattedMonth = monthMap[month] || '01'; // Default to January if month is invalid
    return `${year}-${formattedMonth}-${day}`;
  };

 
  useEffect(() => {
    // Ensure manager data and claim amount are available before running the conditions
    if (managerData?.approve_data && claimAmount) {
        const managerGradeLevel = managerData.approve_data.find(data => data.claim_grade_level)?.claim_grade_level;
        const maxClaimAmount = managerData.approve_data.find(data => data.max_claim_amt)?.max_claim_amt;

        // Check if the manager's grade level is lower than the claim grade level
        if (managerGradeLevel < claimGradeLevel) {
            Alert.alert('Approval Denied', 'Your grade level does not allow you to approve this claim.');
            setEligible(true);
        }

        // Check if the claim amount exceeds the manager's approval limit
        if (parseFloat(claimAmount) > maxClaimAmount) {
            Alert.alert('Limit Exceeded', 'Claim amount exceeds your approval limit.');
            setEligible(true);
        }
    }
}, [managerData, claimAmount, claimGradeLevel]);


  const handleAction = (res1) => {
    if (claimAmount.trim() === '' || remarks.trim() === '') {
      Alert.alert('Incomplete Submission', 'Please fill in all fields including selecting a manager.');
      return;
    }

    

    // Parse the dates using the custom function
    const submittedDate = new Date(parseDate(claim.submitted_date));
    const expenseDate = new Date(parseDate(claim.expense_date));

    // Check if date parsing was successful
    if (isNaN(submittedDate) || isNaN(expenseDate)) {
      Alert.alert('Date Format Error', 'Invalid date format. Please check the dates.');

      return;
    }

    // Calculate the difference in milliseconds
    const timeDifference = submittedDate - expenseDate;

    // Convert milliseconds to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    // Check if manager's grade level allows them to approve the claim
    const maxApproveDays = managerData?.approve_data?.find(data => data.max_days)?.max_days || 0;

    if (daysDifference > maxApproveDays) {
      Alert.alert('Approval Not Allowed', `Claim cannot be approved as the difference is greater than ${maxApproveDays} days.`);
      return;
    }

    // Build claim payload
    const claimPayload = {
      approve_by_id: selectedManager, // Use the selected manager's ID
      approve_amt: `${claimAmount}`,
      claim_id: `${claim?.id}`,
      remarks,
      call_mode: res1,
    };

    // Post the claim action
    postClaimAction(claimPayload)
      .then((res) => {
        Alert.alert('Claim Status Update', `Claim ${res1}.`);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Leave Action Failed', `Failed to ${res1} leave.`);
      });
  };

  return (
    <>
    {/* <HeaderComponent headerTitle={`${callType} Leaves`} onBackPress={handleBackPress} /> */}
    <HeaderComponent headerTitle={claim?.employee_name} onBackPress={handleBackPress} />
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <Container>
      <ClaimDetailContainer>
        <ClaimDetailText color="#ff8c00">Claim Id: {claim?.claim_id}</ClaimDetailText>
        <ClaimDetailText>Expense Item: {claim?.item_name}</ClaimDetailText>
        <ClaimDetailText color="#ff8c00">Claim Date: {claim?.expense_date}</ClaimDetailText>
        <ClaimDetailText>Claim Remark: {claim?.remarks}</ClaimDetailText>
      </ClaimDetailContainer>
      <InstructionsText>Fill the below fields for any action:</InstructionsText>

      <FillFieldsContainer>
        <InputLabel>Claim Amount :</InputLabel>
        <InputField
          placeholder="Enter Claim Amount"
          keyboardType="numeric"
          value={claimAmount}
          onChangeText={setClaimAmount}
        />
        <InputLabel>Remark :</InputLabel>
        <InputField
          placeholder="Enter Remarks"
          multiline
          value={remarks}
          onChangeText={setRemarks}
        />
      {eligible && (
        <>
        <InputLabel>Select Manager :</InputLabel>
        <Dropdown
          style={dropdownStyle}
          placeholderStyle={{ color: '#666' }}
          selectedTextStyle={{ color: '#333' }}
          data={managers.map(manager => ({ label: manager.emp_name, value: manager.emp_id }))}
          labelField="label"
          valueField="value"
          value={selectedManager}
          placeholder="Select a Manager"
          onChange={(item) => {
            setSelectedManager(item.value);
          }}
        />
        </>)}
      </FillFieldsContainer>
      <ButtonContainer>
        <ActionButton color="#ff5722" onPress={() => handleAction('REJECT')}>
          <ButtonText>Reject Claim</ButtonText>
        </ActionButton>
        {callType === 'Approve' && (
          <ActionButton color="#4d88ff" onPress={() => handleAction('APPROVE')}>
            <ButtonText>Approve Claim</ButtonText>
          </ActionButton>
        )}
        {callType === 'Return' && (
          <ActionButton color="#ffa500" onPress={() => handleAction('SEND_BACK')}>
            <ButtonText>Back to Claimant</ButtonText>
          </ActionButton>
        )}
      </ButtonContainer>
    </Container>
    </ScrollView>
    </>
  );
};

export default ApproveClaimDetails;
