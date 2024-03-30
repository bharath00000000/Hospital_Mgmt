import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);
//"proxy": "http://localhost:8080/",
  const fetchPatients = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/patients`)
      .then(response => {
        console.log(response.data)
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(error => console.error('Error fetching patients:', error));
  };

  const fetchDoctors = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/doctors`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => console.error('Error fetching doctors:', error));
  };

  const handleDoctorChange = (event) => {
    const selectedDoctorId = event.target.value;
    setSelectedDoctor(selectedDoctorId);
    if (selectedDoctorId === '') {
      setFilteredPatients(patients);
      
    } else {
      const filtered = patients.filter(patient => patient.doctor && patient.doctor.id === parseInt(selectedDoctorId));
      setFilteredPatients(filtered);
    }
  };

  return (
    <div>
      {/* <h3>Home </h3> */}
      <label htmlFor="doctor">Select a Doctor:</label>
      <select id="doctor" onChange={handleDoctorChange} value={selectedDoctor}>
        <option value="">All Doctors</option>
        {Array.isArray(doctors) && doctors?.map(doctor => (
          <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
        ))}
      </select>
      {filteredPatients.length === 0 ? (
        <p>No patients have been assigned to this doctor.</p>
      ) : (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Weight</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Disease</th>
            <th>Assigned Doctor</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredPatients) && filteredPatients?.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.weight}</td>
              <td>{patient.gender}</td>
              <td>{patient.age}</td>
              <td>{patient.disease}</td>
              <td>{patient.doctor ? patient.doctor.name : 'Not Assigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
       )}
    </div>
  );
};

export default AllPatientsTable;