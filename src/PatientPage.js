import React, { useState, useEffect } from 'react';
import axios from 'axios';



const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [newPatient, setNewPatient] = useState({
        name: '',
        weight: 0,
        gender: '',
        age: 0,
        disease: '',
        doctor: {
            id: 0
        }
    });

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State to store the ID of the selected patient

    const fetchPatients = () => {
        axios.get('/patients')
            .then(response => {
                console.log('patient fetch', response.data);
                setPatients(response.data);
            })
            .catch(error => console.error('Error fetching patients:', error));
    };

    const fetchDoctors = () => {
        axios.get('/doctors')
            .then(response => {
                setDoctors(response.data);
                console.log("doctor fetch", response.data);
            })
            .catch(error => console.error('Error fetching doctors:', error));
    };

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
    }, []); // Fetch patients and doctors on component mount


    const handleAddPatient = (e) => {
        e.preventDefault();

        console.log('Before doctor_id', newPatient.doctor);
        console.log('newPatient', newPatient);

        axios.post('/patients', {
            name: newPatient.name,
            weight: newPatient.weight,
            gender: newPatient.gender,
            age: newPatient.age,
            disease: newPatient.disease,
            doctor: newPatient.doctor
        })
            .then(response => {
                console.log('after adding the post doctor_id', newPatient);
                console.log('Patient added:', response.data);
                fetchPatients();
                console.log('after Patient added:', response.data);
                setNewPatient({
                    name: '',
                    weight: '',
                    gender: '',
                    age: '',
                    disease: '',
                    doctor: ''
                });
            })
            .catch(error => console.error('Error adding patient:', error));
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("doctor")) {
            // Update the nested property in newPatient object
            const updatedDoctor = { ...newPatient.doctor, [name.split(".")[1]]: parseInt(value) };
            setNewPatient({ ...newPatient, doctor: updatedDoctor });
        } else {
            setNewPatient({ ...newPatient, [name]: value });
        }
    };

    const handleUpdatePatient = (patientId) => {
        const selected = patients.find(patient => patient.id === patientId);
        setSelectedPatient(selected);
        setIsUpdateModalOpen(true);

    };

    const handleDeletePatient = (patientId) => {
        // Implement delete logic using patientId
        console.log('Deleting patient with ID:', patientId);
        // After deletion, refresh the list of patients
        axios.delete(`/patients/${patientId}`)
            .then(response => {
                console.log('Patient deleted:', response.data);
                // Refresh the list of patients
                fetchPatients();
            })
            .catch(error => console.error('Error deleting patient:', error));
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedPatient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`/patients/${selectedPatient.id}`, selectedPatient)
            .then(response => {
                fetchPatients();
                setIsUpdateModalOpen(false);
                setSelectedPatient(null);
            })
            .catch(error => console.error('Error updating patient:', error));
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false); // Close the update modal
        setSelectedPatient(null);
    };

    return (
        <div>
            <h2>Patients Page</h2>
            <form onSubmit={handleAddPatient}>
                <div>
                    {/* <h3>Add New Patient:</h3> */}
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={newPatient.name} onChange={handleChange} /> <br /><br />

                    <label htmlFor="weight">Weight:</label>
                    <input type="number" name="weight" value={newPatient.weight} onChange={handleChange} /> <br /><br />

                    <label htmlFor="gender">Gender:</label>
                    <input type="text" name="gender" value={newPatient.gender} onChange={handleChange} /> <br /><br />

                    <label htmlFor="age">Age:</label>
                    <input type="number" name="age" value={newPatient.age} onChange={handleChange} /> <br /><br />

                    <label htmlFor="disease">Disease:</label>
                    <input type="text" name="disease" value={newPatient.disease} onChange={handleChange} /> <br /><br />


                    <label htmlFor="doctor_id">Assign Doctor:</label>
                    <select
                        id="doctor"
                        name="doctor.id" // Set name attribute to "doctor.id"
                        value={newPatient.doctor.id}
                        onChange={handleChange} // Use handleChange to handle changes
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialization}
                            </option>
                        ))}
                    </select><br />
                    <button type="submit">Add Patient</button>
                </div>
            </form>
            <div>
                <h3>All Patients </h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Weight</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Disease</th>
                            <th>Assigned Doctor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.id}>
                            <td>{patient.id === (selectedPatient && selectedPatient.id) ?
                                <input type="text" name="name" value={selectedPatient.name} onChange={handleUpdateChange} />
                                : patient.name}</td>
                            <td>{patient.id === (selectedPatient && selectedPatient.id) ?
                                <input type="number" name="weight" value={selectedPatient.weight} onChange={handleUpdateChange} />
                                : patient.weight}</td>
                            <td>{patient.id === (selectedPatient && selectedPatient.id) ?
                                <input type="text" name="gender" value={selectedPatient.gender} onChange={handleUpdateChange} />
                                : patient.gender}</td>
                            <td>{patient.id === (selectedPatient && selectedPatient.id) ?
                                <input type="number" name="age" value={selectedPatient.age} onChange={handleUpdateChange} />
                                : patient.age}</td>
                            <td>{patient.id === (selectedPatient && selectedPatient.id) ?
                                <input type="text" name="disease" value={selectedPatient.disease} onChange={handleUpdateChange} />
                                : patient.disease}</td>
                            <td>{patient.doctor ? patient.doctor.name : 'Not Assigned'}</td>
                            <td>
                                {patient.id === (selectedPatient && selectedPatient.id) ?
                                    <React.Fragment>
                                        <button onClick={handleUpdate}>Save</button>
                                        <button onClick={handleCloseUpdateModal}>Cancel</button>
                                    </React.Fragment>
                                    :
                                    <button onClick={() => handleUpdatePatient(patient.id)}>Update</button>}

                                {!(selectedPatient && selectedPatient.id) &&
                                    <button onClick={() => handleDeletePatient(patient.id)}>Delete</button>}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>



        </div>
    );
};

export default PatientPage;








