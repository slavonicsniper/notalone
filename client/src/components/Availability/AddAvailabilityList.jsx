import React from 'react'
import {Stack, CloseButton} from 'react-bootstrap'

export default function AddAvailabilityList(props) {
    const {availability, removeAvailability} = props
    const {day, start_time, end_time} = availability

    return (
        <Stack direction="horizontal" className="bg-light rounded-pill p-2" gap={3}>
            <div>{day}</div>
            <div className="vr" />
            <div>{`${start_time} - ${end_time}`}</div>
            <div className="ms-auto">
                <CloseButton id={`${day}-${start_time}-${end_time}`} onClick={(e) => removeAvailability(e.target.id)}/>
            </div>
        </Stack>
    )
}