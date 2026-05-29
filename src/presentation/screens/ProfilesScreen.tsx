import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import {
  ALL_GRADES,
  GRADE_SHORT_LABELS,
  validateProfileName,
  type Grade,
  type Profile,
} from '@/domain/entities/Profile';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { ProfileRow } from '@/presentation/components/profile/ProfileRow';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';
import { useHorizontalPadding } from '@/infrastructure/platform/useBreakpoint';

type Mode = 'list' | 'add' | 'edit';

/**
 * Profile Management screen.
 *
 * Design spec:
 * - List of profiles with edit/delete buttons (pencil icon left)
 * - "Add profile" button
 * - Edit form: name + grade chips (inline, same validation as onboarding)
 * - Cannot delete the last profile
 */
export function ProfilesScreen() {
  const {
    profiles,
    activeProfileId,
    isLoading,
    addProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
  } = useProfileStore();

  const [mode, setMode] = useState<Mode>('list');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleBack = () => {
    if (mode !== 'list') {
      setMode('list');
      setEditingProfile(null);
    } else {
      router.back();
    }
  };

  const openAdd = () => {
    setName('');
    setGrade(null);
    setNameError(null);
    setEditingProfile(null);
    setMode('add');
  };

  const openEdit = (profile: Profile) => {
    setName(profile.name);
    setGrade(profile.grade);
    setNameError(null);
    setEditingProfile(profile);
    setMode('edit');
  };

  const handleSave = async () => {
    const error = validateProfileName(name);
    if (error) {
      setNameError(error);
      return;
    }
    if (!grade) {
      setNameError('Selecciona un curso.');
      return;
    }

    if (mode === 'add') {
      await addProfile(name.trim(), grade);
    } else if (mode === 'edit' && editingProfile) {
      await updateProfile(editingProfile.id, name.trim(), grade);
    }
    setMode('list');
    setEditingProfile(null);
  };

  const handleDelete = (profile: Profile) => {
    if (profiles.length <= 1) {
      Alert.alert('No se puede eliminar', 'Debe existir al menos un perfil.', [
        { text: 'Entendido' },
      ]);
      return;
    }

    Alert.alert(
      'Eliminar perfil',
      `¿Eliminar el perfil de ${profile.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteProfile(profile.id),
        },
      ],
    );
  };

  const handleSelect = async (profile: Profile) => {
    await setActiveProfile(profile.id);
    router.back();
  };

  const isFormMode = mode === 'add' || mode === 'edit';
  const canSubmit = name.trim().length >= 2 && grade !== null;
  const hPad = useHorizontalPadding();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader
        title={mode === 'add' ? 'Nuevo perfil' : mode === 'edit' ? 'Editar perfil' : 'Perfiles'}
        onBack={handleBack}
        backgroundColor={Colors.brandPrimary}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {isFormMode ? (
          /* Form: add or edit */
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{'Nombre'}</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (nameError) setNameError(null);
                }}
                placeholder="Nombre del niño"
                maxLength={20}
                autoCapitalize="words"
                returnKeyType="done"
                accessibilityLabel="Nombre"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{'Curso'}</Text>
              <View style={styles.gradeGrid}>
                {ALL_GRADES.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.gradeChip, grade === g && styles.gradeChipSelected]}
                    onPress={() => setGrade(g)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: grade === g }}
                    accessibilityLabel={`${GRADE_SHORT_LABELS[g]} de Primaria`}
                  >
                    <Text
                      style={[styles.gradeChipText, grade === g && styles.gradeChipTextSelected]}
                    >
                      {GRADE_SHORT_LABELS[g]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!canSubmit || isLoading}
              loading={isLoading}
              style={styles.saveButton}
              labelStyle={styles.saveButtonLabel}
              contentStyle={styles.saveButtonContent}
            >
              {'Guardar'}
            </Button>
          </View>
        ) : (
          /* Profile list */
          <View style={styles.listContainer}>
            {profiles.map(profile => (
              <ProfileRow
                key={profile.id}
                profile={profile}
                isActive={profile.id === activeProfileId}
                onEdit={openEdit}
                onDelete={handleDelete}
                onSelect={handleSelect}
                canDelete={profiles.length > 1}
              />
            ))}

            <Button
              mode="outlined"
              onPress={openAdd}
              icon="plus"
              style={styles.addButton}
              labelStyle={styles.addButtonLabel}
              contentStyle={styles.addButtonContent}
              accessibilityLabel="Añadir nuevo perfil"
            >
              {'Añadir perfil'}
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    borderColor: Colors.brandPrimary,
    borderRadius: Radii.md,
    marginTop: Spacing.sm,
  },
  addButtonContent: {
    paddingVertical: 6,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    flexGrow: 1,
  },
  errorText: {
    color: Colors.error,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.caption.size,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    gap: Spacing.xl,
    padding: Spacing.xl,
  },
  gradeChip: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.full,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 64,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  gradeChipSelected: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.brandPrimary,
  },
  gradeChipText: {
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.bodyStrong.size,
  },
  gradeChipTextSelected: {
    color: Colors.brandPrimary,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.md,
    borderWidth: 2,
    color: Colors.textPrimary,
    fontFamily: nunitoFamily('400'),
    fontSize: Typography.scale.body.size,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: Colors.error,
  },
  listContainer: {
    gap: Spacing.md,
  },
  root: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  saveButton: {
    borderRadius: Radii.md,
    marginTop: Spacing.sm,
  },
  saveButtonContent: {
    paddingVertical: 6,
  },
  saveButtonLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
});
