import { useState } from "react"
import CreateOrUpdateGoalModal from "../components/CreateOrUpdateGoalModal"
import { Box, Button, Flex } from "@chakra-ui/react"

const GoalsHeader: React.FC = () => {
  const [showAddNewModal, setShowAddNewModal] = useState(false)

  return (
    <Flex alignItems="center">
      <CreateOrUpdateGoalModal
        onClose={() => setShowAddNewModal(false)}
        isOpen={showAddNewModal}
      />
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
  )
}

export default GoalsHeader
