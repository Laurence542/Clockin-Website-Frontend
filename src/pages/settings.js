import React from 'react';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import '../styles/settings.css';


const Settings = () => {
    return (
      <div>
        <Navbar />
        <ContentArea>
            <div className="bot-container">
              <h1>Settings</h1>
              
              <div className="bot-button">
               <a href='/add-voice-channel' className="btn btn-primary">
                 Voice Channel 
               </a>
              </div>

              <div className="bot-button">
               <a href='/settings/add-department' className="btn btn-primary">
                 Department 
               </a>
              </div>
              
              <div className="bot-button">
               <a href='/settings/add-role' className="btn btn-primary">
                 Role 
               </a>
              </div>


            </div>
        </ContentArea>
      </div>
    );
};

export default Settings;
