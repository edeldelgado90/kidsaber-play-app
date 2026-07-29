import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import { type PetSpeciesId, type EquipSlot } from '@/domain/entities/Pet';
import { Pet3D } from '../pet3d/Pet3D';
import { FloatingHearts } from './FloatingHearts';
import { FoodDrawing, FOOD_VIEWBOX } from './foods';

export type PetActionType = 'feed' | 'love' | 'happy';

export interface PetAction {
  type: PetActionType;
  /** Increment to re-trigger the animation. */
  key: number;
  /** Food item flying to the mouth (feed only). */
  foodId?: string;
}

interface AnimatedPetProps {
  speciesId: PetSpeciesId;
  equipped?: Partial<Record<EquipSlot, string | null>>;
  size: number;
  action: PetAction | null;
}

/**
 * The living pet: idle breathing/bobbing loop plus one-shot reactions
 * (feed = food flies to the mouth + chewing squash; love = wiggle + hearts;
 * happy = bounce). The whole paper doll (body + clothes) animates as one.
 */
export function AnimatedPet({ speciesId, equipped, size, action }: AnimatedPetProps) {
  const bob = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotate = useSharedValue(0);

  const foodProgress = useSharedValue(0);
  const [heartBurst, setHeartBurst] = useState(0);
  const [visibleFoodId, setVisibleFoodId] = useState<string | null>(null);

  // Idle motion (sway + bob) runs inside the 3D scene; here we only apply
  // one-shot reactions to the whole viewport.
  useEffect(() => {
    if (!action || action.key === 0) return;

    if (action.type === 'feed') {
      setVisibleFoodId(action.foodId ?? null);
      foodProgress.value = 0;
      foodProgress.value = withTiming(1, { duration: 650, easing: Easing.in(Easing.quad) });
      // Chew after the food reaches the mouth
      scaleY.value = withDelay(
        650,
        withSequence(
          withTiming(0.86, { duration: 140 }),
          withTiming(1, { duration: 140 }),
          withTiming(0.86, { duration: 140 }),
          withTiming(1, { duration: 140 }),
          withTiming(1.1, { duration: 160, easing: Easing.out(Easing.back(2)) }),
          withTiming(1, { duration: 160 }),
        ),
      );
      const timer = setTimeout(() => setVisibleFoodId(null), 750);
      return () => clearTimeout(timer);
    }

    if (action.type === 'love') {
      setHeartBurst(k => k + 1);
      rotate.value = withSequence(
        withTiming(-0.06, { duration: 120 }),
        withTiming(0.06, { duration: 160 }),
        withTiming(-0.05, { duration: 160 }),
        withTiming(0.04, { duration: 160 }),
        withTiming(0, { duration: 140 }),
      );
      return;
    }

    // happy
    scaleX.value = withSequence(
      withTiming(1.08, { duration: 140 }),
      withTiming(0.96, { duration: 140 }),
      withTiming(1, { duration: 160 }),
    );
    scaleY.value = withSequence(
      withTiming(0.9, { duration: 140 }),
      withTiming(1.12, { duration: 160, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 160 }),
    );
    return undefined;
  }, [action, foodProgress, rotate, scaleX, scaleY]);

  const petStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bob.value },
      { rotate: `${rotate.value}rad` },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
    ],
  }));

  // Food flies from the top-left toward the mouth (≈ center of the face)
  const foodStyle = useAnimatedStyle(() => {
    const p = foodProgress.value;
    return {
      opacity: visibleFoodId && p < 0.98 ? 1 : 0,
      transform: [
        { translateX: (-0.45 + 0.28 * p) * size },
        { translateY: (-0.25 + 0.4 * p) * size },
        { scale: 1 - 0.55 * p },
      ],
    };
  });

  const foodSize = size * 0.3;

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={petStyle}>
        <Pet3D speciesId={speciesId} equipped={equipped ?? {}} size={size} />
      </Animated.View>

      {visibleFoodId ? (
        <Animated.View style={[styles.food, foodStyle]} pointerEvents="none">
          <Svg width={foodSize} height={foodSize} viewBox={FOOD_VIEWBOX}>
            <FoodDrawing itemId={visibleFoodId} />
          </Svg>
        </Animated.View>
      ) : null}

      <FloatingHearts burstKey={heartBurst} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  food: {
    left: '50%',
    position: 'absolute',
    top: '50%',
  },
});
