import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Heading,
  Select,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const RentalsList = () => {
  const [rentals, setRentals] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Fetch all available locations
  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/rental/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLocations(res.data);
      if (res.data.length > 0) {
        setSelectedLocation(res.data[0]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Failed to load locations.");
    }
  };

  const fetchRentals = async (location) => {
    if (!location) {
      setError("Invalid location selected.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:3000/rental/all`, {
        params: { location },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRentals(res.data[0]);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      if (error.response) {
        setError(error.response.data.message || "Failed to fetch rentals.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) fetchRentals(selectedLocation);
  }, [selectedLocation]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={6} color="blue.600">
            Available Rentals
          </Heading>

          <Box mb={6}>
            <Text fontWeight="bold" mb={2}>
              Select Location:
            </Text>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              size="lg"
              borderRadius="md"
              borderColor="blue.400"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            >
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
          </Box>
        </Box>

        {loading && (
          <VStack spacing={4} align="stretch">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="120px" borderRadius="md" />
            ))}
          </VStack>
        )}

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          {rentals.map((rental) => (
            <Box
              key={rental.id}
              p={6}
              bg={bgColor}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
                bg: hoverBg,
              }}
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={3}>
                  <Heading size="md" color="blue.600">
                    {rental.name}
                  </Heading>
                  <Text color="gray.600">{rental.description}</Text>
                  <HStack spacing={4}>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                      Rs. {rental.price_per_day}/day
                    </Badge>
                    <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                      {rental.location}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default RentalsList;
