import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: RN.View,
    Svg: RN.View,
    Circle: RN.View,
    Line: RN.View,
    Rect: RN.View,
    Defs: RN.View,
    RadialGradient: RN.View,
    Stop: RN.View,
  };
});
jest.mock('../../../../assets/brand/background_capi.png', () => 1, { virtual: true });

import { SunBackground } from '../../src/presentation/components/common/SunBackground';

describe('SunBackground', () => {
  it('renders children', () => {
    const { getByText } = render(
      <SunBackground>
        <Text>Content inside</Text>
      </SunBackground>,
    );
    expect(getByText('Content inside')).toBeTruthy();
  });

  it('renders without sun when showSun=false', () => {
    const { toJSON } = render(
      <SunBackground showSun={false}>
        <Text>No sun</Text>
      </SunBackground>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without floor when showFloor=false', () => {
    const { toJSON } = render(
      <SunBackground showFloor={false}>
        <Text>No floor</Text>
      </SunBackground>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom patternOpacity', () => {
    const { toJSON } = render(
      <SunBackground patternOpacity={0.1}>
        <Text>Low opacity</Text>
      </SunBackground>,
    );
    expect(toJSON()).toBeTruthy();
  });
});
