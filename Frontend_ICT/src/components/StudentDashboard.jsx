import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const StudentDashboard = () => {
    // const [student,setStudent] = useState("")
    // useEffect(()=>{
    //     setStudent(s_id)
    // },[s_id])
    // console.log('The logged in Student is - ')
    // console.log(student)
    const navigate = useNavigate(); // Initialize navigate
    const location = useLocation();
    const { s_id } = location.state || {};
    const [studentData,setStudentData]=useState({
        s_id:'',
        s_name:'',
        s_course:'',
        s_startdate:'',
        s_mentor:'',
        s_grade:'',
        s_exitscore:0,
    })
    const [projects,setProjects]=useState([])
    useEffect(()=>{
        axios.get(`https://ict-student-view-server.vercel.app/api/princy/studentCourse/${s_id}`)
        .then((res)=>{
            console.log(`Axios res.data(student) is - `)
            console.log(res.data)
            setStudentData(res.data)
            console.log('Student data is - ')
            console.log(studentData)
        })
    },[])
    useEffect(()=>{
        axios.get(`https://ict-student-view-server.vercel.app/api/princy/availableProjects/${studentData.s_course}`)
        .then((res)=>{
            console.log(`Axios res.data(projects) is - `)
            console.log(res.data)
            setProjects(res.data)
        })
    },[studentData.s_course])

    function postStdPjt(){
        axios.post(`https://ict-student-view-server.vercel.app/api/princy/postStdPjt`,
            {sp_id:"S0011",
            sp_name:"Shamna",
            p_id:"P004",
            p_name:"Fingerprint Detection System"})
            .then((res)=>{
                console.log(`Axios postStdPjt is - `)
                console.log(res.data)})
    }

    function goToProjectDashboard(){
        navigate('/ProjectDashboard1', { state: { s_id: s_id } }); // Redirect to Project Dashboard route
    }

    function goToProjectDetails(item) {
        navigate(`/projectDetails/${item.id}`, { state: { studentData: studentData } });
    }
    
  return (
    <div>
        <Navbar/>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br/>


        <h2 className="text-primary py-2 text-center"><u>The Student Dashboard</u></h2>
        <div className="row">
            <br/><br/><br/>
            <div className="col-3">
            <br/><br/><br/>
            {/* {studentData.map((item,i)=>( */}
                <ol className="list-group list-group-flush" id="studentList">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold"><u>Name</u> : {studentData.s_name}</div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold"><u>Course</u> : {studentData.s_course}</div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold"><u>Mentor</u> : {studentData.s_mentor}</div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold"><u>Started on</u> : {studentData.s_startdate}</div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold"><u>Score</u> : {studentData.s_exitscore}</div>
                    </div>
                </li>
                </ol>
                {/* ))} */}
            </div>
            
            <div className="col-8">
                <h3><u>Available Projects</u></h3><br/>
                <div className="row ">
                {projects.map((item,i)=>(
                <div className="col">
                
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="card-text"><i>COURSE : {item.course}</i></p>
                            <h5 className="card-title"><u>{item.name}</u></h5>
                            <p className="card-text">{item.details}...</p>
                            <img src="data:image/jpeg;base64,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" class="card-img-top" alt="..."/>
                        </div>
                        <div className="card-footer">
                            <button onClick={() => goToProjectDetails(item)}>Read more</button>
                        </div>
                    </div>
                    
                </div>
                ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default StudentDashboard