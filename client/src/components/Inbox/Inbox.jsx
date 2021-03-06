import React ,{useState, useEffect} from 'react'
import Message from '../../services/Message'
import {Tabs, Tab, Container, Button, Stack, ListGroup, Alert} from 'react-bootstrap'
import SendMessage from '../Dashboard/SendMessage'

export default function Inbox(props) {
    const [messages, setMessages] = useState(null)
    const [sendMessageShow, setSendMessageShow] = useState(false);
    const [message, setMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [userUuid, setUserUuid] = useState('')
    const [messageUuid, setMessageUuid] = useState('')

    const fetchallMessages = async () => {
        try {
            const response = await Message.get()
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            setMessages(response.data)
        } catch(err) {
            console.log(err)
            setMessage({status: 'Failed', message: 'Something went wrong!'})
        }
    }

    useEffect(() => {
        fetchallMessages()
    }, [])

    const formatCreatedAt = (date) => {
        const createdAt = new Date(date)
        return createdAt.toLocaleString()
    }

    const handleAnswer = (username, userUuid, messageUuid) => {
        setSendMessageShow(true)
        setMessage(null)
        setUsername(username)
        setUserUuid(userUuid)
        setMessageUuid(messageUuid)
    }

    return (
        <Container className="mb-3 mt-3">
            {message &&
                <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                    {message.message && message.message}
                </Alert>
            }
            <Tabs defaultActiveKey="received" className="mb-3">
                <Tab eventKey="received" title="Received" >
                    <Stack gap={3}>
                        {messages && messages.receivedMessages.map(message =>
                            <ListGroup key={message.uuid}>
                                <ListGroup.Item className="toast-header">
                                    <strong className="me-auto">{message.sender.username}</strong>
                                    <small className="text-muted">{formatCreatedAt(message.createdAt)}</small>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="mb-3">
                                        {message.message}
                                    </div>
                                    <Button variant="primary" onClick={() => handleAnswer(message.sender.username, message.sender.uuid, message.uuid)} size="sm">
                                        Answer
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                    </Stack>
                </Tab>
                <Tab eventKey="sent" title="Sent">
                    <Stack gap={3}>
                        {messages && messages.sentMessages.map(message =>
                                <ListGroup key={message.uuid}>
                                    <ListGroup.Item className="toast-header">
                                        <strong className="me-auto">{message.receiver.username}</strong>
                                        <small className="text-muted">{formatCreatedAt(message.createdAt)}</small>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="mb-3">
                                            {message.message}
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                        )}
                    </Stack>
                </Tab>
                <Tab eventKey="answered" title="Answered">
                    <Stack gap={3}>
                        {messages && messages.answeredMessages.map(message =>
                            <ListGroup key={message.uuid}>
                                <ListGroup.Item className="toast-header">
                                    <strong className="me-auto">{message.sender.username}</strong>
                                    <small className="text-muted">{formatCreatedAt(message.updatedAt)}</small>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="mb-3">
                                        {message.message}
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                    </Stack>                    
                </Tab>
            </Tabs>
            <SendMessage
                username={username}
                userUuid={userUuid}
                messageUuid={messageUuid}
                show={sendMessageShow}
                onHide={() => setSendMessageShow(false)}
                setMessage={setMessage}
                fetchallMessages={fetchallMessages}
                setSendMessageShow={setSendMessageShow}
            />
        </Container>
    )
}