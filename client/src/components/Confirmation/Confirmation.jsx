import React, {useState, useEffect} from 'react'
import AuthService from '../../services/AuthService';
import {Alert, Container} from 'react-bootstrap'
import { useParams } from "react-router-dom";

function Confirmation() {
    const params = useParams();
    const [message, setMessage] = useState(null)

    const verifyUser = async () => {
      try {
        const response = await AuthService.verifyUser(params.confirmationCode) 
        setMessage(response)
      } catch(error) {
        console.log(error)
        setMessage({status: "Failed", message: "Something went wrong!"})
      }
    }

    useEffect(() => {
      verifyUser()
    }, []);

    return (
      <Container>
      {message &&
      <Alert variant={message.status === "Failed" ? "danger" : "success"}>
        {message.message && message.message}
      </Alert>
      }
      </Container>
      
    )
}

export default Confirmation;
