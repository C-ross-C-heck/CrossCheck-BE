// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar/components/Sidebar';
import Login from './Login/components/Login';
import Register from './Register/components/Register';
import Chatbot from './Chatbot/components/Chatbot';
import Community from './Community/components/Community';
import History from './History/components/History';
import LegalService from './LegalService/components/LegalService';
import './App.css';

const AppLayout = ({ children }) => {
      return (
            <div className="app">
                  <Sidebar />
                  {children}
            </div>
      );
};

const App = () => {
      return (
            <Router>
                  <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Chatbot />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes with Sidebar */}
                        <Route
                              path="/chatbot"
                              element={
                                    <AppLayout>
                                          <Chatbot />
                                    </AppLayout>
                              }
                        />
                        <Route
                              path="/community"
                              element={
                                    <AppLayout>
                                          <Community />
                                    </AppLayout>
                              }
                        />
                        <Route
                              path="/history"
                              element={
                                    <AppLayout>
                                          <History />
                                    </AppLayout>
                              }
                        />
                        <Route
                              path="/legal-service"
                              element={
                                    <AppLayout>
                                          <LegalService />
                                    </AppLayout>
                              }
                        />
                  </Routes>
            </Router>
      );
};

export default App;