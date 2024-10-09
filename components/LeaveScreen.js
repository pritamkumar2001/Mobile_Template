import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, StatusBar, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
// import { useNavigation } from '@react-navigation/native';
import { Link, useRouter,useNavigation } from "expo-router";
import ModalComponent from '../components/ModalComponent';
import ModalComponentCancel from '../components/ModalComponentCancel';
import { getEmpLeave } from './services/productServices';
import HeaderComponent from './HeaderComponent';

// Container for the whole screen
const Container = styled.View`
  padding: 16px;
  height: 100%;
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
  justify-content: center;
  flex-wrap: wrap;
`;

// Individual card for leaves
const LeaveCard = styled.TouchableOpacity`
  width: 95%;
  background-color: ${props => props.bgColor || '#fff'};
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
  margin-top: 5px;
  margin-bottom: 5px;
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
const ApplicationList = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,  // Hide vertical scrollbar
  showsHorizontalScrollIndicator: false,  // Hide horizontal scrollbar
})`
  margin-top: 20px;
  margin-bottom: 100px;
`;

const ApplicationCard = styled.TouchableOpacity`
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

const CancelButton = styled.TouchableOpacity`
  background-color: #ff6666;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 8px;
  border-radius: 8px;
  margin-top: 10px;
  /* margin-left: 10px; */
`;

const CancelButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

// Tab container and buttons
const TabContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-vertical: 10px;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`;

const TabButtonActive = styled(TabButton)`
  border-bottom-width: 3px;
  border-color: blue;
  color: black;
`;

const TabText = styled.Text`
  font-size: 16px;
  color: gray;
  margin-bottom: 10px;
