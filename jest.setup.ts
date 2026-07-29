import '@testing-library/react-native/extend-expect';

// Reanimated ships an official mock that runs animations synchronously in Jest.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
