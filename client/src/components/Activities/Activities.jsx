import React, {useEffect, useState} from 'react'
import {Container, Stack} from 'react-bootstrap'
import AddActivityForm from './AddActivityForm';

export default function Activities() {
    return (
        <Container className="mt-3">
            <Stack gap={3}>
                <AddActivityForm/>
            </Stack>
        </Container>        
    )
}