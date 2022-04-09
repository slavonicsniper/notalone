import React, {useState, useEffect} from 'react'
import AuthService from '../../services/AuthService';
import { useParams } from "react-router-dom";
import './Confirmation.css'

function Confirmation() {

    let params = useParams();
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("");
    console.log(params.confirmationCode);

    useEffect(() => {
        setMessage("");

        AuthService.verifyUser(params.confirmationCode).then((response) => {
        if(response.hasOwnProperty('message')){
            setMessage(response.message);
            setColor('green');
        } else {
            setMessage(response.error);
            setColor('red');
        }
        });
    }, []);

    return (
        <div className='main-login'>
            {message.length > 0 &&
            <div className={'alert ' + color}>
              {message}
            </div>
          }
        </div>
    )
}

export default Confirmation;
