import { Box, Button, Flex } from "@chakra-ui/react"
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

const App = () => {
  return (
    <Box bgColor="gray.100" minW="100vw" minH="100vh" display="flex">
      <Box w="100%" m="20" p="20" bgColor="white" borderRadius="md">
        <Flex alignItems="center">
          <Box fontSize="2xl" fontWeight="semibold" mr="5">
            My goals
          </Box>
          <Button colorScheme="green" size="xs">
            Add new
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default App
