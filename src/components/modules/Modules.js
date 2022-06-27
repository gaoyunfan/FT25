import React, { useState, useEffect } from "react";

import db from "../../config/firebase";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,Button,Collapse,Box,useDisclosure 
} from '@chakra-ui/react'

import { Center, Square, Circle } from '@chakra-ui/react'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,Input
} from '@chakra-ui/react'





  
function Modules() {
  const [moduleCode, setmoduleCode] = useState("");
  const [moduleTitle, setmoduleTitle] = useState("");
  const [user_modList, setuser_modList] = useState([]);
  const [static_modList, setstatic_modList] = useState([]);
  const [updatedmoduleCode, setUpdatedmoduleCode] = useState("");
  const [updatedmoduleTitle, setUpdatedmoduleTitle] = useState("");
  const [dataIdToBeUpdated, setDataIdToBeUpdated] = useState("");

  const { isOpen, onToggle } = useDisclosure()
  
  useEffect(() => {
    db.collection("user_modList").onSnapshot((snapshot) => {
      setuser_modList(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

// for displaying static_mods


useEffect(() => {
  db.collection("static_modList").onSnapshot((snapshot) => {
    setstatic_modList(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    );
  });
}, []);


// above for displaying static_mods





  
  const submit = (e) => {
    e.preventDefault();
    db.collection("user_modList").add({
      mod_code: moduleCode,
      mod_title: moduleTitle,
    });
  
    setmoduleCode("");
    setmoduleTitle("");
  };
  
  const updateData = (e) => {
    e.preventDefault();
    db.collection("user_modList").doc(dataIdToBeUpdated).update({
      mod_code: updatedmoduleCode,
      mod_title: updatedmoduleTitle,
    });
  
    setUpdatedmoduleTitle("");
    setUpdatedmoduleCode("");
    setDataIdToBeUpdated("");
  };

  const deleteData = (id) => {
    db.collection("user_modList").doc(id).delete();
  };
  
  return (
    
      
    <div className="App">
<Center  bg='white'  color='black'>Add modules here</Center>
      <FormControl >


     
      {!dataIdToBeUpdated ? (
        <div >
          <Input
            type="text"
            placeholder="Module Code"
            width = "sm"
            value={moduleCode}
            onChange={(e) => setmoduleCode(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Module Title"
            width = "sm" 
            value={moduleTitle}
            onChange={(e) => setmoduleTitle(e.target.value)}
          />
          <Button  colorScheme='Cyan' onClick={submit}>Add Mod</Button>
        </div>
      ) : (
        <div className="App_Updateform">
          
          <Input
            type="text"
            placeholder="Module Code"

            width = "sm"
            value={updatedmoduleCode}
            onChange={(e) => setUpdatedmoduleCode(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Module Title"
            width = "sm"
            value={updatedmoduleTitle}
            onChange={(e) => setUpdatedmoduleTitle(e.target.value)}
          />
          <Button colorScheme='Cyan' onClick={updateData}>Update</Button>
        </div>
      )}
  </FormControl>
  <Center  bg='white'  color='black'>List of Modules Added </Center>
  <Center  bg='white'  color='black'>
  
  <TableContainer>
  <Table variant='striped' colorScheme='blue'>
  
    <Thead>
      <Tr>
      <th>Module Code</th>
      <th>Module Title</th>
      <th></th>
      <th></th>
      </Tr>
    </Thead>
    <Tbody>
    {user_modList?.map(({ id, data }) => (
            <tr key={id}>
              <td>{data.mod_code}</td>
              <td>{data.mod_title}</td>
              <td>
                <Button
                  onClick={() => {
                    setDataIdToBeUpdated(id);
                    setUpdatedmoduleTitle(data.mod_title);
                    setUpdatedmoduleCode(data.mod_code);
                  }}
                >
                  Update  
                </Button>
              </td>
              <td>
                <Button 
                  onClick={() => {
                    deleteData(id);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </Tbody>


      <Tfoot>
      <Tr>
      <th>Module Code</th>
      <th>Module Title</th>
      <th></th>
      <th></th>
      </Tr>
    </Tfoot>


    </Table>
</TableContainer>
    
</Center>
      
      
          
      
      

                


      <>
      <Button colorScheme='teal' onClick={onToggle}>Show All Modules</Button>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p='40px'
          color='white'
          mt='4'
          bg='white.500'
          rounded='md'
          shadow='md'

        >
          <div className="App__DataDisplay">
        <table>
          <tr>
            <th>Module Code</th>
            <th>Module Title</th>
  
          </tr>
  
          {static_modList?.map(({ id, data }) => (
            <tr key={id}>
              <td>{data.moduleCode}</td>
              <td>{data.title}</td>
              <td>
                
              </td>
              <td>
                
              </td>
            </tr>
          ))}
        </table>
      </div>
        </Box>
      </Collapse>
    </>


    </div>
  
    
  );
}
  
export default Modules;