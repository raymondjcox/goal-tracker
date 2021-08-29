import { useEffect, useState } from "react"
import {
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalHeader,
  ModalFooter,
  Badge,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react"
import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { Goal } from "@prisma/client"

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
    refetchQueries: ["GoalQuery"],
  })
  const [updateGoal] = useMutation(GoalUpdateMutation, {
    refetchQueries: ["GoalQuery"],
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

export default CreateOrUpdateGoalModal
