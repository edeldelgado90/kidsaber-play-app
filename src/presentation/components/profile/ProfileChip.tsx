import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Profile, GRADE_SHORT_LABELS } from '@/domain/entities/Profile';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface ProfileChipProps {
  profile: Profile;
  onPress?: () => void;
  inverted?: boolean; // white text on dark bg (for blue header)
}

/**
 * Compact profile indicator showing name + grade, tappable to switch profiles.
 * Used in the AppHeader.
 */
export function ProfileChip({ profile, onPress, inverted = true }: ProfileChipProps) {
  const textColor = inverted ? Colors.textOnPrimary : Colors.textPrimary;
  const bgColor = inverted ? 'rgba(255,255,255,0.2)' : Colors.surfaceMuted;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, { backgroundColor: bgColor }]}
      accessibilityLabel={`Perfil activo: ${profile.name}, ${GRADE_SHORT_LABELS[profile.grade]}`}
      accessibilityRole="button"
    >
      <MaterialCommunityIcons
        name="account-circle"
        size={20}
        color={textColor}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
          {profile.name}
        </Text>
        <Text style={[styles.grade, { color: textColor, opacity: 0.8 }]}>
          {GRADE_SHORT_LABELS[profile.grade]}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-down" size={14} color={textColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
    maxWidth: 140,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontFamily: nunitoFamily('700'),
    lineHeight: 16,
  },
  grade: {
    fontSize: 11,
    fontFamily: nunitoFamily('400'),
    lineHeight: 14,
  },
});
