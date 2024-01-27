import React, { useEffect, useState } from 'react'
import { Col, Row, Container, Button } from "react-bootstrap";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Feedbackform.css";
import { Alert, Fab, Snackbar } from '@mui/material';
import { logout } from '../../Comtrollers/logoutController';
import LogoutIcon from '@mui/icons-material/Logout';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const FeedbackForm = () => {
  const navigate = useNavigate()
  const [counselees, setCounselees] = useState([])
  const [counsellor, setCounsellor] = useState({})
  const [prevReport, setPrevReport] = useState([])
  const [message, setMessage] = useState({ message: null, error: null })
  const [selectedCounselee, setSelectedcounselee] = useState({})
  const [formData, setFormData] = useState({
    "Academics": "",
    "Projects": "",
    "Sick Report": "",
    "OLQ": "",
    "Games": "",
    "Cultural": "",
    "Financial": "",
    "Personal": "",
    "HOF's comments": "",
    "CI's comments": "",
    "COMMANDANT'S comments": ""
  })
  var counselId = 12345;
  useEffect(() => {
    axios.get("/counselee/getCounselees?", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(data => {
      console.log(data)
      setCounselees(data.data.data)
      setCounsellor(data.data.counsellor)
    }).catch(err => {
      err = err.response.data
      // setMessage({ error: err?.error, message: null })
      if (err.error == "Not Authorized") {
        localStorage.clear()
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }
    })
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    console.log(formData)
  }


  const ExportCSV = () => {
    if (!selectedCounselee?.service_id)
      return setMessage({ ...message, error: "Service ID is empty" })
    if (!counsellor?.service_id) {
      setMessage({ ...message, error: "Counsellor Service ID is empty" })
      return setTimeout(() => {
        return window.location.href = "/"
      }, 2000);
    }
    axios.post("/user/feedbackreport", {
      service_id: selectedCounselee.service_id,
      counsellor_service_id: counsellor?.service_id,
      academics: formData.Academics,
      projects: formData.Projects,
      sick_report: formData["Sick Report"],
      olq: formData["OLQ"],
      games: formData["Games"],
      cultural: formData["Cultural"],
      financial: formData["Financial"],
      personal: formData["Personal"],
      hof_comments: formData["HOF's comments"],
      ci_comments: formData["CI's comments"],
      commandant_comments: formData["COMMANDANT'S comments"]
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(data => {
      setMessage({ message: data?.data?.message, error: null });

      var fileName = `${selectedCounselee.service_id}_${selectedCounselee.name}_${new Date().toLocaleString()}`;
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const ws = XLSX.utils.json_to_sheet([formData]);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataFile = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(dataFile, fileName + fileExtension);
    }).catch(err => {
      err = err.response.data
      setMessage({ error: err?.error, message: null })
      if (err.error == "Not Authorized") {
        localStorage.clear()
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }

    })
  }
  const GetPrevReport = () => {
    if (!selectedCounselee?.service_id)
      return setMessage({ ...message, error: "Service ID is empty" })
    if (!counsellor?.service_id) {
      setMessage({ ...message, error: "Counsellor Service ID is empty" })
      return setTimeout(() => {
        return window.location.href = "/"
      }, 2000);
    }

    axios.get(`/user/getfeedback?service_id=${selectedCounselee?.service_id}&counsellor_service_id=${counsellor?.service_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(data => {
      console.log(data)
      setPrevReport(data?.data)
    })
  }

  const Reset = () => {
    setSelectedcounselee({})
    setFormData({
      "Academics": "",
      "Projects": "",
      "Sick Report": "",
      "OLQ": "",
      "Games": "",
      "Cultural": "",
      "Financial": "",
      "Personal": "",
      "HOF's comments": "",
      "CI's comments": "",
      "COMMANDANT'S comments": ""
    })
    setPrevReport([])
  }

  return (

    <div class="container">
      {<Snackbar open={message?.error} autoHideDuration={6000} onClose={() => setMessage({ message: null, error: null })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="error">
          <p className="error">{message.error}</p>
        </Alert>

      </Snackbar>}
      {<Snackbar open={message?.message} autoHideDuration={6000} onClose={() => setMessage({ message: null, error: null })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="success">
          <p className="success">{message.message}</p>
        </Alert>

      </Snackbar>}
      <div class="row align-items-start">
        <div class="col-2 col-auto min-vh-100" id="sidebarfeedback-md">
          <div className='row mt-2 mb-3'>
            <div className='col-3'>
              <AccountCircleIcon style={{ fontSize: "xxx-large" }} />
            </div><div className='col-9 text-end'>
              <Fab sx={{ ml: 1 }} variant="extended" onClick={() => { logout(navigate) }} endIcon={<LogoutIcon />}>
                Logout
                <LogoutIcon sx={{ ml: 1 }} />
              </Fab>
            </div></div>
          <h2 style={{ marginBottom: "0" }}>
            <small class="text-muted">{counsellor?.name}</small>
          </h2>
          <p style={{ marginBottom: "0" }}>
            <small class="text-muted">Service ID :{counsellor?.service_id}</small>
          </p>
          <p >
            <small class="text-muted">Rank : {counsellor?.rank}</small>
          </p>
          <select class="form-select" aria-label="Select Counselee" value={counselees ? counselees.indexOf(selectedCounselee) : -1} onChange={(e) => { console.log(counselees[e.target.value]); setSelectedcounselee(counselees[e.target.value]) }}>
            <option selected disabled value={-1}>Select Counselee</option>
            {
              counselees.map((elem, index) => {
                return (
                  <option value={index}>{elem.name} : {elem.service_id}</option>
                )
              })
            }
          </select>
        </div>
        <div class="col-md-10 offset-md-2 col-xs-12">
          <h1 className='mb-3 text-center'>Feedback Form</h1>
          <div className='row mb-3 p-3 position-sticky' id="sidebarfeedback-xs" style={{ backgroundColor: "#0d6efd40" }}>
            <div className='row mt-2 mb-2'>
              <div className='col-3'>
                <AccountCircleIcon style={{ fontSize: "xxx-large" }} />
              </div><div className='col-9 text-end'>
                <Fab sx={{ ml: 1 }} variant="extended" onClick={() => { logout(navigate) }} endIcon={<LogoutIcon />}>
                  Logout
                  <LogoutIcon sx={{ ml: 1 }} />
                </Fab>
              </div></div>
            <div className='col-12'>
              <h2 style={{ marginBottom: "0" }}>
                <small class="text-muted">{counsellor?.name}</small>
              </h2>
              <p style={{ marginBottom: "0" }}>
                <small class="text-muted">Service ID :{counsellor?.service_id}</small>
              </p>
              <p >
                <small class="text-muted">Rank : {counsellor?.rank}</small>
              </p>
            </div>
            <div class="col-12">
              <select class="form-select" aria-label="Select Counselee" onChange={(e) => { console.log(counselees[e.target.value]); setSelectedcounselee(counselees[e.target.value]) }}>
                <option selected disabled>Select Counselee</option>
                {
                  counselees.map((elem, index) => {
                    return (
                      <option value={index}>{elem.name} : {elem.service_id}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <table class="table table-bordered" style={{ width: "auto" }}>
            <tbody>

              <tr>
                <th scope="row">Counselee Name</th>
                <td>{selectedCounselee?.name}</td>
              </tr>
              <tr>
                <th scope="row">Service ID</th>
                <td>{selectedCounselee?.service_id}</td>
              </tr>

            </tbody>
          </table>
          <div class="input-group mb-2">
            <span class="input-group-text">Academics</span>
            <textarea class="form-control" name="Academics" value={formData["Academics"]} aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Projects</span>
            <textarea class="form-control" value={formData["Projects"]} name="Projects" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Sick Report</span>
            <textarea class="form-control" value={formData["Sick Report"]} name="Sick Report" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">OLQ</span>
            <textarea class="form-control" value={formData["OLQ"]} name="OLQ" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Games</span>
            <textarea class="form-control" value={formData["Games"]} name="Games" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Cultural</span>
            <textarea class="form-control" value={formData["Cultural"]} name="Cultural" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Financial</span>
            <textarea class="form-control" value={formData["Financial"]} name="Financial" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Personal</span>
            <textarea class="form-control" value={formData["Personal"]} name="Personal" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">HOF's comments</span>
            <textarea class="form-control" value={formData["HOF's comments"]} name="HOF's comments" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">CI's comments</span>
            <textarea class="form-control" value={formData["CI's comments"]} name="CI's comments" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>
          <div class="input-group">
            <span class="input-group-text">COMMANDANT'S comments</span>
            <textarea class="form-control" value={formData["COMMANDANT'S comments"]} name="COMMANDANT'S comments" aria-label="With textarea" onChange={handleChange} style={{ borderColor: "#adb5bd", color: "black" }}></textarea>
          </div>

          <div className='text-center mt-4 mb-4'>
            <Fab sx={{ mr: 1,mb:1 }} variant="extended" onClick={Reset} endIcon={<RestartAltIcon />} color="error">
              Reset
              <RestartAltIcon sx={{ ml: 1 }} />
            </Fab>
            <Fab sx={{ mr: 1,mb:1 }} variant="extended" onClick={GetPrevReport} endIcon={<LogoutIcon />} color="primary">
              Last Feedback reports
              <LogoutIcon sx={{ ml: 1 }} />
            </Fab>
            <Fab sx={{mb:1}} variant="extended" onClick={ExportCSV} color="success" >

              Generate Report
              <KeyboardArrowRightIcon sx={{ ml: 1 }} />
            </Fab>
          </div>

          <div className='table-responsive'>
            {prevReport?.length > 0 && <table class="table table-hover table-bordered mt-4 table-sm">
              <thead>
                <tr>
                  <th scope="col">Report Date</th>
                  <th scope="col">Academics</th>
                  <th scope="col">Projects</th>
                  <th scope="col">Sick Report</th>
                  <th scope="col">OLQ</th>
                  <th scope="col">Games</th>
                  <th scope="col">Cultural</th>
                  <th scope="col">Financial</th>
                  <th scope="col">Personal</th>
                  <th scope="col">HOF's comments</th>
                  <th scope="col">CI's comments</th>
                  <th scope="col">COMMANDANT's comments</th>
                </tr>
              </thead>
              <tbody>
                {prevReport?.map(report => {
                  return (
                    <tr>
                      <td>{new Date(report?.created_at).toLocaleString()}</td>
                      <td>{report?.academics}</td>
                      <td>{report?.projects}</td>
                      <td>{report?.sick_report}</td>
                      <td>{report?.olq}</td>
                      <td>{report?.games}</td>
                      <td>{report?.cultural}</td>
                      <td>{report?.financial}</td>
                      <td>{report?.personal}</td>
                      <td>{report?.hof_comments}</td>
                      <td>{report?.ci_comments}</td>
                      <td>{report?.commandant_comments}</td>
                    </tr>
                  )
                })}


              </tbody>
            </table>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm