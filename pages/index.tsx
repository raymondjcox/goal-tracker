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
  CircularProgress,
  CircularProgressLabel,
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

const GoalUpdateMutation = gql`
  mutation GoalUpdateMutation($name: String!, $type: String!, $id: Int!) {
    updateGoal(name: $name, type: $type, id: $id) {
      name
      type
      id
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

const CreateOrUpdateGoalModal: React.FC<{
  onClose: () => void
  isOpen: boolean
  goal?: Goal
}> = ({ onClose, isOpen, goal }) => {
  const [name, setName] = useState("")
  const defaultValue = "personal"
  const [type, setType] = useState(defaultValue)
  useEffect(() => {
    if (isOpen) {
      setType(goal?.type ?? defaultValue)
      setName(goal?.name ?? "")
    }
  }, [isOpen, goal])

  const [createGoal] = useMutation(GoalCreateMutation, {
    refetchQueries: [GoalQuery],
  })
  const [updateGoal] = useMutation(GoalUpdateMutation, {
    refetchQueries: [GoalQuery],
  })

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{goal ? "Update goal" : "Add new goal"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            onChange={e => setName(e.target.value)}
            value={name}
            placeholder="Goal name"
            autoFocus
            size="md"
          />
          <RadioGroup value={type} onChange={type => setType(type)} mt="4">
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
                goal
                  ? updateGoal({ variables: { name, type, id: goal.id } })
                  : createGoal({ variables: { name, type } })
                onClose()
              }}
              colorScheme="green"
            >
              {goal ? "Update" : "Create"}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

/*
  *
  *
                    <CircularProgress
                      size="24px"
                      value={Math.random() * 100}
                      color="blue.200"
                      thickness="16px"
                      mr="4"
                    ></CircularProgress>
  * */

const GoalsTable: React.FC = () => {
  const { data, loading, error } = useQuery<{ goals: Goal[] }>(GoalQuery)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteGoal] = useMutation(GoalDeleteMutation, {
    refetchQueries: [GoalQuery],
  })

  return (
    <>
      <CreateOrUpdateGoalModal
        goal={editingGoal}
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
      />
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
                    <Flex fontWeight="semibold" color="gray.600">
                      {goal.name}
                    </Flex>
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
                        <MenuItem onClick={() => setEditingGoal(goal)}>
                          Edit
                        </MenuItem>
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
    </>
  )
}

const App = () => {
  const [showAddNewModal, setShowAddNewModal] = useState(false)
  return (
    <Box bgColor="gray.100" maxW="100vw" minH="100vh" display="flex">
      <>
        <CreateOrUpdateGoalModal
          onClose={() => setShowAddNewModal(false)}
          isOpen={showAddNewModal}
        />
        <Box w="100%" m="28" p="20" bgColor="white" borderRadius="lg">
          <Flex alignItems="center" pb="5">
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
