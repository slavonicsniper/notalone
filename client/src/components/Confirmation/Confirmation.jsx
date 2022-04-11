import React, {useState, useEffect} from 'react'
import AuthService from '../../services/AuthService';
import {Alert, Container} from 'react-bootstrap'
import { useParams } from "react-router-dom";

function Confirmation() {
    let params = useParams();
    const initialResponse = { message: '', alertVariant: '' };
    const [response, setResponse] = useState(initialResponse);

    useEffect( async e => {
        try {
            const res = await AuthService.verifyUser(params.confirmationCode) 
            if(res.status === 'Success'){
              setResponse(({message: res.message, alertVariant: 'success'}));
            } else{
              setResponse(({message: res.message, alertVariant: 'danger'}));
            }
          } catch(error) {
            console.log(error)
          }
    }, []);

    return (
        <div>
            <Container className="d-flex vh-100 justify-content-center align-items-center">
                {response.message && 
                <Alert variant={response.alertVariant}>
                    {response.message}
                </Alert>
                }
            </Container>
        </div>
    )
}

export default Confirmation;
