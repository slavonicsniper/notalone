import React from 'react'
import {Stack, CloseButton} from 'react-bootstrap'

export default function AddActivityList(props) {
    const {activity, deleteActivity, removeActivity} = props

    const handleDelete = (e) => {
        if(deleteActivity) {
            deleteActivity(e.target.id)
        } else {
            console.log('removeActivity called')
            removeActivity(e.target.id)
        }
    }

    return (
        <Stack direction="horizontal" className="bg-light rounded-pill p-2" gap={3}>
            <div>{activity.name}</div>
            <div className="vr" />
            <div>{activity.type}</div>
            <div className="ms-auto">
                <CloseButton id={deleteActivity ? activity.uuid : activity.name} onClick={handleDelete}/>
            </div>
        </Stack>
    )
}