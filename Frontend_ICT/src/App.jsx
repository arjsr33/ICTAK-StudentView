import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import DiscussionForum from './components/DiscussionForum'
import FinalProjectSubmission from './components/FinalProjectSubmission'
import Home from './components/Home/Home'
import Login2 from './components/Login2'
import ProjectDashboard1 from './components/ProjectDashboard1'
import ProjectDetails from './components/ProjectDetails'
import ProjectOverview from './components/ProjectOverview'
import References from './components/References'
import StudentDashboard from './components/StudentDashboard'
import VivaVoce from './components/VivaVoce'
import WeeklySubmission from './components/WeeklySubmission'
import Signup from './components/Signup'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/login' element={<Login2 />}></Route>
      <Route path='/Signup' element ={<Signup />}/>
      <Route path='/StudentDashboard' element={<StudentDashboard/>}></Route>
      <Route path='/projectDetails/:id' element={<ProjectDetails />}></Route>
      <Route path='/projectOverview/:id' element={<ProjectOverview />}></Route>
      <Route path='ProjectDashboard1' element={<ProjectDashboard1 />}></Route>
      <Route path='/references' element={<References />}></Route>
      <Route path='/WeeklySubmission' element={<WeeklySubmission />}></Route>
      <Route path='/viva' element={<VivaVoce />}></Route>
      <Route path="/discussion/:batch" element={<DiscussionForum />} />
      <Route path='/FinalProjectSubmission' element={<FinalProjectSubmission/>}></Route>

    </Routes>
    </>
  )
}

export default App
