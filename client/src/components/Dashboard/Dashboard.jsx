import React, {useEffect, useState} from 'react'
import User from '../../services/User';
import {Row, Col, Card, Container, ListGroup, Button, Modal, Placeholder, Stack, Badge, Alert, ToastContainer, Toast, Tooltip, OverlayTrigger} from 'react-bootstrap'
import SendMessage from './SendMessage';
import userAvatar from './userAvatar.png'
import './Dashboard.css'

function UserCard(props) {
    return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
            {props.user ?
            <>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  {props.user.username}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item variant="light">
                        <strong>Description:</strong> {props.user.description}
                        <br/>
                        <strong>City:</strong> {props.user.city}
                        <br/>
                        <strong>Country:</strong> {props.user.country}
                        <br/>
                        <strong>Region:</strong> {props.user.region}
                        <br/>
                        <strong>Age:</strong> {new Date().getFullYear() - props.user.age}
                    </ListGroup.Item>
                    <ListGroup.Item variant="light">
                        <strong>Interested in: </strong>
                        <Row>
                            {props.user.Activities.map(activity => <Col key={activity.uuid}><Badge pill bg="primary" >{activity.name}</Badge></Col>)}
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item variant="light">
                        <strong>Available: </strong>    
                        <Row>
                            {props.user.Availabilities.map(availability => <Col key={availability.uuid}><Badge pill bg="success" >{availability.day} {availability.start_time} - {availability.end_time}</Badge></Col>)}
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            </>
            :
            <>
            <Modal.Header closeButton>
                <Placeholder as={Modal.Title} animation="glow" xs={4}>
                    <Placeholder xs={12}/>
                </Placeholder>
            </Modal.Header>
            <Modal.Body>
                <Placeholder as="h6" animation="glow">
                <Placeholder xs={4}/>
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={4}/>
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={4}/>
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={2}/>
                </Placeholder>
                <ListGroup horizontal={'md'}>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                </ListGroup>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={2}/>
                </Placeholder>
                <ListGroup horizontal={'md'}>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Placeholder.Button xs={2}/>
            </Modal.Footer>
            </>
            }
            
        </Modal>
    );
  }



