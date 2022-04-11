import React from 'react'
import {Stack, CloseButton} from 'react-bootstrap'

export default function AddAvailabilityList(props) {
    const {availability, deleteAvailability, removeAvailability} = props
    const {day, start_time, end_time} = availability

    const handleDelete = (e) => {
        if(deleteAvailability) {
            deleteAvailability(e.target.id)
        } else {
            console.log('removeActivity called')
            removeAvailability(e.target.id)
        }
    }

    return (
        <Stack direction="horizontal" className="bg-light rounded-pill p-2" gap={3}>
            <div>{day}</div>
            <div className="vr" />
            <div>{`${start_time} - ${end_time}`}</div>
            <div className="ms-auto">
                <CloseButton id={deleteAvailability ? availability.uuid : `${day}-${start_time}-${end_time}`} onClick={handleDelete}/>
            </div>
        </Stack>
    )
}