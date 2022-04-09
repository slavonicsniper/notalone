import React, {useEffect, useState} from 'react'
import AuthService from '../../services/AuthService';
import {Alert} from 'react-bootstrap'

function Logout(props) {

  const [logoutMessage, setLogoutMessage] = useState(null)

  const handleLogout = async () => {
    try {
      if(props.loggedIn) {
        const response = await AuthService.logout()
        if(response.status === 'Success'){
          props.handleLogin(false)
          window.localStorage.removeItem('data')
        } 
        setLogoutMessage(response)
      }
    } catch(err) {
      setLogoutMessage(err)
    }
  }

  useEffect(() => {
    handleLogout(props)
  })

  return (
    <Alert variant={logoutMessage ? logoutMessage.status === "Success" ? "success" : "danger" : "light"}>
      { logoutMessage ? logoutMessage.message : "Loading..."}
    </Alert>
  )
}

export default Logout;