import React, { useState, useEffect } from 'react';
import axios from 'axios'; //
import './App.css'

function App() {
  // Define state variables
  const [name, setName] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [updateId, setUpdateId] = useState(null);

  // Fetch phone numbers on mount
  useEffect(() => {
    getPhoneNumbers();
  }, []);

  // Fetch all phone numbers from the server
  const getPhoneNumbers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-phone');
      setPhoneNumbers(response.data.data.phoneNumbers);
    } catch (err) {
      console.error(err);
    }
  };

  // Add or update phone number based on whether updateId is set
  const addOrUpdatePhoneNumber = async () => {
    if (name && phoneNumber) {
      if (updateId) {
        // Update phone number
        try {
          await axios.patch(`http://localhost:8000/update-phone/${updateId}`, {
            name,
            phoneNumber,
          });
          setUpdateId(null);
          setName('');
          setPhone('');
          getPhoneNumbers();
        } catch (err) {
          console.error(err);
        }
      } else {
        // Add phone number
        try {
          await axios.post('http://localhost:8000/add-phone', {
            name,
            phoneNumber,
          });
          setName('');
          setPhone('');
          getPhoneNumbers();
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  // Delete a phone number by id
  const deletePhoneNumber = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/delete-phone/${id}`);
      getPhoneNumbers();
    } catch (err) {
      console.error(err);
    }
  };

  // Update state with the selected phone number
  const updatePhoneNumber = (phoneNumber) => {
    setUpdateId(phoneNumber._id);
    setName(phoneNumber.name);
    setPhone(phoneNumber.phone);
  };

  // Clear state and cancel update
  const cancelUpdate = () => {
    setUpdateId(null);
    setName('');
    setPhone('');
  };

  // Render the component
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'url(./background.jpg)',
      backgroundSize: 'cover',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '5%',
        boxShadow: '0px 0px 10px 1px rgba(0, 0, 0, 0.25)',
        padding: '16px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '40%',
        height: '60%',
        overflow: 'auto',
      }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontFamily: "'Press Start 2P', cursive" }}>PhoneBook</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          addOrUpdatePhoneNumber();
        }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">{updateId ? 'Update' : 'Add'}</button>
          {updateId && (
            <button onClick={cancelUpdate}>
              Cancel
            </button>
          )}
        </form>
        <br></br>
        <table style={{border: '1px solid black'}}>
          <thead style={{borderTop: '1px solid black'}}>
          <tr>
            <th style={{ fontSize: '1.2rem', fontFamily: 'Arial, sans-serif', border: '1px solid black', padding: '8px' }}>
              Action
            </th>
            <th style={{ fontSize: '1.2rem', fontFamily: 'Arial, sans-serif', border: '1px solid black', padding: '8px' }}>
              Name
            </th>
            <th style={{ fontSize: '1.2rem', fontFamily: 'Arial, sans-serif', border: '1px solid black', padding: '8px' }}>
              Phone Number
            </th>
          </tr>
          </thead>
          <tbody>
          {phoneNumbers.map((phoneNumber) => (
            <tr key={phoneNumber._id} style={{border: '1px solid black'}}>
              <td style={{ borderLeft: '1px solid black', fontSize: '1.2rem', fontFamily: 'Arial, sans-serif', borderRight: '1px solid black', padding: '8px' }}>
                <button onClick={() => updatePhoneNumber(phoneNumber)}>Edit</button>
                <button onClick={() => deletePhoneNumber(phoneNumber._id)}>Delete</button>
              </td>
              <td style={{ borderLeft: '1px solid black', fontSize: '1.2rem', fontFamily: 'Arial, sans-serif', borderRight: '1px solid black', padding: '8px' }}>
                {phoneNumber.name}
              </td>
              <td style={{ fontSize: '1.2rem', fontFamily: 'Arial, sans-serif', padding: '8px' }}>
                {phoneNumber.phoneNumber}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;