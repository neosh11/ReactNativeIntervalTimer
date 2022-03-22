import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC, useEffect, useState } from "react";

interface IExercise {
  name: string | null;
  seconds: number;
}

interface IProgram {
  rounds: number;
  restBetweenRounds: number;
  timeBeforeStart: number;
  roundData: IExercise[];
}
const Exercises: IExercise[] = [
  { name: "Bicep Curls", seconds: 20 },
  { name: null, seconds: 20 },
  { name: "Tricep Downs", seconds: 20 },
];
const ProgramData: IProgram = {
  timeBeforeStart: 10,
  restBetweenRounds: 40,
  roundData: Exercises,
  rounds: 3,
};

const Timer = ({ time }: { time: number }) => {
  return (
    <Text>
      {("0" + Math.floor((time / 60) % 60)).slice(-2)}:
      {("0" + Math.floor(time % 60)).slice(-2)}
    </Text>
  );
};

const ControlButtons = (props: any) => {
  const StartButton = <Button title="Start" onPress={props.handleStart} />;
  const ActiveButtons = (
    <>
      <Button
        title={props.isPaused ? "Resume" : "Pause"}
        onPress={props.handlePauseResume}
      />
    </>
  );

  return props.active ? ActiveButtons : StartButton;
};

const ProgramScreen = () => {
  const [progress, setProgress] = useState({
    round: 0,
    breakTime: false,
    exercise: 0,
    time: 0,
    finished: false,
  });
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  // const [time, setTime] = useState(0);

  const roundNumber = 1;

  useEffect(() => {
    let interval: any = null;

    if (progress.finished) {
      clearInterval(interval);
    }
    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setProgress((progress) => {
          return { ...progress, time: progress.time + 1 };
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    // If round 0: time before start play...

    if (progress.breakTime) {
      if (progress.time >= ProgramData.restBetweenRounds) {
        // Set time to 0
        // Increment round
        setProgress((progress) => {
          return { ...progress, breakTime: false, time: 0 };
        });
      }
    } else {
      if (progress.round === 0) {
        if (progress.time >= ProgramData.timeBeforeStart) {
          // Set time to 0
          // Increment round
          setProgress((progress) => {
            return { ...progress, time: 0, round: 1 };
          });
        }
      } else {
        const lim = ProgramData.roundData[progress.exercise].seconds;
        // round > 0
        if (progress.time >= lim) {
          // Check if last exercise.
          if (progress.exercise === ProgramData.roundData.length - 1) {
            // Increment round if more rounds else end!
            if (progress.round === ProgramData.rounds) {
              // TODO end here
              setProgress((progress) => ({
                ...progress,
                finished: true,
              }));
            } else
              setProgress((progress) => ({
                ...progress,
                time: 0,
                round: progress.round + 1,
                exercise: 0,
                breakTime: true,
              }));
          } else {
            // increment exercise
            setProgress((progress) => ({
              ...progress,
              time: 0,
              exercise: progress.exercise + 1,
            }));
          }
        }
      }
    }

    return () => {};
  }, [progress.time]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setProgress({ ...progress, time: 0 });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {(progress.finished && <Text>WORKOUT FINISHED</Text>) || (
        <>
          <Text>
            {" "}
            {(progress.round > 0 &&
              !progress.breakTime &&
              ProgramData.roundData[progress.exercise].name) ||
              "Rest"}
          </Text>

          <Timer time={progress.time} />

          <ControlButtons
            active={isActive}
            isPaused={isPaused}
            handleStart={handleStart}
            handlePauseResume={handlePauseResume}
          />
        </>
      )}
    </View>
  );
};

export default ProgramScreen;
