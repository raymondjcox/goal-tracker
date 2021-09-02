import { useEffect, useState } from "react"
import { Flex, IconButton, useEditableControls } from "@chakra-ui/react"
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
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons"
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

const SubgoalItem: React.FC<{
  subgoal: SubGoal
}> = ({ subgoal }) => {
  return (
    <Flex>
      <Editable value={subgoal.name} w="100%" mr="5">
        <EditablePreview w="100%" />
        <EditableInput w="100%" />
      </Editable>
      <IconButton
        borderRadius={100}
        colorScheme={subgoal.completed ? "green" : "gray"}
        ml="auto"
        size="sm"
        icon={<CheckIcon />}
      />
    </Flex>
  )
}

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton size="xs" icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton size="xs" icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <></>
  )
}

const AddNewSubgoal = () => {
  const [newSubgoalName, setNewSubgoalName] = useState("")

  return (
    <Editable
      value={newSubgoalName}
      w="100%"
      placeholder="Add new subgoal"
      onChange={nextValue => {
        setNewSubgoalName(nextValue)
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
              <SubgoalItem subgoal={subgoal} />
            ))}
            <AddNewSubgoal />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SubgoalsModal
