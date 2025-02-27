import React from 'react';
import './dashboardcontent.css';
import maindashboard from './maindashboard';
import employee from './employees';
const DashboardContent = ({activemenu}) => {
  if (activemenu=='dashboard'){
     return <maindashboard/>
  }
  else {
    return <employee/>
  }
};

export default DashboardContent;