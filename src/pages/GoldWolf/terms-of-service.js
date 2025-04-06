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

import { Avatar } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";

const TermsOfService = () => {
  return (
    <div style={styles.container}>
        <Helmet>
          <title>Terms of Service</title>
          <meta property="og:title" content="GoldWolf Terms of Service" />
          <meta
            property="og:description"
            content="Welcome to our Discord Bot service. By using our Bot, you agree to comply with and be bound by the following terms and conditions. Please review these terms carefully. If you do not agree with these terms, you should not use our Bot."
          />
          <meta
            property="og:url"
            content="https://www.shadow-craft.de/goldwolf/terms-of-service"
          />
          <meta name="theme-color" content="#FF4181" />
          {/* Favicon */}
          <link rel="icon" href="%PUBLIC_URL%/GoldWolf.ico" />
      </Helmet>
      <div style={styles.title}>
        <Avatar src="/GoldWolf.ico"></Avatar>
        <h1 style={styles.header}>Terms of Service</h1>
        </div>

      <p>
        Welcome to our Discord Bot service. By using our Bot, you agree to
        comply with and be bound by the following terms and conditions. Please
        review these terms carefully. If you do not agree with these terms, you
        should not use our Bot.
      </p>

      <h2 style={styles.subHeader}>1. Acceptance of Terms</h2>
      <p>
        By accessing and using our Discord Bot, you accept and agree to be bound
        by the terms and provision of this agreement. In addition, when using
        our services, you shall be subject to any posted guidelines or rules
        applicable to such services. Any participation in this service will
        constitute acceptance of this agreement.
      </p>

      <h2 style={styles.subHeader}>2. Description of Service</h2>
      <p>
        Our Discord Bot interacts with the public Wolvesville API to provide
        various functionalities, including managing guild settings, facilitating
        trades and donations, conducting polls, and handling user reports. The
        service is provided "as is" and we assume no responsibility for the
        timeliness, deletion, mis-delivery or failure to store any user
        communications or personalization settings.
      </p>

      <h2 style={styles.subHeader}>3. User Responsibilities</h2>
      <p>As a user of our Bot, you agree to the following:</p>
      <ul style={styles.list}>
        <li>Provide accurate and complete information when required.</li>
        <li>Use the Bot in compliance with all applicable laws and regulations.</li>
        <li>Not to engage in any activity that could harm or disrupt the service.</li>
        <li>Respect other users and refrain from any form of harassment or abuse.</li>
      </ul>

      <h2 style={styles.subHeader}>4. Intellectual Property</h2>
      <p>
        The content, layout, design, data, databases, and graphics on this Bot
        are protected by intellectual property laws. You may not reproduce,
        modify, create derivative works from, display, perform, publish,
        distribute, disseminate, broadcast or circulate any material without our
        prior written consent.
      </p>

      <h2 style={styles.subHeader}>5. Limitation of Liability</h2>
      <p>
        In no event shall we be liable for any indirect, incidental, special,
        consequential, or punitive damages arising out of or in connection with
        your use of our Bot. This includes, but is not limited to, damages for
        errors, omissions, interruptions, defects, delays in operation or
        transmission, loss of data, or any other failure of performance.
      </p>

      <h2 style={styles.subHeader}>6. Modifications to the Service</h2>
      <p>
        We reserve the right to modify or discontinue, temporarily or
        permanently, the service (or any part thereof) with or without notice.
        You agree that we shall not be liable to you or to any third party for
        any modification, suspension, or discontinuance of the service.
      </p>

      <h2 style={styles.subHeader}>7. Termination</h2>
      <p>
        We may terminate or suspend access to our Bot immediately, without prior
        notice or liability, for any reason whatsoever, including without
        limitation if you breach the terms. All provisions of the terms which by
        their nature should survive termination shall survive termination,
        including, without limitation, ownership provisions, warranty
        disclaimers, indemnity and limitations of liability.
      </p>

      <h2 style={styles.subHeader}>8. Governing Law</h2>
      <p>
        These terms shall be governed and construed in accordance with the laws
        of our jurisdiction, without regard to its conflict of law provisions.
        Our failure to enforce any right or provision of these terms will not be
        considered a waiver of those rights. If any provision of these terms is
        held to be invalid or unenforceable by a court, the remaining provisions
        of these terms will remain in effect.
      </p>

      <h2 style={styles.subHeader}>9. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these
        terms at any time. If a revision is material we will try to provide at
        least 30 days notice prior to any new terms taking effect. What
        constitutes a material change will be determined at our sole discretion.
      </p>

      <h2 style={styles.subHeader}>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us via the
        mail <b>black_wither@shadow-craft.de</b>.
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333",
  },
  title: {
    position: "relative",
    display: "block"
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#0056b3",
  },
  subHeader: {
    color: "#0056b3",
    borderBottom: "2px solid #0056b3",
    paddingBottom: "5px",
  },
  list: {
    listStyleType: "disc",
    marginLeft: "20px",
  },
};

export default TermsOfService;