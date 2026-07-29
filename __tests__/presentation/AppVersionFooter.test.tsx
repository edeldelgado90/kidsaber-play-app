import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));
jest.mock('expo-application', () => ({
  nativeApplicationVersion: '1.2.0',
  nativeBuildVersion: '42',
}));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { version: '1.2.0' } },
}));

import { AppVersionFooter } from '@/presentation/components/common/AppVersionFooter';

describe('AppVersionFooter', () => {
  it('shows the app name with its version and build number', () => {
    const { getByText } = render(<AppVersionFooter />);

    expect(getByText('KidSaber Play v1.2.0 (42)')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<AppVersionFooter onPress={onPress} />);

    fireEvent.press(getByLabelText('Acerca de KidSaber Play'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is not announced as a button without onPress', () => {
    const { queryByLabelText, getByText } = render(<AppVersionFooter />);

    expect(queryByLabelText('Acerca de KidSaber Play')).toBeNull();
    expect(getByText('KidSaber Play v1.2.0 (42)')).toBeTruthy();
  });
});
