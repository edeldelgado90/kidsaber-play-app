import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

/**
 * Full-page error state with a retry button.
 * Used when the API is unreachable or returns an error.
 */
export function ErrorRetry({
  message = 'No hay conexión. Comprueba tu red e inténtalo de nuevo.',
  onRetry,
}: ErrorRetryProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="wifi-off" size={64} color={Colors.textDisabled} />
      <Text style={styles.message}>{message}</Text>
      <Button
        mode="contained"
        onPress={onRetry}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        accessibilityLabel="Reintentar cargar las preguntas"
      >
        {'Reintentar'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: Spacing.sm,
  },
  buttonLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.lg,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  message: {
    color: Colors.textSecondary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.body.size,
    lineHeight: Typography.scale.body.lineHeight,
    textAlign: 'center',
  },
});
