import { Box, Grid } from "@chakra-ui/react"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box bgColor="gray.100" maxW="100vw" minH="100vh" display="flex">
      <Grid
        gridTemplateRows="auto 1fr"
        gap="4"
        w="100%"
        m="28"
        p="20"
        bgColor="white"
        borderRadius="lg"
      >
        {children}
      </Grid>
    </Box>
  )
}

export default Layout
