import React, {useState} from 'react'

function ForgotPassword() {

  const [error, setError] = useState('');

  const ForgotPassword = details => {
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: details.email,
        password: details.password 
      })
  };
  fetch('https://notalone-be.herokuapp.com/api/v1/users/login', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
  }

  return (
    <div>
      
    </div>
  )
}

export default ForgotPassword;

