import React from 'react';
import { Button,  Center, Square, Circle , Text} from '@chakra-ui/react'


const Break = props => {
    return (
        <div className='break-container'>
            <h2 id='break-label'>Break Length (mins)</h2>
            
            <div className='button-container'>
                <Button colorScheme='teal' size='xs'
                    id='break-increment'
                    onClick={props.incrementBreak}
                    >
                +
                </Button>

                <Center  h='50px' w='70px' color='black'>
                <Text fontSize='4xl'>{props.breakLength}</Text>
                </Center>

            
                
                <Button colorScheme='teal' size='xs'
                    id='break-decrement'
                    onClick={props.decrementBreak}
                    >
                -
                </Button>
            </div>
        </div>
    )
}

export default Break;