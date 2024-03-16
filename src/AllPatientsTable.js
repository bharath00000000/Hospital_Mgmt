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

  const fetchPatients = () => {
    axios.get('/patients')
      .then(response => {
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(error => console.error('Error fetching patients:', error));
  };

  const fetchDoctors = () => {
    axios.get('/doctors')
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
      <h3>All Patients</h3>
      <label htmlFor="doctor">Filter by Doctor:</label>
      <select id="doctor" onChange={handleDoctorChange} value={selectedDoctor}>
        <option value="">All Doctors</option>
        {doctors.map(doctor => (
          <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
        ))}
      </select>
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
          {filteredPatients.map(patient => (
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
    </div>
  );
};

export default AllPatientsTable;
