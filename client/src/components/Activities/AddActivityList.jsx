import React from 'react'
import {Stack, CloseButton} from 'react-bootstrap'

export default function AddActivityList(props) {
    const {activity, removeActivity} = props

    return (
        <Stack direction="horizontal" className="bg-light rounded-pill p-2" gap={3}>
            <div>{activity.name}</div>
            <div className="vr" />
            <div>{activity.type}</div>
            <div className="ms-auto">
                <CloseButton id={activity.name} onClick={(e) => removeActivity(e.target.id)}/>
            </div>
        </Stack>
    )
}