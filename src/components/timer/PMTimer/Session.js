import React from 'react';
import { Button,  Center, Square, Circle , Text} from '@chakra-ui/react'


const Session = props => {
    return (
        <div className='session-container'>
            <h2 id='session-label'>Session Length (mins)</h2>
            
            <div className='button-container'>
            <Button colorScheme='teal' size='xs'
                    id='session-increment'
                    onClick={props.incrementSession}
                    >
                +
                </Button>

                <Center  h='50px' w='70px' color='black'>
                <Text fontSize='4xl'>{props.sessionLength}</Text>
                </Center>
                
                
                <Button colorScheme='teal' size='xs'
                    id='session-decrement'
                    onClick={props.decrementSession}
                    >
                -
                </Button>
            </div>
        </div>
    )
}

export default Session;