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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  message: {
    fontSize: Typography.scale.body.size,
    fontFamily: nunitoFamily('400'),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.scale.body.lineHeight,
  },
  button: {
    marginTop: Spacing.sm,
  },
  buttonLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
  },
});
