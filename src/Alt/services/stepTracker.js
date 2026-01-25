import { Pedometer } from 'expo-sensors';

export const isStepCountingAvailable = async () => {
  try {
    return await Pedometer.isAvailableAsync();
  } catch (error) {
    console.warn('Pedometer not available:', error);
    return false;
  }
};

export const subscribeToSteps = (setStepCount) => {
  return Pedometer.watchStepCount(result => {
    setStepCount(prev => prev + result.steps); // accumulate
  });
};
