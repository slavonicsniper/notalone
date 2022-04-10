import React, {useEffect, useState} from 'react'
import {Stack, Form, Button, Alert} from 'react-bootstrap'
import Activity from '../../services/Activity';
import AddActivityList from './AddActivityList';

export default function AddActivityForm(props) {
    const [fetchedActivities, setFetchedActivities] = useState([])
    const [activityExist, setActivityExist] = useState('')
    const [activityTypeExist, setActivityTypeExist] = useState('')
    const [activityNew, setActivityNew] = useState('')
    const [activityTypeNew, setActivityTypeNew] = useState('')
    const [activityTypeDisable, setActivityTypeDisable] = useState(false)
    const [existingActivities, setExistingActivities] = useState([])
    const [newActivities, setNewActivities] = useState([])
    const [data, setData] = useState(null)
    const [message, setMessage] = useState(null)

    const getFetchedActivities = async () => {
        try {
            if(fetchedActivities.length === 0) {
                const response = await Activity.fetchActivities()
                if(response.status === 'Success') {
                    setFetchedActivities(response.data)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    const handleChangeActivity = e => {
        const foundActivity = fetchedActivities.filter(activity => activity.name === e.target.value)
        setActivityTypeExist('')
        if(foundActivity.length > 0) {
            setActivityTypeExist(foundActivity[0].type)
            setActivityExist(foundActivity[0].name)
            setActivityTypeDisable(true)
        } else {
            setActivityTypeDisable(false)
            setActivityNew(e.target.value)
        }
    }

    const addActivities = () => {
        setMessage(null)
        if(activityTypeExist) {
            if(existingActivities.find(activity => activity.name === activityExist && activity.type === activityTypeExist)) {
                setMessage({status: "Failed", message: 'Activity already added'})
            } else {
                setExistingActivities(prev => [...prev, {name: activityExist, type: activityTypeExist}])
            }
        } else {
            if(newActivities.find(activity => activity.name === activityNew && activity.type === activityTypeNew)) {
                setMessage({status: "Failed", message: 'Activity already added'})
            } else {
            setNewActivities(prev => [...prev, {name: activityNew, type: activityTypeNew}])
            }
        }
        
    }

    const removeActivity = (clickedActivity) => {
        setExistingActivities(existingActivities.filter(activity => activity.name !== clickedActivity))
        setNewActivities(newActivities.filter(activity => activity.name !== clickedActivity))
    }

    const handleSave = () => {
        setData({existingActivities, newActivities})
    }

    const saveActivities = async (data) => {
        setMessage(null)
        let response = {}
        try {
            response = await Activity.saveActivities(data)
            if(response.status === "Success") {
                setMessage(response)
                setData(null)
            }
        } catch(err) {
            setMessage({status: "Failed", message: response.error})
            console.log(err)
        }
    }

    const handleReset = () => {
        setExistingActivities([])
        setNewActivities([])
        setActivityTypeDisable(false)
        setActivityExist('')
        setActivityNew('')
        setActivityTypeExist('')
        setActivityTypeNew('')
    }

    useEffect(() => {
        if(data) {
            saveActivities(data)
        }
    }, [data])

    return (
        <>
        {message &&
        <Alert variant={message.status === "Failed" ? "danger" : "success"}>
            {message.message && message.message}
        </Alert>
        }
        <Stack direction="horizontal" gap={3}>
            <input className="form-control me-auto" list="datalistOptions" id="exampleDataList" placeholder="Search or add an activity" onClick={getFetchedActivities} onChange={handleChangeActivity}/>
            <datalist id="datalistOptions">
                {fetchedActivities.map(fetchedActivity => <option key={fetchedActivity.name} value={fetchedActivity.name}/>)}
            </datalist>            
            <Form.Control placeholder="Type" value={activityTypeExist ? activityTypeExist : activityTypeNew} onChange={e => setActivityTypeNew(e.target.value)} disabled={activityTypeDisable}/>
            <Button variant="secondary" onClick={addActivities}>Add</Button>
            <div className="vr" />
            <Button variant="outline-danger" onClick={handleReset}>Reset</Button>            
        </Stack>
        <h6>Existing activities</h6>
        {existingActivities.map(activity => <AddActivityList key={activity.name} activity={activity} removeActivity={removeActivity}/>)}
        <h6>New activities</h6>
        {newActivities.map(activity => <AddActivityList key={activity.name} activity={activity} removeActivity={removeActivity}/>)}
        {existingActivities.length > 0 ? <Button variant="primary" onClick={handleSave} className="col-md-3 mx-auto">Save</Button> : newActivities.length > 0 ? <Button variant="primary" onClick={handleSave} className="col-md-3 mx-auto">Save</Button> : null}
        </>
    )
}