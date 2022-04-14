import React, {useState} from 'react'
import Message from '../../services/Message';
import {Button, Modal, Placeholder, Form, Alert} from 'react-bootstrap'

export default function SendMessage(props) {
    const [messageContent, setMessageContent] = useState('')
    const {message, setMessage} = props

    const handleSend = async () => {
        try {
            const response = await Message.send({
                messageUuid: props.messageUuid && props.messageUuid,
                to: props.userUuid,
                message: messageContent
            })
            if(response.error) {
                setMessage({status: 'Failed', message: 'Something went wrong!'})
            } else {
                setMessage(response)
            }           
            setMessageContent('')
            props.fetchallMessages()
        } catch(err) {
            console.log(err)
            setMessage({status: 'Failed', message: err})
        }
    }
    return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
            {props.username ?
            <>
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.username}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>                
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(e) => setMessageContent(e.target.value)}/>
                  </Form.Group>
                </Form>
                {message &&
                <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                    {message.message && message.message}
                </Alert>
                }                
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSend} disabled={messageContent ? false : true}>Send</Button>
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
            </Modal.Body>
            <Modal.Footer>
                <Placeholder.Button xs={2}/>
            </Modal.Footer>
            </>
            }
        </Modal>
    );
}