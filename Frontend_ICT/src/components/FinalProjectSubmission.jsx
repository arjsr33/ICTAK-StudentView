import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios';

const FinalProjectSubmission = ({s_id}) => {

    const [form,setForm]=useState({
      links:'',
      files:'',
      comments:''
    })

    // function captureFile(event){
    //     setFiles(event.target.files[0]);
    //     console.log(event.target.files[0]);
    // }

    useEffect(()=>{
      axios.get(`https://ict-student-view-server.vercel.app/api/princy/studentswithprojects/${s_id}`)
      .then((res)=>{
          console.log(`Axios res.data(studentswithprojects) in WeeklySubmission is - `)
          console.log(res.data)
          // setStudentData(res.data)
          // console.log('Student data is - ')
          // console.log(studentData)
      })
    },[])

    const  submitForm = async(e)=>{
      e.preventDefault()
      const formdata = new FormData()
      // formdata.append("weeklyfile",files)
      formdata.append("links",form.links)
      formdata.append("files",form.files)
      formdata.append("comments",form.comments)
      console.log('formdata is -')
      console.log(formdata)

      const result = await axios.post(`https://ict-student-view-server.vercel.app/api/princy/uploadProject/${s_id}`,
        formdata,{headers:{"Content-Type":"multipart/form-data"}})
        .then((res)=>{
          console.log(`Axios res.data in FinalProjectSubmission is - `)
          console.log(res.data)})

      alert('Congrats!!! Your have submitted your final project')
    }

  return (
    <div>
        <form className="formStyle" encType="multipart/form-data" onSubmit={submitForm}>
        <h2 className="text-success py-2 text-center"><u>Final Project Submission</u></h2>
        <br/>
        {/* <div className="row mb-3">
          <label className="col " >Select the week of submission:</label>
          <div className="col ">
            <select className="form-select " aria-label="Default select example" value={form.selectedWeek} 
            onChange={(e)=>{
              setForm({...form,selectedWeek:e.target.value})
            }}>
                <option value="0" >--Select--</option>
                <option value="1">Week 1</option>
                <option value="2" disabled>Week 2</option>
                <option value="3" disabled>Week 3</option>
                <option value="4" disabled>Week 4</option>
            </select>
          </div>
        </div> */}
        <div className="row mb-3">
          <label className="col " >Submit your links here:</label>
          <div className="col ">
            <textarea className="form-control" value={form.links} 
            onChange={(e)=>{
              setForm({...form,links:e.target.value})
            }}></textarea>
          </div>
        </div>
        <div className="row mb-3">
          <label className="col " >Upload your files here:</label>
          <div className="col ">
            <input className="form-control" type="file" name="weeklyFile"  
            onChange={(e)=>{
              setForm({...form,files:e.target.files[0]})
            }}/>
            {/* <input className="form-control" type="file" name="files[]" id="formFileMultiple" multiple onChange={captureFiles}/> */}
            {/* <Form action="/upload" method="POST" encType="multipart/form-data">
                <Form.Group className="mb-3">
                {/* <Form.Label>Choose files</Form.Label> */}
                    {/* <Form.Control type="file" name="fileUploads[]" multiple onChange={captureFiles} />
                </Form.Group>
                {/* <Button type="submit" variant="primary">Upload Files</Button> */}
            {/* </Form>           */} 
          </div>
        </div>
        <div className="row mb-3">
          <label className="col " >Your description/comments about the submission:</label>
          <div className="col ">
            <textarea className="form-control" value={form.comments} 
            onChange={(e)=>{
              setForm({...form,comments:e.target.value})
            }}></textarea>
          </div>
        </div>
        <br/>
        <div className="d-grid col-4 mx-auto">
          {/* <button type="submit" className="btn btn-primary" >Log in</button> */}
          <button type="submit" className="btn btn-success d-grid mx-auto" >Add Submission</button>
        </div>
      </form>

    </div>
  )
}

export default FinalProjectSubmission
