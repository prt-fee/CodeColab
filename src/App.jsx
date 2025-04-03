
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Index from './pages/Index';
// import Dashboard from './pages/Dashboard';
// import Projects from './pages/Projects';
// import ProjectDetail from './pages/ProjectDetail';
// import Tasks from './pages/Tasks';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';
// import ProjectUpload from './pages/ProjectUpload';
// import MeetingScheduler from './pages/MeetingScheduler';
// import Chat from './pages/Chat';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Features from './pages/Features';
// import { AuthProvider } from './context/AuthContext';
// import { NotificationsProvider } from './context/NotificationsContext';
// import { Toaster } from './components/ui/toaster';
// import { Toaster as Sonner } from './components/ui/sonner';
// import { TooltipProvider } from './components/ui/tooltip';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import "./services/firebase";
// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <AuthProvider>
//           <NotificationsProvider>
//             <TooltipProvider>
//             <Toaster />
//             <Sonner />
//               <Routes>
//                 <Route path="/" element={<Index />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/projects" element={<Projects />} />
//                 <Route path="/projects/:id" element={<ProjectDetail />} />
//                 <Route path="/tasks" element={<Tasks />} />
//                 <Route path="/upload" element={<ProjectUpload />} />
//                 <Route path="/meetings" element={<MeetingScheduler />} />
//                 <Route path="/chat" element={<Chat />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/features" element={<Features />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//               {/* <Toaster />
//               <Sonner /> */}
//             </TooltipProvider>
//           </NotificationsProvider>
//         </AuthProvider>
//       </Router>
//     </QueryClientProvider>
//   );
// }

// export default App;




import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // Add the new page
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProjectUpload from './pages/ProjectUpload';
import MeetingScheduler from './pages/MeetingScheduler';
import Chat from './pages/Chat';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';

// Import Firebase initialization to ensure it's loaded before AuthProvider
import './services/firebase';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NotificationsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/upload" element={<ProjectUpload />} />
                <Route path="/meetings" element={<MeetingScheduler />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New route */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </NotificationsProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;