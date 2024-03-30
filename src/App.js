import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorPage from './DoctorPage';
import PatientPage from './PatientPage';
// import Home from './Home';
import './App.css';
import AllPatientsTable from './AllPatientsTable';
import Navbar from "./Navbar";


function Home() {
  return <div><h2>Home </h2>

<AllPatientsTable />
</div>
}

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
          <header id="logo">Trust<span>Cure+</span></header>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/doctors" className="nav-link">Doctors</Link>
                </li>
                <li className="nav-item">
                  <Link to="/patients" className="nav-link">Patients</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav> */}


<Navbar/>
   

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorPage />} />
          <Route path="/patients" element={<PatientPage/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;