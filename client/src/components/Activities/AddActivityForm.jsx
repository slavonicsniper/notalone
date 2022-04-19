import React, {useEffect, useState} from 'react'
import {Stack, Form, Button, Alert} from 'react-bootstrap'
import Activity from '../../services/Activity';
import AddActivityList from './AddActivityList';
import {Formik} from 'formik'
import * as yup from 'yup';

const schema = yup.object().shape({
    activity: yup.string()
        .required("Required")
        .lowercase()
        .strict()
        .matches(/^[A-Za-z]+$/, "Only English letters"),
    activityType: yup.string()
        .required("Required")
        .lowercase()
        .strict()
        .matches(/^[A-Za-z]+$/, "Only English letters"),
  });

export default function AddActivityForm(props) {
    const [fetchedActivities, setFetchedActivities] = useState([])
    const [activityExist, setActivityExist] = useState('')
    const [activityTypeExist, setActivityTypeExist] = useState('')
    const [activityNew, setActivityNew] = useState('')
    const [activityTypeNew, setActivityTypeNew] = useState('')
    const [activityTypeDisable, setActivityTypeDisable] = useState(false)
    const [existingActivities, setExistingActivities] = useState([])
    const [newActivities, setNewActivities] = useState([])
    const [message, setMessage] = useState(null)
    const [fetchedUserActivities, setFetchedUserActivities] = useState([])
    const [fetchedUserActivitiesToDisplay, setFetchedUserActivitiesToDisplay] = useState([])
    const [activitiesToDelete, setActivitiesToDelete] = useState([])
    const [loading, setLoading] = useState(true)

    const getFetchedActivities = async () => {
        try {
            if(fetchedActivities.length === 0) {
                const response = await Activity.fetchActivities()
                if(response.message === "Not authenticated") {
                    props.handleLogin(false)
                    window.localStorage.removeItem('data')
                }
                if(response.status === 'Success') {
                    setFetchedActivities(response.data)
                }
            }
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const getFetchedUserActivities = async () => {
        try {
            if(fetchedUserActivities.length === 0) {
                const response = await Activity.fetchUserActivities()
                if(response.message === "Not authenticated") {
                    props.handleLogin(false)
                    window.localStorage.removeItem('data')
                }
                if(response.status === 'Success') {
                    setFetchedUserActivities(response.data)
                    setFetchedUserActivitiesToDisplay(response.data)
                }
                setLoading(false)
            }
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const handleResetCustom = () => {
        setFetchedUserActivitiesToDisplay(fetchedUserActivities)
        setActivitiesToDelete([])
        setExistingActivities([])
        setNewActivities([])
        setActivityTypeDisable(false)
        setActivityExist('')
        setActivityNew('')
        setActivityTypeExist('')
        setActivityTypeNew('')
        setMessage('')
    }

    useEffect(() => {
        getFetchedUserActivities()
        
    }, [fetchedUserActivities])

    useEffect(() => {
        if(fetchedUserActivities.length === 0 && !loading) {
            setMessage({status: "Info", message: "In order to be visible for other users you need to add at least one activity."})
        } else {
            setMessage(null)
        }
    }, [loading])

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

    const deleteActivity = (clickedActivity) => {
        setActivitiesToDelete(prev => [...prev, clickedActivity])
        setFetchedUserActivitiesToDisplay(fetchedUserActivitiesToDisplay.filter(activity => activity.uuid !== clickedActivity))
    }

    const saveActivities = async () => {
        try {
            const response = await Activity.saveActivities({existingActivities, newActivities})
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            if(response.status === "Success") {                
                setExistingActivities([])
                setNewActivities([])
                setFetchedUserActivities([])
            }
            setMessage(response)
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const deleteActivities = async () => {
        try {
            const response = await Activity.deleteActivities({deleteActivities: activitiesToDelete})
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            if(response.status === "Success") {                
                setActivitiesToDelete([])
                setFetchedUserActivities(fetchedUserActivitiesToDisplay)
            }
            setMessage(response)
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    return (
        <>
        {message &&
        <Alert variant={(message.status === "Failed" && "danger") || (message.status === "Success" && "success") || (message.status === "Info" && "info")}>
            {message.message && message.message}
        </Alert>
        }
        <Formik
        validationSchema={schema}        
        onSubmit={addActivities}
        initialValues={{
            activity: '',
            activityType: activityTypeExist ? activityTypeExist : activityTypeNew
        }}
        >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          handleReset,
          values,
          touched,
          errors,
          isSubmitting,
          dirty
        }) => (
        <Form onSubmit={handleSubmit}>
        <Stack direction="horizontal" gap={3}>
            <input 
            className={
                touched.activity && errors.activity 
                    ? "form-control me-auto is-invalid"
                    : touched.activity && !errors.activity
                        ? "form-control me-auto is-valid"
                        : "form-control me-auto"
            }
            list="datalistOptions" 
            id="exampleDataList" 
            placeholder="Search or add an activity"
            name="activity"
            value={values.activity}
            onClick={getFetchedActivities} 
            onChange={e => {
                handleChange(e)
                handleChangeActivity(e)}}
            onBlur={handleBlur}
            />
            <datalist id="datalistOptions">
                {fetchedActivities.map(fetchedActivity => <option key={fetchedActivity.name} value={fetchedActivity.name}/>)}
            </datalist>
            {touched.activity && errors.activity && (
              <div className="invalid-feedback">{errors.activity}</div>
            )}
            <Form.Control 
            placeholder="Type"
            name="activityType"
            value={values.activityType} 
            onChange={e => {
                handleChange(e)
                setActivityTypeNew(e.target.value)}}
            onBlur={handleBlur}
            isInvalid={touched.activityType && errors.activityType}
            isValid={touched.activityType && !errors.activityType}
            disabled={activityTypeDisable}/>
            {touched.activityType && errors.activityType && (
              <div className="invalid-feedback">{errors.activityType}</div>
            )}
            <Button type="submit" variant="secondary">Add</Button>
            <div className="vr" />
            <Button 
            variant="outline-danger" 
            onClick={() => {
                handleReset()
                handleResetCustom()}} 
            >Reset</Button>            
        </Stack>
        </Form>
        )}
        </Formik>        
        <h6>Existing activities</h6>
        {fetchedUserActivitiesToDisplay.map(activity => <AddActivityList key={activity.name} activity={activity} deleteActivity={deleteActivity}/>)}
        {activitiesToDelete.length > 0 && <Button variant="primary" onClick={deleteActivities} className="col-md-3 mx-auto">Delete</Button>}
        <h6>New activities</h6>
        {existingActivities.map(activity => <AddActivityList key={activity.name} activity={activity} removeActivity={removeActivity}/>)}
        {newActivities.map(activity => <AddActivityList key={activity.name} activity={activity} removeActivity={removeActivity}/>)}
        {existingActivities.length > 0 ? <Button variant="primary" onClick={saveActivities} className="col-md-3 mx-auto">Save</Button> : newActivities.length > 0 ? <Button variant="primary" onClick={saveActivities} className="col-md-3 mx-auto">Save</Button> : null}

        </>
    )
}