export default function Dashboard(props) {
    const [users, setUsers] = useState(null)
    const [clickedUser, setClickedUser] = useState(null)
    const [userCardShow, setUserCardShow] = useState(false);
    const [sendMessageShow, setSendMessageShow] = useState(false);
    const [queryParams, setQueryParams] = useState([])
    const [onlyMatchedSwitch, setOnlyMatchedSwitch] = useState(false)
    const [activitySwitch, setActivitySwitch] = useState(false)
    const [availabilitySwitch, setAvailabilitySwitch] = useState(false)
    const [countrySwitch, setCountrySwitch] = useState(false)
    const [citySwitch, setCitySwitch] = useState(false)
    const [message, setMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [userUuid, setUserUuid] = useState('')

    const fetchUsers = async () => {
        try {            
            const response = await User.getUsers(queryParams.length > 0 ? '?' + queryParams.join('&') : '')
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            setUsers(response.data)            
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const handleShowMore = (user) => {
        setUserCardShow(true)
        setClickedUser(user)
    }

    useEffect(() => {
        if(onlyMatchedSwitch) {
            setQueryParams((prev) => [...prev, 'onlyMatch=true'])
        } else {
            setQueryParams(queryParams.filter(param => param != 'onlyMatch=true'))
        }
    }, [onlyMatchedSwitch])
    
    const onlyMatchedInfo = (props) => (
        <Tooltip {...props}>
          Show users that match at least one of your activities and one of your availability.
        </Tooltip>
    );

    useEffect(() => {
        if(activitySwitch) {
            setQueryParams((prev) => [...prev, 'activity=true'])
        } else {
            setQueryParams(queryParams.filter(param => param != 'activity=true'))
        }
    }, [activitySwitch])

    const activityInfo = (props) => (
        <Tooltip {...props}>
          Show users that match at least one of your activities.
        </Tooltip>
    );

    useEffect(() => {
        if(availabilitySwitch) {
            setQueryParams((prev) => [...prev, 'availability=true'])
        } else {
            setQueryParams(queryParams.filter(param => param != 'availability=true'))
        }
    }, [availabilitySwitch])

    const availabilityInfo = (props) => (
        <Tooltip {...props}>
          Show users that match at least one of your availability.
        </Tooltip>
    );

    useEffect(() => {
        if(countrySwitch) {
            setQueryParams((prev) => [...prev, 'country=true'])
        } else {
            setQueryParams(queryParams.filter(param => param != 'country=true'))
        }
    }, [countrySwitch])

    const countryInfo = (props) => (
        <Tooltip {...props}>
          Show users that match your country.
        </Tooltip>
    );

    useEffect(() => {
        if(citySwitch) {
            setQueryParams((prev) => [...prev, 'city=true'])
        } else {
            setQueryParams(queryParams.filter(param => param != 'city=true'))
        }
    }, [citySwitch])

    const cityInfo = (props) => (
        <Tooltip {...props}>
          Show users that match your city.
        </Tooltip>
    );

    useEffect(() => {
        fetchUsers()
    }, [queryParams])

    const handleSendMessage = (username, userUuid) => {
        setSendMessageShow(true)
        setMessage(null)
        setUsername(username)
        setUserUuid(userUuid)
    }

    const [user, setUser] = useState(null)

    const fetchUser = async () => {
        try {
            if(!user) {
                const response = await User.getUser()
                if(response.message === "Not authenticated") {
                    props.handleLogin(false)
                    window.localStorage.removeItem('data')
                }
                setUser(response.data)
            }
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const [showNotificationActivity, setShowNotificationActivity] = useState(true)
    const [showNotificationAvailability, setShowNotificationAvailability] = useState(true)

    return (
        <Container>
        <ToastContainer position="top-end" className="p-3" style={{zIndex: 1}}>
            {user && user.Activities.length === 0 &&
            <Toast show={showNotificationActivity} onClose={() => setShowNotificationActivity(!showNotificationActivity)}>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>Please set your activity.</Toast.Body>
            </Toast>
            }
            {user && user.Availabilities.length === 0 &&
            <Toast show={showNotificationAvailability} onClose={() => setShowNotificationAvailability(!showNotificationAvailability)}>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>Please set your availability.</Toast.Body>
            </Toast>
            }
        </ToastContainer>
            {message &&
            <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                {message.message && message.message}
            </Alert>}
            <Stack direction="horizontal" gap={3} className="mt-3 mb-3">
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={onlyMatchedInfo}
            >                
            <div className="form-check form-switch ">
              <input className="form-check-input" type="checkbox" role="switch"  checked={onlyMatchedSwitch} onChange={() => setOnlyMatchedSwitch(!onlyMatchedSwitch)} disabled={user && user.Activities.length > 0 && user.Availabilities.length > 0 ? false : true}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Only matched users</label>
            </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={activityInfo}
            >
            <div className="form-check form-switch ">
              <input className="form-check-input" type="checkbox" role="switch"  checked={activitySwitch} onChange={() => setActivitySwitch(!activitySwitch)} disabled={user && user.Activities.length > 0 ? false : true}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Activity</label>
            </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={availabilityInfo}
            >
            <div className="form-check form-switch ">
              <input className="form-check-input" type="checkbox" role="switch"  checked={availabilitySwitch} onChange={() => setAvailabilitySwitch(!availabilitySwitch)} disabled={user && user.Availabilities.length > 0 ? false : true}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Availability</label>
            </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={countryInfo}
            >
            <div className="form-check form-switch ">
              <input className="form-check-input" type="checkbox" role="switch"  checked={countrySwitch} onChange={() => setCountrySwitch(!countrySwitch)} disabled={user && user.country ? false : true}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Country</label>
            </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                overlay={cityInfo}
            >
            <div className="form-check form-switch ">
              <input className="form-check-input" type="checkbox" role="switch"  checked={citySwitch} onChange={() => setCitySwitch(!citySwitch)} disabled={user && user.city ? false : true}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">City</label>
            </div>
            </OverlayTrigger>
            </Stack>                   
            {
                users ?
                    users.length > 0 ?
                        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                            {users.map((user) => 
                                <Col key={user.uuid}>
                                  <Card>
                                    <Card.Img variant="top" src={userAvatar} />
                                    <Card.Body>
                                        <Card.Title>{user.username}</Card.Title>
                                        <Card.Text className="description" >{user.description ? user.description : "No description"}</Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="text-truncate">                        
                                            <small className="text-muted">{user.Activities.length > 0 ? user.Activities.map(activity => activity.name).join(', ') : 'No activities'}</small>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="text-truncate">
                                        <small className="text-muted">{user.Availabilities.length > 0 ? user.Availabilities.map(availability => `${availability.day} ${availability. start_time} - ${availability.end_time}`).join(', ') : 'No availability'}</small>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Stack gap={1}>
                                            <Button variant="outline-secondary" onClick={() => {handleShowMore(user)}} size="sm">
                                              Show more
                                            </Button>
                                            <Button variant="primary" onClick={() => {handleSendMessage(user.username, user.uuid)}} size="sm">
                                              Send message
                                            </Button>
                                        </Stack>
                                    </Card.Body>
                                  </Card>
                                </Col>
                            )}
                        </Row>
                    :      
                    <Alert variant="info">
                        No matched users found for now. Stay patient, there might be one tomorrow!
                    </Alert>
                :
                <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Col key={idx}>
                          <Card>
                            <Card.Img variant="top" src={userAvatar} />
                            <Card.Body>
                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder                          xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={12}/>
                                </Placeholder>       
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={12}/>
                                </Placeholder>
                                <Placeholder.Button xs={6} variant="outline-secondary"/>
                                <Placeholder.Button xs={6} variant="primary"/>                        
                            </Card.Body>
                          </Card>                  
                        </Col>
                    ))}                
                </Row>
            }
            <UserCard
                user={clickedUser}
                show={userCardShow}
                onHide={() => setUserCardShow(false)}
            />
            <SendMessage
                username={username}
                userUuid={userUuid}
                show={sendMessageShow}
                onHide={() => setSendMessageShow(false)}
                setMessage={setMessage}
                setSendMessageShow={setSendMessageShow}
            />            
        </Container>
    )
}