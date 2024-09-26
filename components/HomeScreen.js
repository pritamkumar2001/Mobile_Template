import React, {useContext, useState, useEffect} from 'react';
import { View, Text, Image, StatusBar, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import {AppContext} from '../context/AppContext'
import { getProfileInfo } from '../components/services/authServices'
import { Link, useRouter } from "expo-router";
// import LeaveScreen from '../components/LeaveScreen'

// Styled components
const Container = styled.View`
  background-color: #f5f5f5;
  /* padding: 20px; */
`;

const Header = styled.View`
  background-color: #a970ff;
  height: 250;
  padding: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  align-items: last baseline;
  justify-content: center;
`;

const HeaderText = styled.Text`
  color: white;
  width: 300px;
  font-size: 30px;
  font-weight: bold;
`;

const IconContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 70px;
  height: 70px;
  border-radius: 90px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileIcon = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 90px;
`;

const MenuContainer = styled.View`
  flex: 1;
  margin-top: 30px;
  padding: 10px;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuItem = styled.TouchableOpacity`
  width: 45%;
  background-color: #DCD6E9;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const MenuIcon = styled.Image`
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
`;

const MenuText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;



// Main Component
const HomePage = () => {
  const router = useRouter();

  const {logout, userToken} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState([])
    const [isManager, setIsManager] = useState(false)
    // console.log("data--->",profile)

    useEffect(() => {
      setLoading(true)
      getProfileInfo()
      .then((res) => {
          // console.log(res.data)
          setProfile(res.data);
          setIsManager(res.data.user_group.is_manager);
          setLoading(false);
      })
      .catch((error) => {
          // console.log('error', error);
          setLoading(false);
          setIsManager(false);
      });
    }, []);
    
    const handlePressLeave = () => {
      router.push('leave');
    };
    const handlePressProfile = () => {
      router.push('profile');
    };
    const handlePressALeave = (leave) => {
      router.push({
        pathname: 'ApproveLeaves' 
      });
    };
    const handlePressClaim = () => {
      router.push({
        pathname: 'ClaimScreen' 
      });
    };
    const handlePressAClaim = (leave) => {
      router.push({
        pathname: 'ApproveClaim' 
      });
    };

    const handlePressAttendance = () => {
      router.push({
        pathname: 'AttendanceScreen' 
      });
    };

  return (
    <Container>
      
      <StatusBar barStyle={'light-content'} backgroundColor={'#a970ff'} />
      {/* Header */}
      <Header>
        <HeaderText>Welcome to</HeaderText>
        <HeaderText>ATOMWALK HRM !</HeaderText>
        <IconContainer>
        <ProfileIcon source={{ uri: profile.image }} />
        {/* <Image source={require('../assets/images/UserIcon.png')} style={{ width: 50, height: 50 }} /> */}
        </IconContainer>
      </Header>

      {/* Menu Items */}
      <MenuContainer>
        

        <MenuItem onPress={() => handlePressLeave()}>
        <Image source={require('../assets/images/LeaveIcon.png')} style={{ width: 50, height: 50 }} />
          <MenuText>My Leaves</MenuText>
        </MenuItem>

        { isManager&&
        <MenuItem onPress={() => handlePressALeave()}>
        <Image source={require('../assets/images/ALeave.png')} style={{ width: 50, height: 50 }} />
          <MenuText>Approve Leaves</MenuText>
        </MenuItem>
        }

        <MenuItem onPress={() => handlePressClaim()}>
        <Image source={require('../assets/images/ClaimIcon.png')} style={{ width: 50, height: 50 }} />
          <MenuText>My Claims</MenuText>
        </MenuItem>

        { isManager&&
       <MenuItem onPress={() => handlePressAClaim()}>
        <Image source={require('../assets/images/AClaim.png')} style={{ width: 50, height: 50 }} />
          <MenuText>Approve Claims</MenuText>
        </MenuItem>
        }

        <MenuItem onPress={() => handlePressAttendance()}>
        <Image source={require('../assets/images/AttendanceIcon.png')} style={{ width: 50, height: 50 }} />
          <MenuText>My Attendance</MenuText>
        </MenuItem>

        <MenuItem onPress={() => handlePressProfile()}>
        <Image source={require('../assets/images/ProfileIcon.png')} style={{ width: 50, height: 50 }} />
          <MenuText>My Profile</MenuText>
        </MenuItem>


      </MenuContainer>
    </Container>
  );
};

export default HomePage;
