import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import DiscussionForum from './components/DiscussionForum'
import FinalProjectSubmission from './components/FinalProjectSubmission'
import Home from './components/Home/Home'
import Login from './components/Login'
import ProjectDashboard1 from './components/ProjectDashboard1'
import ProjectDetails from './components/ProjectDetails'
import ProjectOverview from './components/ProjectOverview'
import References from './components/References'
import StudentDashboard from './components/StudentDashboard'
import VivaVoce from './components/VivaVoce'
import WeeklySubmission from './components/WeeklySubmission'
import Signup from './components/Signup'
import Grades from './components/Grades'
import About from './components/About'
import Courses from './components/Courses'
import Placements from './components/Placements'
import Contact from './components/Contact'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Common Navbar for all pages */}
      <Navbar />
      
      {/* Routes without individual Navbar imports */}
      <Routes>
        {/* Public Pages */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/placements' element={<Placements />} />
        <Route path='/contact' element={<Contact />} />
        
        {/* Authentication */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        
        {/* Student Dashboard and Project Management */}
        <Route path='/StudentDashboard' element={<StudentDashboard />} />
        <Route path='/projectDetails/:id' element={<ProjectDetails />} />
        <Route path='/projectOverview/:id' element={<ProjectOverview />} />
        <Route path='ProjectDashboard1' element={<ProjectDashboard1 />} />
        
        {/* Project Components */}
        <Route path='/references' element={<References />} />
        <Route path='/WeeklySubmission' element={<WeeklySubmission />} />
        <Route path='/viva' element={<VivaVoce />} />
        <Route path="/discussion/:batch" element={<DiscussionForum />} />
        <Route path='/FinalProjectSubmission' element={<FinalProjectSubmission />} />
        <Route path='/grades' element={<Grades />} />
      </Routes>
    </>
  )
}

export default App