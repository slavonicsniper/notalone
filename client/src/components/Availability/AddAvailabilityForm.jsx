import React, {useEffect, useState} from 'react'
import {Stack, Form, Button, Alert} from 'react-bootstrap'
import Availability from '../../services/Availability';
import AddAvailabilityList from './AddAvailabilityList';

export default function AddAvailabilityForm(props) {
    const [defaultTimeArr, setDedaultTimeArr] = useState([])
    const [startTimeArr, setStartTimeArr] = useState([])
    const [endTimeArr, setEndTimeArr] = useState([])
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [startTime, setStartTime] = useState('00:00')
    const [endTime, setEndTime] = useState('00:30')
    const [day, setDay] = useState('Monday')
    const [newAvailabilities, setNewAvailabilities] = useState([])
    const [message, setMessage] = useState(null)
    const [fetchedUserAvailabilities, setFetchedUserAvailabilities] = useState([])
    const [fetchedUserAvailabilitiesToDisplay, setFetchedUserAvailabilitiesToDisplay] = useState([])
    const [availabilitiesToDelete, setAvailabilitiesToDelete] = useState([])
    const [loading, setLoading] = useState(true)

    const renderAvailableTimeArray = () => {
        let arr = []
        let hour = ''
        let min = ''
        for(let i = 0; i<24; i++) {
            if(i < 10) {
                hour = '0'+i
            } else {
                hour = i.toString()
            }
            for(let j = 0; j<46; j+=15) {
                if(j === 0) {
                    min = j+'0'
                } else {
                    min = j.toString()
                }
                arr.push(`${hour}:${min}`)
            }
        }
        setDedaultTimeArr(arr)
        setStartTimeArr(arr.slice(0, -1))
        setEndTimeArr(arr.slice(2))
    }

    if(defaultTimeArr.length === 0) {
        renderAvailableTimeArray()
    }
    
    const handleStartimeChange = (e) => {
        setStartTime(e.target.value)
        if(e.target.value === "23:30") {
            setEndTimeArr(["00:00"])
        } else {
            const endTimeArrIndex = defaultTimeArr.findIndex(time => time === e.target.value)
            const newEndTimeArrArr = defaultTimeArr.slice(endTimeArrIndex + 2)
            setEndTimeArr(newEndTimeArrArr)
        }
    }

    const addAvailabilities = () => {
        setMessage(null)
            if(newAvailabilities.find(availability => availability.day === day && availability.start_time === startTime && availability.end_time === endTime)) {
                setMessage({status: "Failed", message: 'Availability already added'})
            } else {
                setNewAvailabilities(prev => [...prev, {day, start_time: startTime, end_time: endTime}])
            }
    }

    const removeAvailability = (clickedAvailability) => {
        setNewAvailabilities(newAvailabilities.filter(availability => `${availability.day}-${availability.start_time}-${availability.end_time}` !== clickedAvailability))
    }

    const deleteAvailability = (clickedAvailability) => {
        setAvailabilitiesToDelete(prev => [...prev, clickedAvailability])
        setFetchedUserAvailabilitiesToDisplay(fetchedUserAvailabilitiesToDisplay.filter(availability => availability.uuid !== clickedAvailability))
    }

    const getFetchedUserAvailabilities = async () => {
        try {
            if(fetchedUserAvailabilities.length === 0) {
                const response = await Availability.fetchUserAvailabilities()
                if(response.message === "Not authenticated") {
                    props.handleLogin(false)
                    window.localStorage.removeItem('data')
                }
                if(response.status === 'Success') {
                    setFetchedUserAvailabilities(response.data)
                    setFetchedUserAvailabilitiesToDisplay(response.data)
                }
                setLoading(false)           
            }
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const handleReset = () => {
        setFetchedUserAvailabilitiesToDisplay(fetchedUserAvailabilities)
        setAvailabilitiesToDelete([])
        setNewAvailabilities([])
        setDay('Monday')
        setStartTime('00:00')
        setEndTime('00:30')
        setMessage(null)
    }

    useEffect(() => {
        getFetchedUserAvailabilities()
    }, [fetchedUserAvailabilities])

    useEffect(() => {
        if(fetchedUserAvailabilities.length === 0 && !loading) {
            setMessage({status: "Info", message: "In order to be visible for other users you need to add at least one availability."})
        } else {
            setMessage(null)
        }
    }, [loading])

    const saveAvailabilities = async () => {
        try {
            const response = await Availability.saveAvailabilities(newAvailabilities)
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            if(response.status === "Success") {
                setNewAvailabilities([])
                setFetchedUserAvailabilities([])
            }
            setMessage(response)
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const deleteAvailabilities = async () => {
        try {
            const response = await Availability.deleteAvailabilities({deleteAvailabilities: availabilitiesToDelete})
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            if(response.status === "Success") {                
                setAvailabilitiesToDelete([])
                setFetchedUserAvailabilities(fetchedUserAvailabilitiesToDisplay)
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
        <Stack direction="horizontal" gap={3}>
            <Stack>
                <Form.Label>Day</Form.Label>
                <Form.Select aria-label="Day" onChange={(e) => setDay(e.target.value)}>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                </Form.Select>
            </Stack>
            <Stack>
                <Form.Label>Start time</Form.Label>
                <Form.Select aria-label="Start time" onChange={handleStartimeChange}>
                    {startTimeArr.map(time => <option key={time} value={time}>{time}</option>)}
                </Form.Select>
            </Stack>
            <Stack>
                <Form.Label>End time</Form.Label>
                <Form.Select aria-label="End time" onChange={(e) => setEndTime(e.target.value)}>
                    {endTimeArr.map(time => <option key={time} value={time}>{time}</option>)}
                </Form.Select>
            </Stack>
            <Button variant="secondary" onClick={addAvailabilities}>Add</Button>
            <div className="vr" />
            <Button variant="outline-danger" onClick={handleReset}>Reset</Button>            
        </Stack>
        <h6>Existing availabilities</h6>
        {fetchedUserAvailabilitiesToDisplay.map(availability => <AddAvailabilityList key={availability.uuid} availability={availability} deleteAvailability={deleteAvailability}/>)}
        {availabilitiesToDelete.length > 0 && <Button variant="primary" onClick={deleteAvailabilities} className="col-md-3 mx-auto">Delete</Button>}
        <h6>New availabilities</h6>
        {newAvailabilities.map(availability => <AddAvailabilityList key={`${availability.day}-${availability.start_time}-${availability.end_time}`} availability={availability} removeAvailability={removeAvailability}/>)}
        {newAvailabilities.length > 0 && <Button variant="primary" onClick={saveAvailabilities} className="col-md-3 mx-auto">Save</Button>}
        </>
    )
}