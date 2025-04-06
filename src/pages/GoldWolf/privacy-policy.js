/*
 ------------------------------------------------------------------------------
 ------------------------------------------------------------------------------
 Copyright @ 2024 Segritude LTD.
 All right reserved.
 This code and all related assets are the property of segritude LTD.
 Unauthorized copying, distribution, or modification of this file, 
 via any medium, is strictly prohibited.

 NOTE: Tampering with or removing this notice is prohibited. 
 Any attempt to circumvent this restriction will be subject to legal action.

 ------------------------------------------------------------------------------
 ------------------------------------------------------------------------------
*/ 

import React from "react";
import './PrivacyPolicy.css'; 
import { Helmet } from "react-helmet";
import { Avatar } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <Helmet>
          <title>Privacy policy</title>
          <meta property="og:title" content="GoldWolf Privacy Policy" />
          <meta
            property="og:description"
            content="Welcome to our Discord Bot service. By using our Bot, you agree to comply with and be bound by the following privacy policy. Please review these terms carefully. If you do not agree with these terms, you should not use our Bot."
          />
          <meta
            property="og:url"
            content="https://www.shadow-craft.de/goldwolf/privacy-policy"
          />
          <meta name="theme-color" content="#FF4181" />
          {/* Favicon */}
          <link rel="icon" href="/GoldWolf.ico" />
      </Helmet>

      <Avatar src="/GoldWolf.ico"></Avatar>
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy outlines the types of data collected, how it is used,
        and the measures taken to protect your information in connection with our
        Discord Bot that interacts with the public Wolvesville API. By using our Bot,
        you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2>Data Collection</h2>

      <h3>Guild Settings</h3>
      <ul>
        <li><strong>guildId</strong>: Unique identifier for the Discord guild.</li>
        <li><strong>verifyRoleId</strong>: Role ID used for verification purposes.</li>
        <li><strong>verifyLevelRequirement</strong>: Level requirement for verification.</li>
        <li><strong>clanId</strong>: Clan identifier.</li>
        <li><strong>newsChannelId</strong>: ID of the channel for news updates.</li>
        <li>
          <strong>donationWallet</strong>:
          <ul>
            <li><strong>msg</strong>:
              <ul>
                <li><strong>channelId</strong>: ID of the channel for messages.</li>
                <li><strong>id</strong>: Message ID.</li>
              </ul>
            </li>
            <li>
              <strong>wallets</strong>: Array of wallet objects containing:
              <ul>
                <li><strong>playerId</strong>: Player's identifier.</li>
                <li><strong>gold</strong>: Amount of gold.</li>
                <li><strong>gems</strong>: Amount of gems.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li><strong>banned</strong>: List of banned user IDs.</li>
      </ul>

      <h3>Players</h3>
      <ul>
        <li><strong>userId</strong>: User's unique identifier.</li>
        <li><strong>guildId</strong>: Guild identifier.</li>
        <li><strong>verifyCode</strong>: Verification code.</li>
        <li><strong>playerId</strong>: Player's identifier.</li>
      </ul>

      <h3>Pools</h3>
      <ul>
        <li><strong>messageId</strong>: Message identifier.</li>
        <li><strong>guildId</strong>: Guild identifier.</li>
        <li><strong>channelId</strong>: Channel identifier.</li>
        <li><strong>voted</strong>: Array of users who have voted.</li>
        <li><strong>expires</strong>: Expiry date of the poll.</li>
      </ul>

      <h3>TradeProfile</h3>
      <ul>
        <li><strong>userId</strong>: User's unique identifier.</li>
        <li><strong>successfullyTrades</strong>:
          <ul>
            <li><strong>date</strong>: Date of successful trade.</li>
            <li><strong>with</strong>: Identifier of the trading partner.</li>
          </ul>
        </li>
        <li><strong>reports</strong>:
          <ul>
            <li><strong>date</strong>: Date of the report.</li>
            <li><strong>from</strong>: Identifier of the user who reported.</li>
          </ul>
        </li>
        <li><strong>myReports</strong>:
          <ul>
            <li><strong>date</strong>: Date of the report.</li>
            <li><strong>to</strong>: Identifier of the user being reported.</li>
          </ul>
        </li>
      </ul>

      <h3>Trades</h3>
      <ul>
        <li><strong>userId</strong>: User's unique identifier.</li>
        <li><strong>guildId</strong>: Guild identifier.</li>
        <li><strong>messageId</strong>: Message identifier.</li>
      </ul>

      <h3>TradesAccepted</h3>
      <ul>
        <li><strong>sellerId</strong>: Seller's identifier.</li>
        <li><strong>sellerMessageId</strong>: Seller's message identifier.</li>
        <li><strong>buyerId</strong>: Buyer's identifier.</li>
        <li><strong>buyerMessageId</strong>: Buyer's message identifier.</li>
        <li><strong>replyCount</strong>: Number of replies.</li>
      </ul>

      <h2>Error Handling</h2>
      <p>We collect error data to analyze and prevent future issues. This helps us improve the functionality and reliability of the Bot.</p>

      <h2>Use of Data</h2>
      <p>The data collected is used for the following purposes:</p>
      <ul>
        <li>Managing and verifying guilds and users.</li>
        <li>Facilitating trades and donations.</li>
        <li>Conducting polls and gathering votes.</li>
        <li>Handling reports and user interactions.</li>
        <li>Analyzing errors to improve the Bot's performance.</li>
        <li>Play minigames by writing the answers in the chat.</li>
      </ul>

      <h2>Data Protection</h2>
      <p>We implement a variety of security measures to maintain the safety of your personal information. These measures include, but are not limited to, encryption, access controls, and regular security audits.</p>

      <h2>Data Sharing</h2>
      <p>
        We do not share, sell, trade, or otherwise transfer to outside parties your Personally
        Identifiable Information unless we provide users with advance notice. This does not
        include website hosting partners and other parties who assist us in operating our website,
        conducting our business, or serving our users, so long as those parties agree to keep this
        information confidential.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Occasionally, at our discretion, we may include or offer third-party products or services on
        our website. These third-party sites have separate and independent privacy policies. We,
        therefore, have no responsibility or liability for the content and activities of these linked
        sites.
      </p>

      <h2>Changes to this Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by
        posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
        periodically for any changes.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
