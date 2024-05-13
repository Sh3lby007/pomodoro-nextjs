"use client";
// pages/index.tsx
import { useState, useEffect } from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

const WORK_MINUTES = 0.2;
const BREAK_MINUTES = 0.2;

type TimerMode = "work" | "break";

export default function PomodoroTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [time, setTime] = useState(WORK_MINUTES * 60);
  const [workCycles, setWorkCycles] = useState(0);
  const [breakCycles, setBreakCycles] = useState(0);
  const [isCountdownPlaying, setIsCountdownPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(interval);
            const nextMode = mode === "work" ? "break" : "work";
            setMode(nextMode);
            const nextTime =
              nextMode === "work" ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
            setTime(nextTime);
            setIsRunning(true);
            setIsCountdownPlaying(false);
            return nextTime;
          } else if (prevTime <= 5 && !isCountdownPlaying) {
            setIsCountdownPlaying(true);
            let countdownTime = prevTime;
            if (countdownTime > 0) {
              const audio = new Audio("/countdown.wav");
              audio.play();
              countdownTime--;
            } else {
              setIsCountdownPlaying(false);
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, mode, isCountdownPlaying]);

  useEffect(() => {
    if (mode === "work") {
      setBreakCycles((prevCycles) => prevCycles + 1);
    } else {
      setWorkCycles((prevCycles) => prevCycles + 1);
    }
  }, [mode]);

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  const handleStart = () => {
    setIsRunning((prevState) => !prevState);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode("work");
    setTime(WORK_MINUTES * 60);
    setWorkCycles(0);
    setBreakCycles(0);
  };

  return (
    <Box textAlign="center" py={10}>
      <Heading as="h1" size="2xl" mb={6}>
        Pomodoro Timer
      </Heading>
      <VStack spacing={4}>
        <Text fontSize="6xl" fontWeight="bold">
          {minutes}:{seconds}
        </Text>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={mode === "work" ? "green.500" : "blue.500"}
        >
          {mode === "work" ? "Work" : "Break"} Mode
        </Text>
        <Text fontSize="lg">Work Cycles: {workCycles}</Text>
        <Text fontSize="lg">Break Cycles: {breakCycles}</Text>
        <Button
          onClick={handleStart}
          colorScheme={isRunning ? "red" : "green"}
          size="lg"
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset} colorScheme="gray" size="lg">
          Reset
        </Button>
      </VStack>
    </Box>
  );
}
