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
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
} from "@chakra-ui/react"
import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { Goal } from "@prisma/client"

const GoalCreateMutation = gql`
  mutation GoalCreateMutation(
    $name: String!
    $type: String!
    $subgoals: [InputSubGoal!]
  ) {
    createGoal(name: $name, type: $type, subgoals: $subgoals) {
      name
      type
      subgoals {
        completed
      }
    }
  }
`

const GoalUpdateMutation = gql`
  mutation GoalUpdateMutation(
    $name: String!
    $type: String!
    $id: Int!
    $subgoals: [InputSubGoal!]
  ) {
    updateGoal(name: $name, type: $type, id: $id, subgoals: $subgoals) {
      name
      type
      id
      subgoals {
        completed
      }
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
  const [subgoals, setSubgoals] = useState([])
  const DEFAULT_SUBGOAL_TEXT = "Add a subgoal"
  const [newSubgoalName, setNewSubgoalName] =
    useState<string>(DEFAULT_SUBGOAL_TEXT)

  useEffect(() => {
    if (isOpen) {
      setType(goal?.type ?? defaultValue)
      setName(goal?.name ?? "")
      setNewSubgoalName(DEFAULT_SUBGOAL_TEXT)
      setSubgoals(
        goal?.subgoals?.map(({ id, name, completed, createdAt }) => ({
          id,
          name,
          completed,
          createdAt: new Date(),
        })) ?? []
      )
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
          <FormControl id="name">
            <FormLabel>Goal name</FormLabel>
            <Input
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="Play the piano"
              autoFocus
              size="md"
            />
          </FormControl>
          <FormControl as="fieldset" mt="6">
            <FormLabel as="legend">Goal type</FormLabel>
            <RadioGroup value={type} onChange={type => setType(type)}>
              <Stack>
                <Radio value="personal" colorScheme="blue">
                  <Badge colorScheme="blue">Personal</Badge>
                </Radio>
                <Radio value="work" colorScheme="green">
                  <Badge colorScheme="green">Work</Badge>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl as="fieldset" mt="6">
            <FormLabel as="legend">Subgoals</FormLabel>

            <Stack>
              {subgoals.map(s => (
                <Editable value={s.name}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              ))}

              <Editable
                value={newSubgoalName}
                onChange={nextValue => {
                  setNewSubgoalName(nextValue)
                }}
                onSubmit={() => {
                  setSubgoals(s => [
                    ...s,
                    {
                      name: newSubgoalName,
                      completed: false,
                      createdAt: new Date(),
                    },
                  ])
                  setNewSubgoalName(DEFAULT_SUBGOAL_TEXT)
                }}
              >
                <EditablePreview color="gray.500" />
                <EditableInput />
              </Editable>
            </Stack>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing="6">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                goal
                  ? updateGoal({
                      variables: { name, type, id: goal.id, subgoals },
                    })
                  : createGoal({ variables: { name, type, subgoals } })
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
