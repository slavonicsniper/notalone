import React, {useEffect, useState} from 'react'
import {Container, Stack} from 'react-bootstrap'
import AddActivityForm from './AddActivityForm';
import Activity from '../../services/Activity';

export default function Activities() {
    return (
        <Container>
            <Stack gap={3}>
                <AddActivityForm/>
            </Stack>
        </Container>        
    )
}