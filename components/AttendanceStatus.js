import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getEmpAttendance } from './services/productServices';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const CalendarContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #3f87f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const MonthText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const NavButtonContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
`;

const WeekDays = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 5px;
`;

const WeekDayText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #777;
`;

const Calendar = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DayContainer = styled.View`
  width: 14.2%;
  align-items: center;
  margin-bottom: 15px;
`;

const DayText = styled.Text`
  font-size: 14px;
  margin-bottom: 5px;
`;

const StatusText = styled.Text`
  font-size: 14px;
  color: ${(props) =>
    props.status === 'N' ? 'red' :
    props.status === 'L' ? 'orange' : 'green'};
`;

const AttendanceStatus = (props) => {
  const [date, setDate] = useState(new Date());
  const [attData, setAttData] = useState([]);
  const [attendance, setAttendance] = useState({});
  const empId = props.id;

  // Get the current month and year
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  useEffect(() => {
    // Update the data state with empId, currentMonth, and currentYear
    const data = {
      emp_id: empId,
      month: currentMonth + 1, // Month is 0-indexed, so add 1
      year: currentYear,
    };

    fetchAttendanceDetails(data);
  }, [currentMonth, currentYear, empId]);

  const fetchAttendanceDetails = (data) => {
    getEmpAttendance(data).then((res) => {
      setAttData(res.data);
      processAttendanceData(res.data);
    });
  };

  const processAttendanceData = (data) => {
    const attendanceMap = {};

    data.forEach((item) => {
      const day = parseInt(item.a_date.split('-')[0], 10);
      attendanceMap[day] = item.attendance_type;
    });

    setAttendance(attendanceMap);
  };

  // Days of the week
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Function to get the number of days in the current month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Change month function
  const changeMonth = (direction) => {
    setDate((prevDate) => {
      const newMonth = prevDate.getMonth() + direction;
      return new Date(prevDate.setMonth(newMonth));
    });
  };

  // Generate days for the calendar
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  return (
    <Container>
      <Header>
        <HeaderText>Attendance Status</HeaderText>
      </Header>
      <CalendarContainer>
        <NavButtonContainer onPress={() => changeMonth(-1)}>
          <Icon name="chevron-left" size={24} color="#3f87f9" />
        </NavButtonContainer>
        <MonthText>{`${date.toLocaleString('default', { month: 'long' })} ${currentYear}`}</MonthText>
        <NavButtonContainer onPress={() => changeMonth(1)}>
          <Icon name="chevron-right" size={24} color="#3f87f9" />
        </NavButtonContainer>
      </CalendarContainer>
      <WeekDays>
        {weekDays.map((day, index) => (
          <WeekDayText key={index}>{day}</WeekDayText>
        ))}
      </WeekDays>
      <ScrollView>
        <Calendar>
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const status = attendance[day] || 'N'; // Default status is 'N'
            const displayStatus = status === 'A' ? 'P' : status;

            return (
              <DayContainer key={day}>
                <DayText>{day}</DayText>
                <StatusText status={status}>{displayStatus}</StatusText>
              </DayContainer>
            );
          })}
        </Calendar>
      </ScrollView>
    </Container>
  );
};

export default AttendanceStatus;
