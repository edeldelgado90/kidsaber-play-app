import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PetSprite } from './PetSprite';
import { Colors, Spacing, Radii, Typography, Elevation } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface PetUnlockModalProps {
  visible: boolean;
  onChoose: () => void;
  onLater: () => void;
}

/**
 * In-app announcement of the pet feature (update-unlock flow).
 * Offers going straight to pet selection or postponing.
 */
export function PetUnlockModal({ visible, onChoose, onLater }: PetUnlockModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onLater}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <PetSprite speciesId="capybara" size={140} />
          <Text style={styles.title}>{'¡Ya puedes conocer a tu mascota!'}</Text>
          <Text style={styles.text}>
            {'Elige un amigo, cuídalo y cómprale cosas con las estrellas que ganes jugando.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onChoose}
            accessibilityLabel="Ir a elegir mascota"
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>{'Ir a elegir mascota'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onLater}
            accessibilityLabel="Más tarde"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryText}>{'Más tarde'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    gap: Spacing.md,
    maxWidth: 380,
    padding: Spacing.xl,
    width: '100%',
    ...Elevation.modal,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.lg,
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: Spacing.md,
    width: '100%',
  },
  primaryText: {
    color: Colors.textOnPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.button.size,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    width: '100%',
  },
  secondaryText: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.body.size - 2,
  },
  text: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.body.size - 2,
    lineHeight: 20,
    textAlign: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('800'),
    fontSize: Typography.scale.h2.size,
    textAlign: 'center',
  },
});
