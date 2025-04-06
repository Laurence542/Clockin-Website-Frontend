import './App.css';
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { TimerProvider } from './components/TimerContext';
import Premium from './pages/premium';
import Home from './pages/home';
import Workers from './pages/workerList';
import Callback from './pages/callback';
import GuildsSelection from './pages/guilds';
import Guild from './pages/guild';
import PrivacyPolicy from './pages/GoldWolf/privacy-policy';
import TermsOfService from './pages/GoldWolf/terms-of-service';
import Dashboard from './pages/dashboard';
import Profile from './pages/Profile';
import TimeOff from './pages/request_time_off';
import TimeOffRequestsList from './pages/TimeOffRequestsList';
import Overview from './pages/HomeBase';
import Task from './pages/task';
import Analytic from './pages/analytic';
import DiscordRequest from './pages/discord_request';
import UserDetailsPage from './pages/UserDetailsPage';
import WorkHistory from './pages/WorkHistory'
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import UserDetails from "./pages/UserDetails";
import EmployeRoster from './pages/AdminEmployeRoster';
import WorkerOnboarding from './pages/admin/authentication/Worker/WorkerOnboarding';
import WorkerLogin from './pages/Worker/authentication/Login';
import OpenTicket from './pages/OpenTicket';
import AdminTask from './pages/AdminTask';
import AdminWorkHistory from './pages/AdminWorkHistory';
import UserProfile from "./pages/UserProfile";
import Bot from "./pages/Bot";
import AddVoiceChannel from "./pages/AddVoiceChannel";
import ManageVoiceChannels from "./pages/ManageVoiceChannels";
import Settings from "./pages/settings";
import CreateTask from "./pages/AdminCreateTask";
import CreateWorkHistory from "./pages/AdminCreateWorkHistory";
import UserTasks from "./pages/admin/task/AdminUserTask"
import UserWorkHistory from "./pages/admin/workhistory/AdminUserWorkHistory"
import UserTimeOffRequest from "./pages/admin/timeoffrequest/AdminUserTimeOffRequest"
import UpdatePersonalInformation from "./pages/admin/UpdatePersonalInformation";
import AdminTimeOffRequest from "./pages/admin/timeoffrequest/AdminTimeOffRequest"
import CalendarView from './pages/CalendarView';
import AddDepartment from './pages/admin/setting/AddDepartment';
import AddRole from './pages/admin/setting/AddRole';

function App() {
  return (
    <TimerProvider>
    <Router>
      <Routes>

        {/* admin route */}
         <Route path="/admin/onboarding" element={<WorkerOnboarding />} />



         {/* end of admin route  */}
    
         {/* worker route */}
         <Route path="/login" element={<WorkerLogin/>} />
       

         {/* end of worker route  */}
          <Route exact path="/" element={<Home/>} />
          <Route path="/request-time-off" element={<TimeOff/>} />
          <Route path="/my-requests" element={<TimeOffRequestsList />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/my-task" element={<Task />} />
          <Route path="/analytic" element={<Analytic/>} />
          <Route path="/open-ticket" element ={<OpenTicket/>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/discordrequest" element={<DiscordRequest/>} />
          <Route path="/user-details/:id" element={<UserDetailsPage />} />
          <Route path="/employee/roster" element={<EmployeRoster />} />
          <Route path="/user-detail/:userId" element={<UserDetails />} />
          <Route path="/work-history" element={<WorkHistory/>} />
          <Route exact path="/goldwolf/privacy-policy" element={<PrivacyPolicy/>} />
          <Route exact path="/goldwolf/terms-of-service" element={<TermsOfService/>} />
          <Route exact path='/overview/:id' element={<Dashboard />} />
          <Route exact path="/premium" element={<Premium />} />
          <Route exact path="/workers/:id" element={<Workers />} />
          <Route exact path='/guilds' element={<GuildsSelection />} />
          <Route exact path='/guild/:id' element={<Guild />} />
          <Route path='/callback' element={<Callback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contractor/task" element={<AdminTask/>} />
          <Route path="/contractor/workhistory" element={<AdminWorkHistory/>} />
          <Route path="/profiles" element={<UserProfile />} />
          <Route path="/bot" element={<Bot/>} />
          <Route path="/add-voice-channel" element={<AddVoiceChannel />} />
          <Route path="/manage-voice-channels" element={<ManageVoiceChannels />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create/task" element={<CreateTask/>} />
          <Route path="/create/workhistory" element={<CreateWorkHistory/> } />
          <Route path="/users/:userId/tasks" element={<UserTasks />} />
          <Route path="/users/:userId/workhistory" element={<UserWorkHistory />} />
          <Route path="/users/:userId/timeoffrequest" element={<UserTimeOffRequest/>} />
          <Route path="/users/:userId/updatepersonalinformation" element={<UpdatePersonalInformation />} />
          <Route path="/contractor/vacation" element={<AdminTimeOffRequest/>} />
          <Route path="/users/:userId/calendar" element={<CalendarView />} />
          <Route path="/settings/add-department" element={<AddDepartment />} />
          <Route path="/settings/add-role" element={<AddRole />} />
      </Routes>
    </Router>
    </TimerProvider>
  );
}

export default App;
