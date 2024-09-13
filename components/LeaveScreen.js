import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from "expo-router";

// Container for the whole screen
const Container = styled.ScrollView`
  /* flex: 1; */
  padding: 16px;
  background-color: #fff;
`;

// Title for the "All Leaves"
const Title = styled.Text`
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
`;

// Card container for leave status
const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

// Individual card for leaves
const LeaveCard = styled.TouchableOpacity`
  width: 45%;
  background-color: ${props => props.bgColor || '#fff'};
  padding: 20px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${props => props.borderColor || '#ddd'};
  margin-bottom: 12px;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const LeaveText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const LeaveNumber = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${props => props.color || '#000'};
  margin-top: 8px;
`;

// Button for applying leave
const ApplyLeaveButton = styled.TouchableOpacity`
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

// Application List section
const ApplicationList = styled.View`
  margin-top: 20px;
`;

const ApplicationCard = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => props.borderColor || '#ddd'};
  margin-bottom: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ApplicationStatusContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ApplicationStatus = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.bgColor || 'transparent'};
  padding: 4px 8px;
  border-radius: 8px;
`;

const ApplicationStatusText = styled.Text`
  font-size: 14px;
  color: ${props => props.color || '#000'};
  margin-left: 8px;
`;

const IconWrapper = styled.View`
  padding: 4px;
  background-color: ${props => props.bgColor || 'transparent'};
  border-radius: 50px;
`;

// Application Details (Date, Apply Days, etc.)
const ApplicationDetails = styled.View`
  margin-top: 10px;
`;

const DetailText = styled.Text`
  font-size: 14px;
  color: #333;
`;

const DetailHighlight = styled.Text`
  font-weight: bold;
  color: #333;
`;

const LeaveScreen = () => {
  const navigation = useNavigation(); // Access the navigation object

  // useEffect hook to remove the header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // This removes the header
    });
  }, [navigation]);  
  const router = useRouter();
  const handlePress = () => {
    router.push('/LeaveApply'); 
  };

  return (
    <SafeAreaView>
    <Container>
      <Title>All Leaves</Title>

      {/* Leave Cards Section */}
      <CardRow>
        <LeaveCard bgColor="#eaffea" borderColor="#66cc66">
          <LeaveText>Total Leave Applied</LeaveText>
          <LeaveNumber color="#66cc66">5</LeaveNumber>
        </LeaveCard>
        <LeaveCard bgColor="#e6ecff" borderColor="#4d88ff">
          <LeaveText>Max Leave for Year</LeaveText>
          <LeaveNumber color="#4d88ff">0</LeaveNumber>
        </LeaveCard>
        
      </CardRow>

      {/* Apply Leave Button */}
      
        <ApplyLeaveButton onPress={() => handlePress() }>
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <ButtonText>Apply Leave</ButtonText>
        </ApplyLeaveButton>
     

      

      {/* Application List Section */}
      <ApplicationList>
        {/* Application Card 1 */}
        <ApplicationCard borderColor="#ffcc80">
          <ApplicationStatusContainer>
            <DetailText>Date: 03/09/2024 - 08/09/2024</DetailText>
            <ApplicationStatus bgColor="#fff7e6">
              <ApplicationStatusText color="#ffcc80">Pending</ApplicationStatusText>
              <MaterialIcons name="highlight-off" size={24} color="#ffcc80" />
            </ApplicationStatus>
          </ApplicationStatusContainer>
          <ApplicationDetails>
            <DetailText>
              Apply Days: <DetailHighlight>6 Days</DetailHighlight>
            </DetailText>
            <DetailText>
              Leave Balance: <DetailHighlight>20 Days</DetailHighlight>
            </DetailText>
          </ApplicationDetails>
        </ApplicationCard>

        {/* Application Card 2 */}
        <ApplicationCard borderColor="#ff6666">
          <ApplicationStatusContainer>
            <DetailText>Date: 03/09/2024 - 08/09/2024</DetailText>
            <ApplicationStatus bgColor="#ffe6e6">
              <ApplicationStatusText color="#ff6666">Rejected</ApplicationStatusText>
              <MaterialIcons name="cancel" size={24} color="#ff6666" />
            </ApplicationStatus>
          </ApplicationStatusContainer>
          <ApplicationDetails>
            <DetailText>
              Apply Days: <DetailHighlight>6 Days</DetailHighlight>
            </DetailText>
            <DetailText>
              Leave Balance: <DetailHighlight>20 Days</DetailHighlight>
            </DetailText>
          </ApplicationDetails>
        </ApplicationCard>

        {/* Application Card 3 */}
        <ApplicationCard borderColor="#66cc66">
          <ApplicationStatusContainer>
            <DetailText>Date: 03/09/2024 - 08/09/2024</DetailText>
            <ApplicationStatus bgColor="#eaffea">
              <ApplicationStatusText color="#66cc66">Approved</ApplicationStatusText>
              <MaterialIcons name="check-circle" size={24} color="#66cc66" />
            </ApplicationStatus>
          </ApplicationStatusContainer>
          <ApplicationDetails>
            <DetailText>
              Apply Days: <DetailHighlight>6 Days</DetailHighlight>
            </DetailText>
            <DetailText>
              Leave Balance: <DetailHighlight>20 Days</DetailHighlight>
            </DetailText>
          </ApplicationDetails>
        </ApplicationCard>
        <ApplicationCard borderColor="#66cc66">
          <ApplicationStatusContainer>
            <DetailText>Date: 03/09/2024 - 08/09/2024</DetailText>
            <ApplicationStatus bgColor="#eaffea">
              <ApplicationStatusText color="#66cc66">Approved</ApplicationStatusText>
              <MaterialIcons name="check-circle" size={24} color="#66cc66" />
            </ApplicationStatus>
          </ApplicationStatusContainer>
          <ApplicationDetails>
            <DetailText>
              Apply Days: <DetailHighlight>6 Days</DetailHighlight>
            </DetailText>
            <DetailText>
              Leave Balance: <DetailHighlight>20 Days</DetailHighlight>
            </DetailText>
          </ApplicationDetails>
        </ApplicationCard>

        <ApplicationCard borderColor="#66cc66">
          <ApplicationStatusContainer>
            <DetailText>Date: 03/09/2024 - 08/09/2024</DetailText>
            <ApplicationStatus bgColor="#eaffea">
              <ApplicationStatusText color="#66cc66">Approved</ApplicationStatusText>
              <MaterialIcons name="check-circle" size={24} color="#66cc66" />
            </ApplicationStatus>
          </ApplicationStatusContainer>
          <ApplicationDetails>
            <DetailText>
              Apply Days: <DetailHighlight>6 Days</DetailHighlight>
            </DetailText>
            <DetailText>
              Leave Balance: <DetailHighlight>20 Days</DetailHighlight>
            </DetailText>
          </ApplicationDetails>
        </ApplicationCard>

      </ApplicationList>
    </Container>
    </SafeAreaView>
  );
};

export default LeaveScreen;
