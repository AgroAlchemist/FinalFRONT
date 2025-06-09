import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Input,
  VStack,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import MessageUser from "./MessageUser";
import MessageAi from "./MessageAi";
import axios from "axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOnline, setOnline] = useState(true);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Save messages to local storage on change
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Set initial online status
    setOnline(navigator.onLine);

    // Add event listeners for online and offline status
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle sending message on button click or pressing Enter
  const handleClick = async () => {
    if (inputValue.trim() !== "") {
      const newMessages = [...messages, { type: "user", text: inputValue }];
      setMessages(newMessages);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/messages",
          {
            message: inputValue,
          }
        );
        setMessages([...newMessages, { type: "ai", text: response.data }]);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setInputValue("");
    } else {
      alert("Please enter a prompt");
    }
  };

  // Handle keypress for Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  if (!isOnline) {
    return (
      <Alert status="error" variant="solid" borderRadius="md" m={4}>
        <AlertIcon />
        <AlertTitle>Your browser is offline!</AlertTitle>
        <AlertDescription>
          Please check your internet connection and we will be ready for your
          help whenever your network improves
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Container maxW="container.xl" h="85vh" py={4}>
      <VStack h="full" spacing={4}>
        <Heading size="md" color="blue.500" mb={2}>
          AI Assistant Chat
        </Heading>
        <Box
          flex="1"
          w="full"
          bg={bgColor}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          <Box
            flex="1"
            overflowY="auto"
            p={4}
            display="flex"
            flexDirection="column"
            gap={4}
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray.400",
                borderRadius: "24px",
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                maxWidth="70%"
                minWidth="30%"
                alignSelf={message.type === "user" ? "flex-start" : "flex-end"}
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-2px)" }}
              >
                {message.type === "user" ? (
                  <MessageUser text={message.text} />
                ) : (
                  <MessageAi text={message.text} />
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box
            p={4}
            borderTop="1px"
            borderColor={borderColor}
            bg="gray.50"
            display="flex"
            gap={2}
          >
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              size="lg"
              borderRadius="full"
              borderColor="blue.400"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
            <Button
              colorScheme="blue"
              size="lg"
              borderRadius="full"
              px={8}
              onClick={handleClick}
              _hover={{ transform: "scale(1.05)" }}
              transition="all 0.2s ease"
            >
              Send
            </Button>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default ChatPage;
