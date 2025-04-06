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

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Avatar,
	Typography,
	Box,
	Badge,
	CircularProgress,
	Alert, // Importiere Alert für Fehlermeldungen
	Autocomplete,
	TextField
  } from '@mui/material';
  import { useState, useEffect, Fragment } from 'react';
  import { styled } from '@mui/material/styles';
  import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
  
  // StyledBadge mit dynamischen Farben basierend auf dem Benutzerstatus
  const StyledBadge = styled(Badge)(({ theme, status }) => {
	let backgroundColor;
  
	switch (status) {
	  case 'Work':
		backgroundColor = '#44b700'; // Grün
		break;
	  case 'Break':
		backgroundColor = '#f44336'; // Rot
		break;
	  case 'Offline':
	  default:
		backgroundColor = '#808080'; // Grau
		break;
	}
  
	return {
	  '& .MuiBadge-badge': {
		backgroundColor,
		color: backgroundColor,
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
		  position: 'absolute',
		  top: 0,
		  left: 0,
		  width: '100%',
		  height: '100%',
		  borderRadius: '50%',
		  animation: 'ripple 1.2s infinite ease-in-out',
		  border: '1px solid currentColor',
		  content: '""',
		},
	  },
	  '@keyframes ripple': {
		'0%': {
		  transform: 'scale(.8)',
		  opacity: 1,
		},
		'100%': {
		  transform: 'scale(2.4)',
		  opacity: 0,
		},
	  },
	};
  });
  
  const Workers = () => {
	const { id } = useParams();
	const [workerData, setData] = useState(null);
	const [error, setError] = useState(null); // Zustand für Fehler

	const [category, setCategoryValue] = useState(null);
	const [roles, setRolesOptions] = useState([])
	const [role, setRoleValue] = useState(null);
  
	useEffect(() => {
	  fetch(`${process.env.REACT_APP_API_URL}/workers/${id}`, {
		method: 'GET',
		credentials: 'include'
	  })
		.then(response => {
		  if (!response.ok) {
			// Setze den Fehlerstatus, wenn die Antwort nicht ok ist
			throw new Error(`No users found!`);
		  }
		  return response.json();
		})
		.then(json => setData(json))
		.catch(error => setError(error.message)); // Setze den Fehlerstatus im Fehlerfall
	}, [workerData]);
  
	if (error) {
	  return (
		<Box padding={8}>
		  <Alert severity="error">{error}</Alert> {/* Fehlermeldung anzeigen */}
		</Box>
	  );
	}
  
	return (
	  //<TableContainer component={Paper}>
	  <Fragment>
		<Navbar />
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}>
			<Autocomplete
				disablePortal
				options={workerData?.roles.categorys}
				onChange={(event, newValue) => {
					setCategoryValue(newValue);
					if (newValue) {
						setRolesOptions(workerData?.roles.roles.filter(role => role.category === newValue).map(role => role.name));
					} else {
						setRolesOptions(workerData?.roles.roles.map(role => role.name));
					}
				}}
				sx={{ width: 500, margin: 2 }}
				renderInput={(params) => <TextField {...params} label="Filter by department" />}
			/>
			<Autocomplete
				disablePortal
				options={roles.length > 0 ? roles : workerData?.roles.roles.map(role => role.name)}
				onChange={(event, newValue) => {
					setRoleValue(newValue);
				  }}
				sx={{ width: 500, margin: 2 }}
				renderInput={(params) => <TextField {...params} label="Filter by role" />}
			/>
		</div>
		<TableContainer>
			{workerData ? (
			<Table>
				<TableHead>
				<TableRow>
					<TableCell align="left">Avatar</TableCell>
					<TableCell align="left">Name</TableCell>
					<TableCell align="left">Status</TableCell>
					<TableCell align="left">Experience</TableCell>
					<TableCell align="left">Role</TableCell>
					<TableCell align="left">Breaks Count</TableCell>
					<TableCell align="left">Break Time</TableCell>
					<TableCell align="left">Daily Worked</TableCell>
					<TableCell align="left">Weekly Worked</TableCell>
					<TableCell align="left">Total Worked</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
				{workerData.users.map((user) => (
					<TableRow key={user.userId}>
					<TableCell>
						<StyledBadge
						overlap="circular"
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						variant="dot"
						status={user.status} // Status wird an StyledBadge übergeben
						>
						<Avatar src={user.avatar} alt={user.name} />
						</StyledBadge>
					</TableCell>
					<TableCell align="left">
						<Box display="flex" alignItems="center">
						<Typography variant="body1">{user.name}</Typography>
						<Typography variant="body2" color="textSecondary" style={{ marginLeft: '10px' }}>
							{user.userId}
						</Typography>
						</Box>
					</TableCell>
					<TableCell align="left">{user.status}</TableCell>
					<TableCell align="left">{user.experience}</TableCell>
					<TableCell align="left">{user.role}</TableCell>
					<TableCell align="left">{user.breaksCount}</TableCell>
					<TableCell align="left">{user.breakTime}</TableCell>
					<TableCell align="left">{user.dailyWorked}</TableCell>
					<TableCell align="left">{user.weeklyWorked}</TableCell>
					<TableCell align="left">{user.totalWorked}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
			) : (
			<CircularProgress />
			)}
		</TableContainer>
	  </Fragment>
	);
  };
  
  export default Workers;
  