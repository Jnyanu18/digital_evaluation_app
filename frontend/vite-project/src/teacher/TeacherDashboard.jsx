import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid2, Paper, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsCard from "./StatsCard";
import AnswerPapersStatus from "../components/AnswerPaperStatus";

import WeeklyChart from "../components/WeeklyChart";


const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const answerPapersStatus = {
    'Assigned': 0,
    'Pending': 0,
    'Evaluated': 0,
};
     for(const papers in dashboardData){
      const ansStatus = dashboardData[papers].status
      
      answerPapersStatus[ansStatus]++;
     }
  
     const getLast7DaysData = (data) => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      const last7DaysData = [];
    
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const day = daysOfWeek[date.getDay()];
    
        const assignedData = data.filter((item) => {
          const itemDate = new Date(item.assigned_date);
          return (
            itemDate.getFullYear() === date.getFullYear() &&
            itemDate.getMonth() === date.getMonth() &&
            itemDate.getDate() === date.getDate()
          );
        });
    
        const evaluationData = data.filter((item) => {
          const itemDate = new Date(item.
          elavuation_date);
          return (
            itemDate.getFullYear() === date.getFullYear() &&
            itemDate.getMonth() === date.getMonth() &&
            itemDate.getDate() === date.getDate()
          );
        });
    
        last7DaysData.push({
          day,
          assigned: assignedData.length, 
          evaluated: evaluationData.length,
        });
      }
    
      return last7DaysData;
    };
    

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/dashboard`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDashboardData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-800 text-white">
        Loading...
      </div>
    );
  }

   const weeklyData = getLast7DaysData(dashboardData);
    console.log(weeklyData);

    

  return (
    <div className="bg-zinc-800 w-full h-screen text-white overflow-y-auto no-scrollbar">
      <Navbar />
      <div className="dashboard-container p-8 pb-4 py-30 ">
        <Grid2 container spacing={2} className="mb-6" size={16}>

          <Grid2 size={12} >
            <StatsCard data={dashboardData} />
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <AnswerPapersStatus data={answerPapersStatus} />
          </Grid2>
          <Grid2 size={8} >
                <WeeklyChart data={weeklyData} />
              </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

export default TeacherDashboard;
