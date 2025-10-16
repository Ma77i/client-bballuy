import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';

const loadingMessages = [
  'Getting ready for tip-off!',
  'Loading courts and players...',
  'Warming up the squad...',
  'Checking the scoreboard...',
  'Finding nearby courts...',
  'Assembling your team...',
  'Lacing up the sneakers...',
  'Preparing the court...',
];

const subMessages = [
  'Loading courts and players...',
  'Finding your next game...',
  'Connecting with ballers...',
  'Setting up the court...',
  'Getting the squad ready...',
  'Preparing your profile...',
  'Loading team rosters...',
  'Syncing match data...',
];

export default function LoadingScreen() {
  const circleRotation = useRef(new Animated.Value(0)).current;
  const ballRotation = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);
  const [subMessageIndex, setSubMessageIndex] = useState(0);

  useEffect(() => {
    const circleAnim = Animated.loop(
      Animated.timing(circleRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    circleAnim.start();

    return () => circleAnim.stop();
  }, [circleRotation]);

  useEffect(() => {
    let currentValue = 0;
    const ballInterval = setInterval(() => {
      currentValue += 1;
      Animated.timing(ballRotation, {
        toValue: currentValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2500);

    return () => clearInterval(ballInterval);
  }, [ballRotation]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const subMessageInterval = setInterval(() => {
      setSubMessageIndex((prev) => (prev + 1) % subMessages.length);
    }, 2000);

    return () => clearInterval(subMessageInterval);
  }, []);

  const circleRotate = circleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ballRotate = ballRotation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.circleContainer,
            { transform: [{ rotate: circleRotate }] },
          ]}
        >
          <View style={styles.circle} />
          <View style={styles.circleGap} />
        </Animated.View>

        <Animated.View
          style={[
            styles.ballContainer,
            { transform: [{ rotate: ballRotate }] },
          ]}
        >
          <BasketballIcon />
        </Animated.View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{loadingMessages[messageIndex]}</Text>
        <Text style={styles.subText}>{subMessages[subMessageIndex]}</Text>
      </View>
    </View>
  );
}

function BasketballIcon() {
  return (
    <View style={styles.basketball}>
      <View style={styles.basketballLine} />
      <View style={[styles.basketballLine, styles.basketballLineVertical]} />
      <View style={[styles.basketballLine, styles.basketballLineCurve1]} />
      <View style={[styles.basketballLine, styles.basketballLineCurve2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loaderContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 60,
  },
  circleContainer: {
    position: 'absolute' as const,
    width: 160,
    height: 160,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: Colors.primary,
    borderTopColor: 'transparent' as const,
    borderRightColor: 'transparent' as const,
  },
  circleGap: {
    position: 'absolute' as const,
    width: 160,
    height: 160,
  },
  ballContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  basketball: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
  },
  basketballLine: {
    position: 'absolute' as const,
    backgroundColor: Colors.background,
    opacity: 0.8,
  },
  basketballLineVertical: {
    width: 2,
    height: 60,
    left: 29,
  },
  basketballLineCurve1: {
    width: 60,
    height: 2,
    top: 19,
    borderRadius: 30,
  },
  basketballLineCurve2: {
    width: 60,
    height: 2,
    top: 39,
    borderRadius: 30,
  },
  textContainer: {
    alignItems: 'center' as const,
    paddingHorizontal: 40,
  },
  mainText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
  },
});
