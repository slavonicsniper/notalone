import React, {useEffect, useState} from 'react'
import AuthService from '../../services/AuthService';
import {Alert, Container} from 'react-bootstrap'

function Logout(props) {
  const [message, setMessage] = useState(null)

  const handleLogout = async () => {
    try {
      if(props.loggedIn) {
        const response = await AuthService.logout()
        if(response.status === 'Success'){
          props.handleLogin(false)
          window.localStorage.removeItem('data')
        } 
        setMessage(response)
      }
    } catch(err) {
      console.log(err)
      setMessage({status: 'Failed', message: 'Something went wrong!'})
    }
  }

  useEffect(() => {
    handleLogout(props)
  }, [])

  return (
    <Container>
      {message &&
      <Alert variant={message.status === "Failed" ? "danger" : "success"}>
          {message.message && message.message}
      </Alert>}
    </Container>
    
  )
}

export default Logout;