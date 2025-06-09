import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  useColorModeValue,
  Container,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 'farmer' or 'user'
  const isAuthenticated = !!token; // Simplified check
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("farmerId");
    localStorage.removeItem("userId");
    navigate("/"); // Use navigate instead of window.location.href
  };

  // console.log("Current role:", role);

  const NavLink = ({ to, children }) => (
    <Link to={to}>
      <Button
        variant="ghost"
        colorScheme="blue"
        size="md"
        _hover={{ bg: hoverBg }}
        fontWeight="medium"
      >
        {children}
      </Button>
    </Link>
  );

  const NavContent = () => (
    <>
      <Heading size="md" color="blue.600">
        Portal for farmers
      </Heading>
      <HStack spacing={2}>
        {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
        <NavLink to="/crops">Products</NavLink>
        <NavLink to="/farmers">Farmers</NavLink>
        <NavLink to="/ai-chat">AI Chat</NavLink>
      </HStack>
    </>
  );

  const FarmerLinks = () => (
    <>
      <NavLink to="/add-crop">Add Product</NavLink>
      <NavLink to="/rental-form">Rent</NavLink>
      <NavLink to="/rentals">View Properties for Rent</NavLink>
      <NavLink to="/crop-recommendation">Crop Recommendation</NavLink>
    </>
  );

  const AuthButtons = () => (
    <HStack spacing={4}>
      {isAuthenticated ? (
        <>
          {role === "farmer" && <FarmerLinks />}
          <Button
            colorScheme="red"
            variant="solid"
            onClick={handleLogout}
            size="md"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            as={Link}
            to="/login"
            colorScheme="blue"
            variant="solid"
            size="md"
          >
            Login
          </Button>
          <Button
            as={Link}
            to="/signup"
            colorScheme="green"
            variant="solid"
            size="md"
          >
            Signup
          </Button>
        </>
      )}
    </HStack>
  );

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between" px={4}>
          {/* Desktop Navigation */}
          <Flex
            alignItems="center"
            gap={8}
            display={{ base: "none", md: "flex" }}
          >
            <NavContent />
          </Flex>

          {/* Mobile Navigation Button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="ghost"
            aria-label="Open menu"
            icon={<HamburgerIcon />}
          />

          {/* Desktop Auth Buttons */}
          <Box display={{ base: "none", md: "flex" }}>
            <AuthButtons />
          </Box>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <NavContent />
              <AuthButtons />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
