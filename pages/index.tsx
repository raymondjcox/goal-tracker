import { useState } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"
import { Goal } from "@prisma/client"

const GoalQuery = gql`
  query GoalQuery {
    goals {
      id
      name
    }
  }
`

const GoalMutation = gql`
  mutation GoalMutation($name: String!) {
    createGoal(name: $name) {
      name
    }
  }
`

//const FeedQuery = gql`
//query FeedQuery {
//feed {
//id
//title
//content
//published
//author {
//id
//name
//}
//}
//}
//`
//const { loading, error, data } = useQuery(FeedQuery, {
//fetchPolicy: "cache-and-network",
//})

const AddNewModal: React.FC<{
  onClose: () => void
  isOpen: boolean
}> = ({ onClose, isOpen }) => {
  const [name, setName] = useState("")
  const [createGoal] = useMutation(GoalMutation, {
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
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing="6">
            <Button onClick={onClose}>Close</Button>
            <Button
              onClick={() => {
                createGoal({ variables: { name } })
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

const App = () => {
  const [showAddNewModal, setShowAddNewModal] = useState(false)
  const { data } = useQuery<{ goals: Goal[] }>(GoalQuery)
  return (
    <Box bgColor="gray.100" minW="100vw" minH="100vh" display="flex">
      <>
        <AddNewModal
          onClose={() => setShowAddNewModal(false)}
          isOpen={showAddNewModal}
        />
        <Box w="100%" m="28" p="20" bgColor="white" borderRadius="lg">
          <Flex alignItems="center">
            <Box fontSize="2xl" fontWeight="semibold" mr="5">
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
          {data?.goals?.map(goal => (
            <Box key={goal.id}>{goal.name}</Box>
          ))}
        </Box>
      </>
    </Box>
  )
}

export default App