`;

const TabTextActive = styled(TabText)`
  color: blue;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
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
  const router = useRouter();
  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('My Leave');

  const handlePress = (leave) => {
    router.push({
      pathname: '/LeaveApply',
      params: leave,  // Pass leave data as params
    });
  };

  
  const handleCardPress = (leave) => {
    setSelectedLeave(leave);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const cancelLeave = (leave) => {
    // Set selected leave and open the cancel modal
    setSelectedLeave(leave);
    console.log(leave)
    setCancelModalVisible(true);
  };

  useEffect(() => {
    leaveDetails();
    
  }, [selectedTab]);

  const leaveDetails = () => {
    getEmpLeave(selectedTab === 'My Leave' ? 'EL' : selectedTab === 'My Cancel Leave' ? 'EL' : 'WH').then((res) => {
      setLeaveData(res.data);
      console.log('testing----------',leaveData)
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const count = leaveData.length
  // console.log(count)

  // Get status styles dynamically
  const getStatusStyles = (status_display) => {
    switch (status_display) {
      case 'Submitted':
        return { bgColor: '#fff7e6', color: '#ffcc80', borderColor: '#ffcc80', icon: 'highlight-off' };
      case 'Rejected':
        return { bgColor: '#ffe6e6', color: '#ff6666', borderColor: '#ff6666', icon: 'cancel' };
      case 'Cancelled':
        return { bgColor: '#ffe6e6', color: '#ff6666', borderColor: '#ff6666', icon: 'cancel' };
      case 'Approved':
        return { bgColor: '#eaffea', color: '#66cc66', borderColor: '#66cc66', icon: 'check-circle' };
      default:
        return { bgColor: '#fff', color: '#000', borderColor: '#ddd', icon: 'check-circle' };
    }
  };

  // console.log('Set Leave Data===========',selectedLeave)

  const renderLeaveItem = ({ item: leave }) => {
    const { bgColor, color, borderColor, icon } = getStatusStyles(leave.status_display);

    return (
      leave.status_display!='Cancelled'&&(selectedTab=='My Leave'||selectedTab=='My WFH')?<ApplicationCard
        key={leave.id}
        borderColor={borderColor}
        status={leave.status_display}
        onPress={() => handleCardPress(leave)}
      >
        <ApplicationStatusContainer>
        {/* <StatusBar barStyle={'light-content'} backgroundColor={'#a970ff'} /> */}
          <View>
          <DetailText>Date: {leave.from_date} to {leave.to_date}</DetailText>
          <DetailText>
            Leave Type: <DetailHighlight>{leave.leave_type_display}</DetailHighlight>
          </DetailText>
          </View>
          <View style={{ flexDirection: 'culomn' }}>
            <ApplicationStatus bgColor={bgColor}>
              <ApplicationStatusText color={color}>{leave.status_display}</ApplicationStatusText>
              <MaterialIcons name={icon} size={24} color={color} />
            </ApplicationStatus>
            {/* Show Cancel button only if status is "Submitted" */}
            {leave.status_display === 'Submitted' && (
              <CancelButton onPress={() => cancelLeave(leave)} >
                <CancelButtonText>Cancel</CancelButtonText>
              </CancelButton>
            )}
          </View>
          </ApplicationStatusContainer>
        <ApplicationDetails>
          <DetailText>
            Apply Days: <DetailHighlight>{leave.no_leave_count} Days</DetailHighlight>
          </DetailText>
          
        </ApplicationDetails>
      </ApplicationCard>:leave.status_display=='Cancelled'&&selectedTab=='My Cancel Leave'&&<ApplicationCard
        key={leave.id}
        borderColor={borderColor}
        status={leave.status_display}
        onPress={() => handleCardPress(leave)}
      >
        <ApplicationStatusContainer>
          <View>
          <DetailText>Date: {leave.from_date} to {leave.to_date}</DetailText>
          <DetailText>
            Leave Type: <DetailHighlight>{leave.leave_type_display}</DetailHighlight>
          </DetailText>
          </View>
          <View style={{ flexDirection: 'culomn' }}>
            <ApplicationStatus bgColor={bgColor}>
              <ApplicationStatusText color={color}>{leave.status_display}</ApplicationStatusText>
              <MaterialIcons name={icon} size={24} color={color} />
            </ApplicationStatus>
            {/* Show Cancel button only if status is "Submitted" */}
            {leave.status_display === 'Submitted' && (
              <CancelButton onPress={() => cancelLeave(leave)} >
                <CancelButtonText>Cancel</CancelButtonText>
              </CancelButton>
            )}
          </View>
          </ApplicationStatusContainer>
        <ApplicationDetails>
          <DetailText>
            Apply Days: <DetailHighlight>{leave.no_leave_count} Days</DetailHighlight>
          </DetailText>
          
        </ApplicationDetails>
      </ApplicationCard>
      
    );
  };
  
  return (
    <>
      <HeaderComponent headerTitle="My Leaves" onBackPress={handleBackPress} />
      <Container>
        {/* <Title>All Leaves</Title> */}

        {/* Leave Cards Section */}
        <CardRow>
          <LeaveCard bgColor="#eaffea" borderColor="#66cc66">
            {/* <LeaveText></LeaveText> */}
            <LeaveNumber color="#66cc66">Total Leave Applied: {count}</LeaveNumber>
          </LeaveCard>
          <LeaveCard bgColor="#e6ecff" borderColor="#4d88ff">
            {/* <LeaveText>Max Leave for Year</LeaveText> */}
            <LeaveNumber color="#4d88ff">Max Leave for Year: 0</LeaveNumber>
          </LeaveCard>
        </CardRow>

        {/* Apply Leave Button */}
        <ApplyLeaveButton onPress={() => handlePress(leaveData&&leaveData[0]?.emp_data)}>
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <ButtonText>Apply Leave</ButtonText>
        </ApplyLeaveButton>

         {/* Tab Section */}
      <TabContainer>
        <TabButton onPress={() => setSelectedTab('My Leave')}>
          {selectedTab === 'My Leave' ? (
            <TabButtonActive>
              <TabTextActive>My Leave</TabTextActive>
            </TabButtonActive>
          ) : (
            <TabText>My Leave</TabText>
          )}
        </TabButton>
        <TabButton onPress={() => setSelectedTab('My WFH')}>
          {selectedTab === 'My WFH' ? (
            <TabButtonActive>
              <TabTextActive>My WFH</TabTextActive>
            </TabButtonActive>
          ) : (
            <TabText>My WFH</TabText>
          )}
        </TabButton>
        <TabButton onPress={() => setSelectedTab('My Cancel Leave')}>
          {selectedTab === 'My Cancel Leave' ? (
            <TabButtonActive>
              <TabTextActive>My Cancel Leave</TabTextActive>
            </TabButtonActive>
          ) : (
            <TabText>My Cancel Leave</TabText>
          )}
        </TabButton>
      </TabContainer>

        {/* Application List Section */}
        <ApplicationList>
        <FlatList
        data={leaveData}
        renderItem={renderLeaveItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}  // Hide the scrollbar
      />
        </ApplicationList>
        {selectedLeave && (
        <ModalComponent
          isVisible={isModalVisible}
          leave={selectedLeave}
          onClose={closeModal}
        />
      )}

      {selectedLeave && (
        <ModalComponentCancel
          isVisible={isCancelModalVisible}
          leave={selectedLeave}
          onClose={() => setCancelModalVisible(false)} // Close the modal when user presses close
        />
      )}

      </Container>
      </>
  );
};

export default LeaveScreen;
