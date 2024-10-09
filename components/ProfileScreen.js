import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getProfileInfo } from '../components/services/authServices';
import HeaderComponent from './HeaderComponent';
import { useNavigation } from 'expo-router';

// Styled components
const Container = styled.View`
  /* flex: 1; */
  height: 100%;
  /* margin-top: 50px; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  padding-top: 50px;
`;

const AvatarContainer = styled.View`
  background-color: #e5d1ff;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.Image`
  width: 70px;
  height: 70px;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const InfoText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
`;
const ProfileImage = styled.Image`
  width: 80px;
  height: 80px;
  /* size={70} color="#5D5D5D" */
  border-radius: 60px;
  /* margin-bottom: 10px; */
  /* border: 5px solid  #007bff; */
`;

const IsManagerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ManagerText = styled.Text`
  font-size: 16px;
  margin-right: 10px;
`;

const LogOutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const LogOutText = styled.Text`
  color: red;
  font-size: 16px;
  margin-left: 10px;
`;

const ChangePasswordButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px 20px;
  border-radius: 10px;
  margin-top: 20px;
`;

const ChangePasswordText = styled.Text`
  color: white;
  font-size: 16px;
`;
const ProfileScreen = () => {
  const { logout } = useContext(AppContext);
  const [profile, setProfile] = useState({});
  const [isManager, setIsManager] = useState(false);

  
  const navigation = useNavigation(); // Access the navigation object
  

  useEffect(() => {
    // Fetch profile data
    getProfileInfo().then((res) => {
      setProfile(res.data);
      // console.log(res.data);
      setIsManager(res.data.user_group.is_manager);
    });
  }, []);

  // console.log('profile---------->',profile)
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
    <HeaderComponent headerTitle="My Profile" onBackPress={handleBackPress} />
    <Container>
      {/* <StatusBar style="auto" /> */}
      
      <AvatarContainer>
        {/* <MaterialCommunityIcons name="account" size={70} color="#5D5D5D" /> */}
        <ProfileImage source={{ uri: profile.image }} />
      </AvatarContainer>
      <UserName>{profile&&profile?.emp_data?.name}</UserName>
      <UserName>{profile&&profile?.user_name}</UserName>

      <IsManagerContainer>
        <ManagerText>Is Manager:</ManagerText>
        {isManager ?
        <MaterialCommunityIcons name="check-circle" size={24} color="lightblue" />:
        <MaterialCommunityIcons name="cancel" size={24} color="red" />
        }
      </IsManagerContainer>

      <InfoText>Employee Id : {profile?.emp_data?.emp_id}</InfoText>
      <InfoText>Department : {profile?.emp_data?.department_name}</InfoText>

      <LogOutButton onPress={() => {logout()}}>
        <MaterialCommunityIcons name="logout" size={24} color="red" />
        <LogOutText>Log Out</LogOutText>
      </LogOutButton>

      <ChangePasswordButton>
        <ChangePasswordText>Change Your Password</ChangePasswordText>
      </ChangePasswordButton>
    </Container>
    </>
  );
};

export default ProfileScreen;
