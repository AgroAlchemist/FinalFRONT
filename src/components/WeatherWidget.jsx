import React, { useEffect, useState } from "react";
import { Box, Text, Spinner, Icon, useColorModeValue } from "@chakra-ui/react";
// import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Location permission denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      // TODO: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
      const apiKey = "621d35eed203a2be897070d777774c05";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const bg = useColorModeValue("gray.100", "gray.700");
  const border = useColorModeValue("gray.300", "gray.600");

  return (
    <Box
      position="absolute"
      top="16px"
      left="16px"
      zIndex={2000}
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="lg"
      boxShadow="md"
      p={3}
      minW="110px"
      minH="70px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {loading ? (
        <Spinner size="sm" />
      ) : error ? (
        <Text fontSize="xs" color="red.500">
          {error}
        </Text>
      ) : weather ? (
        <>
          <Text fontWeight="bold" fontSize="lg">
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text fontSize="sm" color="gray.600">
            {weather.weather[0].main}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {weather.name}
          </Text>
        </>
      ) : null}
    </Box>
  );
};

export default WeatherWidget;
