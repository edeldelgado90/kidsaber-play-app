import React from 'react';
import { G, Ellipse, Circle, Path, Rect } from 'react-native-svg';

/**
 * Food item drawings, each in a 100×100 viewBox (shop cards, feed animation).
 */

function Apple() {
  return (
    <G>
      <Path
        d="M 50 30 Q 52 18 62 14"
        stroke="#6d4520"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M 62 20 Q 78 12 82 26 Q 68 30 62 20 Z" fill="#4a9e2f" />
      <Circle cx={38} cy={58} r={26} fill="#e5484d" />
      <Circle cx={62} cy={58} r={26} fill="#d93036" />
      <Ellipse cx={42} cy={48} rx={7} ry={10} fill="#ffffff" opacity={0.35} />
    </G>
  );
}

function Carrot() {
  return (
    <G>
      <Path d="M 60 18 Q 66 4 74 12 Q 70 22 60 24 Z" fill="#4a9e2f" />
      <Path d="M 74 22 Q 88 16 88 28 Q 78 32 72 28 Z" fill="#5cb83c" />
      <Path d="M 66 30 Q 84 44 62 82 Q 50 92 42 84 Q 12 60 34 42 Q 50 26 66 30 Z" fill="#f97316" />
      <Path
        d="M 48 46 L 60 42 M 40 58 L 54 54 M 38 70 L 50 68"
        stroke="#d95f0e"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </G>
  );
}

function Cookie() {
  return (
    <G>
      <Circle cx={50} cy={54} r={32} fill="#d9a35c" />
      <Path d="M 50 22 A 32 32 0 0 1 82 54 L 66 54 A 16 16 0 0 0 50 38 Z" fill="#c98d43" />
      <Circle cx={38} cy={46} r={5} fill="#5a3b22" />
      <Circle cx={58} cy={64} r={5} fill="#5a3b22" />
      <Circle cx={62} cy={42} r={4} fill="#5a3b22" />
      <Circle cx={40} cy={66} r={4} fill="#5a3b22" />
    </G>
  );
}

function Watermelon() {
  return (
    <G>
      <Path d="M 14 52 A 38 38 0 0 0 90 52 Z" fill="#2f9e44" />
      <Path d="M 20 52 A 32 32 0 0 0 84 52 Z" fill="#e8f5d0" />
      <Path d="M 26 52 A 26 26 0 0 0 78 52 Z" fill="#f4586a" />
      <Circle cx={42} cy={62} r={2.6} fill="#2b2b2b" />
      <Circle cx={56} cy={68} r={2.6} fill="#2b2b2b" />
      <Circle cx={66} cy={58} r={2.6} fill="#2b2b2b" />
    </G>
  );
}

const FOODS: Record<string, React.ComponentType> = {
  food_apple: Apple,
  food_carrot: Carrot,
  food_cookie: Cookie,
  food_watermelon: Watermelon,
};

export const FOOD_VIEWBOX = '0 0 100 100';

export function FoodDrawing({ itemId }: { itemId: string }) {
  const Food = FOODS[itemId];
  return Food ? <Food /> : <Rect x={30} y={30} width={40} height={40} rx={8} fill="#cccccc" />;
}

export function hasFoodSprite(itemId: string): boolean {
  return itemId in FOODS;
}
