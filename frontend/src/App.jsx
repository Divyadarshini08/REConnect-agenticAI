import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Auth
import SimpleLogin from "./pages/auth/SimpleLogin";
import SimpleRegister from "./pages/auth/SimpleRegister";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import FindAlumni from "./pages/student/FindAlumni";
import MySessions from "./pages/student/MySessions";
import StudentProfile from "./pages/student/StudentProfile";
import AlumniSlots from "./pages/student/AlumniSlots";
import StudentUpcomingSessions from "./pages/student/StudentUpcomingSessions";

// Alumni pages
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import Availability from "./pages/alumni/Availability";
import Requests from "./pages/alumni/Requests";
import AlumniProfile from "./pages/alumni/AlumniProfile";
import UpcomingSessions from "./pages/alumni/UpcomingSessions";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* Show navbar only when logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/register" element={<SimpleRegister />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/find-alumni" element={<FindAlumni />} />
        <Route path="/student/my-sessions" element={<MySessions />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/alumni/:alumniId" element={<AlumniSlots />} />
        <Route path="/student/upcoming-sessions" element={<StudentUpcomingSessions />} />
        
        {/* Alumni */}
        <Route path="/alumni/upcoming-sessions" element={<UpcomingSessions />} />
        <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
        <Route path="/alumni/availability" element={<Availability />} />
        <Route path="/alumni/requests" element={<Requests />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
      </Routes>
    </>
  );
}

export default App;