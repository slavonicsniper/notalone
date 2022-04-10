import React from 'react'
import {Form} from 'react-bootstrap'

export default function AddActivityFormType(props) {
    const {activityType, setActivityType} = props

    return (
        <Form.Control placeholder="Type" value={activityType} onChange={e => setActivityType(e.target.value)}/>
    )
}