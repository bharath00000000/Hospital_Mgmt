import React, { useState, useEffect } from 'react';
import axios from 'axios';


const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    salary: 0,
    gender: '',
    age: 0,
    specialization: '',
  });
  console.log(process.env.REACT_APP_BACKEND_URL, "from data of api")
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


  const fetchDoctors = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/doctors`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => console.error('Error fetching doctors:', error));
  };

  useEffect(() => {
    fetchDoctors();
  }, []); // Fetch doctors on component mount

  const handleAddDoctor = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/doctors`, newDoctor)
      .then(response => {
        // console.log('Doctor added:', response.data);
        // Refresh the list of doctors
        fetchDoctors();
        // Clear the newDoctor state for the next entry
        setNewDoctor({
          name: '',
          salary: 0,
          gender: '',
          age: 0,
          specialization: '',
        });
      })
      .catch(error => console.error('Error adding doctor:', error));
  };

  const handleUpdateDoctor = (doctorId) => {
    // Implement update logic using doctorId
    // console.log('Updating doctor with ID:', doctorId);
    const selected = doctors.find(doctor => doctor.id === doctorId);
    setSelectedDoctor(selected);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteDoctor = (doctorId) => {
    // Implement delete logic using doctorId
    console.log('Deleting doctor with ID:', doctorId);
    // After deletion, refresh the list of doctors
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/doctors/${doctorId}`)
      .then(response => {
        console.log('Doctor deleted:', response.data);
        // Refresh the list of doctors
        fetchDoctors();
      })
      .catch(error => console.error('Error deleting doctor:', error));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDoctor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/doctors/${selectedDoctor.id}`, selectedDoctor)
      .then(response => {
        fetchDoctors();
        setIsUpdateModalOpen(false);
        setSelectedDoctor(null); // Reset selectedDoctor after updating
      })
      .catch(error => console.error('Error updating doctor:', error));
  };

  return (
    <div>
      <h2>Doctor </h2>
      <div>
        {/* <h3>All Doctors:</h3> */}
        <label htmlFor="name">Enter Name:</label>
        <input type="text" id="name" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} /> <br /><br />

        <label htmlFor="salary">Enter Salary:</label>
        <input type="number" id="salary" value={newDoctor.salary} onChange={(e) => setNewDoctor({ ...newDoctor, salary: e.target.value })} /><br /><br />

        <label htmlFor="gender">Enter Gender:</label>
        <input type="text" id="gender" value={newDoctor.gender} onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })} /><br /><br />

        <label htmlFor="age">Enter Age:</label>
        <input type="number" id="age" value={newDoctor.age} onChange={(e) => setNewDoctor({ ...newDoctor, age: e.target.value })} /><br /><br />

        <label htmlFor="specialization">Enter Specialization:</label>
        <input type="text" id="specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} /><br /><br />

        <button onClick={handleAddDoctor}>Create</button>
      </div>
      <div>
        <h3>All Doctors </h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(doctors) && doctors?.map(doctor => (
              <tr key={doctor.id}>
                <td>{selectedDoctor && selectedDoctor.id === doctor.id ?
                  <input type="text" name="name" value={selectedDoctor.name} onChange={handleUpdateChange} />
                  : doctor.name}</td>
                <td>{selectedDoctor && selectedDoctor.id === doctor.id ?
                  <input type="number" name="salary" value={selectedDoctor.salary} onChange={handleUpdateChange} />
                  : doctor.salary}</td>
                <td>{selectedDoctor && selectedDoctor.id === doctor.id ?
                  <input type="text" name="gender" value={selectedDoctor.gender} onChange={handleUpdateChange} />
                  : doctor.gender}</td>
                <td>{selectedDoctor && selectedDoctor.id === doctor.id ?
                  <input type="number" name="age" value={selectedDoctor.age} onChange={handleUpdateChange} />
                  : doctor.age}</td>
                <td>{selectedDoctor && selectedDoctor.id === doctor.id ?
                  <input type="text" name="specialization" value={selectedDoctor.specialization} onChange={handleUpdateChange} />
                  : doctor.specialization}</td>
                <td>
                  {selectedDoctor && selectedDoctor.id === doctor.id ?
                    <React.Fragment>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                    </React.Fragment>
                    :
                    <button onClick={() => handleUpdateDoctor(doctor.id)}>Update</button>}
                  {!(selectedDoctor && selectedDoctor.id === doctor.id) &&
                    <button onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorPage;