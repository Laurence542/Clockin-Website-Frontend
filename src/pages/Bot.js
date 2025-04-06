import React from 'react';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import '../styles/bot.css';

const Bot = () => {
    return (
      <div>
        <Navbar />
        <ContentArea>
            <div className="bot-container">
              <h1>Authorize the ClockIn Bot to Your Server</h1>
              <p>
                To get started, click the button below to add the ClockIn Bot to your server. After authorization, follow these steps:
              </p>
              <ul>
                <li>Go to the top-left corner, click on the dropdown select the server you authorized.</li>
                <li>Navigate to the "Settings" page.</li>
                <li>In the "Voice Channels" section, select the voice channel where people must connect to clock in.</li>
                <li>Add the Voice Channel ID to the bot settings to enable the clock-in functionality.</li>
              </ul>
              <div className="bot-button">
               <a href='https://discord.com/oauth2/authorize?client_id=1297751317195915386' className="btn btn-primary" target='_blank' rel="noopener noreferrer">
                 Add the ClockIn Bot to Your Server here
               </a>
              </div>
            </div>
        </ContentArea>
      </div>
    );
};

export default Bot;
