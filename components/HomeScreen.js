import React, {useContext, useState, useEffect} from 'react';
import { View, Text, Image, StatusBar, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {AppContext} from '../context/AppContext'
import { getCompanyInfo, getProfileInfo } from '../components/services/authServices'
import { Link, useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');
const Container = styled.View`
  background-color: #f5f5f5;
`;

const MenuContainer = styled(ScrollView)`
  height: ${height * 0.6}px;
  margin-top: 30px;
  padding: 10px;
`;

const MenuWrapper = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuItem = styled.TouchableOpacity`
  width: 45%;
  height: ${height * 0.12}px;
  background-color: #dcd6e9;
  padding: ${height * 0.02}px;
  border-radius: 15px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const MenuIcon = styled.Image`
  width: ${width * 0.1}px;
  height: ${width * 0.1}px;
  margin-bottom: 10px;
`;

const MenuText = styled.Text`
  font-size: ${width * 0.04}px;
  font-weight: bold;
  color: #333;
`;

const Header = styled.View`
  background-color: #a970ff;
  height: ${height * 0.3}px;  /* 30% of screen height */
  padding: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;
const HeaderImageContainer = styled.View`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
`;

const LogoContainer = styled.View`
  width: ${width * 0.35}px;  /* Responsive width */
  height: ${width * 0.15}px;  /* Responsive height */
  /* background-color: aliceblue; */
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 20px;
`;

const Logo = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const HeaderContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CompNameContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled.Text`
  color: white;
  font-size: ${width * 0.06}px;  /* Responsive font size */
  font-weight: bold;
  text-align: center;
`;

const HeaderCompanyName = styled.Text`
  color: black;
  font-size: ${width * 0.03}px;
  font-weight: bold;
  text-align: left;
`;

const IconContainer = styled.View`
  width: ${width * 0.15}px;
  height: ${width * 0.15}px;
  border-radius: ${width * 0.075}px;
  background-color: aliceblue;
  align-items: center;
  justify-content: center;
`;

const ProfileIcon = styled.Image`
  width: ${width * 0.12}px;  /* Responsive width */
  height: ${width * 0.12}px;  /* Responsive height */
  border-radius: ${width * 0.06}px;  /* Responsive border radius */
`;




// Main Component
const HomePage = () => {
  const router = useRouter();

  const {logout, userToken} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState([]);
    const [company, setCompany] = useState([])

    const [isManager, setIsManager] = useState(false)


    useEffect(() => {
      setLoading(true)
      getProfileInfo()
      .then((res) => {
          setProfile(res.data);
          setIsManager(res.data.user_group.is_manager);
          setLoading(false);
      })
      .catch((error) => {
          setLoading(false);
          setIsManager(false);
      });

      getCompanyInfo()
      .then((res) => {
        setCompany(res.data);
        setLoading(false);
    })
    .catch((error) => {
        setLoading(false);
    });
    }, []);
    
    const handlePressLeave = () => {
      router.push('leave');
    };
    const handlePressProfile = () => {
      router.push('profile');
    };
    const handlePressALeave = () => {
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
      router.push('attendance');
    };


  return (
    <Container>
      
      <StatusBar barStyle={'light-content'} backgroundColor={'#a970ff'} />
      {/* Header */}
      <Header>
        <HeaderImageContainer>
        <LogoContainer>
          <Logo source={{ uri: company.image }} />

        </LogoContainer>
        
        <IconContainer>

          <ProfileIcon source={{ uri: profile.image }} />
        </IconContainer>
        </HeaderImageContainer>
        
        <HeaderContent>
          {/* <HeaderCompanyName>{company.name}</HeaderCompanyName> */}
          <HeaderText>Welcome to ATOMWALK HRM!</HeaderText>
        </HeaderContent>

        
      </Header>

      <MenuContainer>
      <MenuWrapper>

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


       </MenuWrapper>

      </MenuContainer>
    </Container>
  );
};

export default HomePage;
