import { useEffect, useState } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalHeader,
  ModalFooter,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  Spinner,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Badge,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"
import { Goal } from "@prisma/client"

const GoalQuery = gql`
  query GoalQuery {
    goals {
      id
      name
      type
    }
  }
`

const GoalCreateMutation = gql`
  mutation GoalCreateMutation($name: String!, $type: String!) {
    createGoal(name: $name, type: $type) {
      name
      type
    }
  }
`

const GoalDeleteMutation = gql`
  mutation GoalDeleteMutation($id: Int!) {
    deleteGoal(id: $id) {
      id
    }
  }
`

const AddNewModal: React.FC<{
  onClose: () => void
  isOpen: boolean
}> = ({ onClose, isOpen }) => {
  const [name, setName] = useState("")
  const defaultValue = "personal"
  const [type, setType] = useState(defaultValue)
  useEffect(() => {
    if (isOpen) {
      setType(defaultValue)
    }
  }, [isOpen])
  const [createGoal] = useMutation(GoalCreateMutation, {
    refetchQueries: [GoalQuery],
  })

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new goal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            onChange={e => setName(e.target.value)}
            placeholder="Goal name"
            size="md"
          />
          <RadioGroup
            defaultValue={defaultValue}
            onChange={type => setType(type)}
            mt="4"
          >
            <Stack>
              <Radio value="personal" colorScheme="blue">
                <Badge colorScheme="blue">Personal</Badge>
              </Radio>
              <Radio value="work" colorScheme="green">
                <Badge colorScheme="green">Work</Badge>
              </Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing="6">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                createGoal({ variables: { name, type } })
                onClose()
              }}
              colorScheme="green"
            >
              Create
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const GoalsTable: React.FC = () => {
  const { data, loading, error } = useQuery<{ goals: Goal[] }>(GoalQuery)
  const [deleteGoal] = useMutation(GoalDeleteMutation, {
    refetchQueries: [GoalQuery],
  })

  return (
    <Box maxH="100%">
      {loading ? (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      ) : error ? (
        "ERROR"
      ) : (
        <Table size="lg">
          <Thead>
            <Th></Th>
            <Th></Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {data?.goals.map(goal => (
              <Tr key={goal.id}>
                <Td>
                  <Box fontWeight="semibold" color="gray.600">
                    {goal.name}
                  </Box>
                </Td>
                <Td>
                  {goal.type === "work" ? (
                    <Badge colorScheme="green">Work</Badge>
                  ) : (
                    <Badge colorScheme="blue">Personal</Badge>
                  )}
                </Td>
                <Td align="right">
                  <Menu>
                    <Flex>
                      <MenuButton
                        marginLeft="auto"
                        color="gray.500"
                        fontWeight="bold"
                        size="sm"
                        as={Button}
                        variant="ghost"
                      >
                        ...
                      </MenuButton>
                    </Flex>
                    <MenuList>
                      <MenuItem>Edit</MenuItem>
                      <MenuItem
                        color="red"
                        onClick={() =>
                          deleteGoal({ variables: { id: goal.id } })
                        }
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  )
}

const App = () => {
  const [showAddNewModal, setShowAddNewModal] = useState(false)
  return (
    <Box bgColor="gray.100" maxW="100vw" minH="100vh" display="flex">
      <>
        <AddNewModal
          onClose={() => setShowAddNewModal(false)}
          isOpen={showAddNewModal}
        />
        <Box w="100%" m="28" p="20" bgColor="white" borderRadius="lg">
          <Flex alignItems="center" pb="10">
            <Box fontSize="3xl" fontWeight="semibold" mr="5">
              My goals
            </Box>
            <Button
              onClick={() => setShowAddNewModal(true)}
              colorScheme="green"
              size="xs"
            >
              Add new
            </Button>
          </Flex>
          <GoalsTable />
        </Box>
      </>
    </Box>
  )
}

export default App
