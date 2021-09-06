import { useState } from "react"
import { Flex, IconButton, useEditableControls } from "@chakra-ui/react"
import {
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Stack,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react"
import { CheckIcon, SmallCloseIcon, CloseIcon } from "@chakra-ui/icons"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"
import { Goal, SubGoal } from "@prisma/client"

const SubgoalQuery = gql`
  query SubgoalQuery($goalId: Int!) {
    subgoals(goalId: $goalId) {
      id
      name
      completed
    }
  }
`

const SubgoalUpdateMutation = gql`
  mutation SubgoalUpdateMutation(
    $name: String!
    $completed: Boolean!
    $id: Int!
  ) {
    updateSubgoal(name: $name, completed: $completed, id: $id) {
      name
      completed
      id
    }
  }
`

const SubgoalCreateMutation = gql`
  mutation SubgoalCreateMutation($name: String!, $goalId: Int!) {
    createSubgoal(name: $name, goalId: $goalId) {
      name
      goalId
    }
  }
`

const SubgoalDeleteMutation = gql`
  mutation SubgoalDeleteMutation($id: Int!) {
    deleteSubgoal(id: $id) {
      id
    }
  }
`

const SubgoalItem: React.FC<{
  subgoal: SubGoal
}> = ({ subgoal }) => {
  const [completed, setCompleted] = useState(subgoal.completed)
  const [name, setName] = useState(subgoal.name)
  const [updateSubgoal] = useMutation(SubgoalUpdateMutation, {
    refetchQueries: ["SubgoalQuery", "GoalQuery"],
  })
  const [deleteSubgoal] = useMutation(SubgoalDeleteMutation, {
    refetchQueries: ["SubgoalQuery", "GoalQuery"],
  })

  return (
    <Flex>
      <Editable
        value={name}
        w="100%"
        mr="5"
        onChange={nextName => {
          setName(nextName)
        }}
        onSubmit={() => {
          updateSubgoal({
            variables: {
              id: subgoal.id,
              completed,
              name,
            },
          })
        }}
      >
        <EditablePreview
          w="100%"
          textDecoration={subgoal.completed ? "line-through" : "none"}
          color={subgoal.completed ? "gray.600" : "black"}
          fontStyle={subgoal.completed ? "italic" : "normal"}
        />
        <EditableInput w="100%" />
      </Editable>
      <Flex alignItems="center">
        <IconButton
          aria-label="CompleteButton"
          borderRadius={100}
          colorScheme={completed ? "green" : "gray"}
          onClick={() => {
            updateSubgoal({
              variables: {
                id: subgoal.id,
                completed: !completed,
                name,
              },
            })
            setCompleted(prev => !prev)
          }}
          size="sm"
          icon={<CheckIcon />}
        />
        <IconButton
          aria-label="DeleteButton"
          variant="ghost"
          colorScheme="red"
          onClick={() => {
            deleteSubgoal({
              variables: {
                id: subgoal.id,
              },
            })
          }}
          ml="2"
          size="sm"
          icon={<SmallCloseIcon />}
        />
      </Flex>
    </Flex>
  )
}

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton size="sm" icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton size="sm" icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <></>
  )
}

const AddNewSubgoal: React.FC<{ goalId: number }> = ({ goalId }) => {
  const [newSubgoalName, setNewSubgoalName] = useState("")
  const [createSubgoal] = useMutation(SubgoalCreateMutation, {
    refetchQueries: ["SubgoalQuery", "GoalQuery"],
  })

  return (
    <Editable
      value={newSubgoalName}
      w="100%"
      placeholder="Add new subgoal"
      onChange={nextValue => {
        setNewSubgoalName(nextValue)
      }}
      onSubmit={() => {
        if (!newSubgoalName) {
          return
        }
        createSubgoal({
          variables: {
            name: newSubgoalName,
            goalId,
          },
        })
        setNewSubgoalName("")
      }}
    >
      <EditablePreview w="100%" color="gray.500" />
      <Flex alignItems="center">
        <EditableInput mr="2" />
        <EditableControls />
      </Flex>
    </Editable>
  )
}

const SubgoalsModal: React.FC<{
  onClose: () => void
  isOpen: boolean
  goal: Goal
}> = ({ onClose, isOpen, goal }) => {
  const { data, loading, error } = useQuery<{ subgoals: SubGoal[] }>(
    SubgoalQuery,
    {
      variables: {
        goalId: goal.id,
      },
    }
  )

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{goal.name} subgoals</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="4" pb="4">
            {data?.subgoals?.map(subgoal => (
              <SubgoalItem key={subgoal.id} subgoal={subgoal} />
            ))}
            <AddNewSubgoal goalId={goal.id} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SubgoalsModal
