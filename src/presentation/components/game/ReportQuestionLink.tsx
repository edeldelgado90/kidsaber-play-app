import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ReportState } from '@/presentation/hooks/useReportQuestion';
import { Colors, Spacing, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

interface ReportQuestionLinkProps {
  state: ReportState;
  onPress: () => void;
}

const LABELS: Record<ReportState, string> = {
  idle: '¿Hay algo mal en esta pregunta?',
  sending: 'Enviando…',
  sent: '¡Gracias! Lo revisaremos',
  failed: 'No se pudo enviar. Toca para reintentar',
};

const ICONS: Record<ReportState, keyof typeof MaterialCommunityIcons.glyphMap> = {
  idle: 'flag-outline',
  sending: 'flag-outline',
  sent: 'check-circle-outline',
  failed: 'refresh',
};

/**
 * Quiet link letting a player flag the question on screen as wrong.
 *
 * Sits below "Comprobar" and stays deliberately understated: it must be findable
 * by a child who spots a mistake without competing with the answer they came to
 * give. Once sent it turns into a thank-you and stops responding, so tapping
 * again cannot leave them wondering whether it registered.
 */
export function ReportQuestionLink({ state, onPress }: ReportQuestionLinkProps) {
  const isDisabled = state === 'sending' || state === 'sent';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.container, pressed && !isDisabled ? styles.pressed : null]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={
        state === 'sent' ? 'Pregunta reportada. Gracias' : 'Reportar un error en esta pregunta'
      }
    >
      <View style={styles.row}>
        <MaterialCommunityIcons
          name={ICONS[state]}
          size={16}
          color={state === 'sent' ? Colors.success : Colors.textDisabled}
        />
        <Text style={[styles.text, state === 'sent' ? styles.textSent : null]}>{LABELS[state]}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  text: {
    color: Colors.textDisabled,
    fontFamily: nunitoFamily('600'),
    fontSize: Typography.scale.caption.size,
    lineHeight: Typography.scale.caption.lineHeight,
  },
  textSent: {
    color: Colors.success,
  },
});
