import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from "expo-router";
import ModalComponent from '../components/ModalComponent';
import {getEmpLeave} from './services/productServices';
import HeaderComponent from './HeaderComponent';
import LeaveActionModal from './LeaveActionModal';
// Container for the whole screen
const Container = styled.View`
  padding: 16px;
  /* margin-bottom: 30px; */
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
  /* padding: 20px; */
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
  /* margin-top: 20px; */
  margin-bottom: 120px;
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



const DetailText = styled.Text`
  font-size: 14px;
  color: #333;
`;

const RejectButton = styled.TouchableOpacity`
  background-color: #ff6666;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 8px;
  border-radius: 8px;
  margin-top: 10px;
  /* margin-left: 10px; */
`;
const ApprovelButton = styled.TouchableOpacity`
  background-color: #06BF63;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 8px;
  border-radius: 8px;
  margin-top: 10px;
  /* margin-left: 10px; */
`;

// const CancelButtonText = styled.Text`
//   color: #fff;
//   font-size: 14px;
// `;

const DetailHighlight = styled.Text`
  font-weight: bold;
  color: #333;
`;

const LeaveScreen = () => {
  const navigation = useNavigation(); // Access the navigation object
  const router = useRouter();
  
  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [leaveData,setLeavedata]=useState([]);
  const [isRejectModalVisible, setRejectModalVisible] = useState(false);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Approve Leave');
  
  // const handlePress = () => {
  //   router.push('/LeaveApply'); 
  // };

  const handlePress = (leave) => {
    router.push({
      pathname: 'LeaveApply',
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

  const rejectLeave = (leave) => {
    // Set selected leave and open the cancel modal
    setSelectedLeave(leave);
    // console.log(leave)
    setRejectModalVisible(true);
  };

  const approveLeave = (leave) => {
    // Set selected leave and open the cancel modal
    setSelectedLeave(leave);
    // console.log(leave)
    setApproveModalVisible(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);


  const handleBackPress = () => {
    router.push('home');
  };


  useEffect(() => {
    leaveDetails();
  }, [selectedTab]);
  


  const leaveDetails = () => {
    getEmpLeave(selectedTab =='My Leave' ? "EL" : selectedTab =='My WFH' ? "WH" : "A" ).then((res) => {
      setLeavedata(res.data);
    });
  };
  
  

  // Get status styles dynamically
  const getStatusStyles = (status_display) => {
    switch (status_display) {
      case 'Submitted':
        return { bgColor: '#fff7e6', color: '#ffcc80', borderColor: '#ffcc80', icon: 'check' };
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
  const renderLeaveItem = ({ item: leave }) => {
    const { bgColor, color, borderColor, icon } = getStatusStyles(leave.status_display);
  // console.log(leave,"check")
    return (
      <ApplicationCard
        key={leave.id}
        borderColor={borderColor}
        status={leave.status_display}
        onPress={() => handleCardPress(leave)}
      >
        
        <ApplicationStatusContainer>
          <View>
          <DetailText>
            Emp. Id.: <DetailHighlight>{leave.emp_data.emp_id}</DetailHighlight>
          </DetailText>
          <DetailText>
            Emp. Name: <DetailHighlight>{leave.emp_data.name}</DetailHighlight>
          </DetailText>
          <DetailText>Date: {leave.from_date} to {leave.to_date}</DetailText>
          <DetailText>
            Leave Type: <DetailHighlight>{leave.leave_type_display}</DetailHighlight>
          </DetailText>
          <DetailText>
            Apply Days: <DetailHighlight>{leave.no_leave_count} Days</DetailHighlight>
          </DetailText>
          </View>
          <View style={{ flexDirection: 'culomn' }}>
            <ApplicationStatus bgColor={bgColor}>
              <ApplicationStatusText color={color}>{leave.status_display}</ApplicationStatusText>
              <MaterialIcons name={icon} size={24} color={color} />
            </ApplicationStatus>
            {/* Show Cancel button only if status is "Submitted" */}
            {leave.status_display === 'Submitted' && (
              <>
              <ApprovelButton onPress={() => approveLeave(leave)} >
                <ButtonText>Approve</ButtonText>
              </ApprovelButton>
              <RejectButton onPress={() => rejectLeave(leave)} >
                <ButtonText>Reject</ButtonText>
              </RejectButton>
            </>
            )}
          </View>
        </ApplicationStatusContainer>

      </ApplicationCard>
    );
  };
  
  return (
    <>
    
    <HeaderComponent headerTitle="Approve Leaves" onBackPress={handleBackPress} />
      <Container>
        <ApplicationList>
        <FlatList
        data={leaveData}
        renderItem={renderLeaveItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
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
      <LeaveActionModal 
        isVisible={isApproveModalVisible} 
        leave={selectedLeave} 
        onClose={() => {setApproveModalVisible(false),router.push('ApproveLeaves')}} 
        actionType="APPROVE" 
      />
      )}
     
      {selectedLeave && (
        <>
        <LeaveActionModal 
        isVisible={isRejectModalVisible} 
        leave={selectedLeave} 
        onClose={() => {setRejectModalVisible(false),router.push('ApproveLeaves')}} 
        actionType="REJECT" 
        />
      </>
      )}
      </Container>
      </>
  );
};

export default LeaveScreen;
