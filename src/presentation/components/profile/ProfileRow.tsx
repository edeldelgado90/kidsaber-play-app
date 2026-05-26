import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Profile, GRADE_LABELS } from '@/domain/entities/Profile';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface ProfileRowProps {
  profile: Profile;
  isActive?: boolean;
  onEdit?: (profile: Profile) => void;
  onDelete?: (profile: Profile) => void;
  onSelect?: (profile: Profile) => void;
  canDelete?: boolean;
}

/**
 * A row in the profile management list.
 * Shows name, grade, edit/delete actions.
 */
export function ProfileRow({
  profile,
  isActive = false,
  onEdit,
  onDelete,
  onSelect,
  canDelete = true,
}: ProfileRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, isActive && styles.rowActive]}
      onPress={() => onSelect?.(profile)}
      accessibilityLabel={`${profile.name}, ${GRADE_LABELS[profile.grade]}${isActive ? ', perfil activo' : ''}`}
      accessibilityRole="button"
    >
      <MaterialCommunityIcons
        name={isActive ? 'account-check' : 'account'}
        size={36}
        color={isActive ? Colors.brandPrimary : Colors.textSecondary}
      />

      <View style={styles.info}>
        <Text style={[styles.name, isActive && styles.nameActive]}>
          {profile.name}
        </Text>
        <Text style={styles.grade}>{GRADE_LABELS[profile.grade]}</Text>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(profile)}
            style={styles.actionButton}
            accessibilityLabel={`Editar perfil de ${profile.name}`}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={Colors.brandPrimary} />
          </TouchableOpacity>
        )}
        {onDelete && canDelete && (
          <TouchableOpacity
            onPress={() => onDelete(profile)}
            style={styles.actionButton}
            accessibilityLabel={`Eliminar perfil de ${profile.name}`}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="delete-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  rowActive: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.surfaceHighlight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.scale.bodyStrong.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
    lineHeight: Typography.scale.bodyStrong.lineHeight,
  },
  nameActive: {
    color: Colors.brandPrimary,
  },
  grade: {
    fontSize: Typography.scale.caption.size,
    fontFamily: nunitoFamily('400'),
    color: Colors.textSecondary,
    lineHeight: Typography.scale.caption.lineHeight,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
