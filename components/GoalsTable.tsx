import { useEffect, useState } from "react"
import CreateOrUpdateGoalModal from "../components/CreateOrUpdateGoalModal"
import {
  Box,
  Button,
  Center,
  Flex,
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
} from "@chakra-ui/react"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"
import { Goal } from "@prisma/client"

const GoalDeleteMutation = gql`
  mutation GoalDeleteMutation($id: Int!) {
    deleteGoal(id: $id) {
      id
    }
  }
`

const GoalQuery = gql`
  query GoalQuery {
    goals {
      id
      name
      type
    }
  }
`

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
    refetchQueries: ["GoalQuery"],
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

export default GoalsTable
