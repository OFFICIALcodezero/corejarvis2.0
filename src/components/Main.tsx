
import React from 'react';
import { Navigate } from 'react-router-dom';

const Main: React.FC = () => {
  // Redirect to the main Index page
  return <Navigate to="/" replace />;
};

export default Main;
