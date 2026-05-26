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
import { ALL_GRADES, GRADE_SHORT_LABELS, validateProfileName, type Grade, type Profile } from '@/domain/entities/Profile';
import { AppHeader } from '@/presentation/components/common/AppHeader';
import { ProfileRow } from '@/presentation/components/profile/ProfileRow';
import { Colors, Spacing, Radii, Typography } from '@/presentation/theme/tokens';
import { nunitoFamily } from '@/presentation/theme/fonts';

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
      Alert.alert(
        'No se puede eliminar',
        'Debe existir al menos un perfil.',
        [{ text: 'Entendido' }],
      );
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

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader
        title={
          mode === 'add'
            ? 'Nuevo perfil'
            : mode === 'edit'
            ? 'Editar perfil'
            : 'Perfiles'
        }
        onBack={handleBack}
        backgroundColor={Colors.brandPrimary}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
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
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{'Curso'}</Text>
              <View style={styles.gradeGrid}>
                {ALL_GRADES.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.gradeChip,
                      grade === g && styles.gradeChipSelected,
                    ]}
                    onPress={() => setGrade(g)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: grade === g }}
                    accessibilityLabel={`${GRADE_SHORT_LABELS[g]} de Primaria`}
                  >
                    <Text
                      style={[
                        styles.gradeChipText,
                        grade === g && styles.gradeChipTextSelected,
                      ]}
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
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    flexGrow: 1,
  },
  listContainer: {
    gap: Spacing.md,
  },
  form: {
    gap: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    fontSize: Typography.scale.bodyStrong.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
  },
  input: {
    fontSize: Typography.scale.body.size,
    fontFamily: nunitoFamily('400'),
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceMuted,
    minHeight: 52,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.scale.caption.size,
    fontFamily: nunitoFamily('400'),
    color: Colors.error,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gradeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceMuted,
    minWidth: 64,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  gradeChipSelected: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.surfaceHighlight,
  },
  gradeChipText: {
    fontSize: Typography.scale.bodyStrong.size,
    fontFamily: nunitoFamily('700'),
    color: Colors.textPrimary,
  },
  gradeChipTextSelected: {
    color: Colors.brandPrimary,
  },
  saveButton: {
    borderRadius: Radii.md,
    marginTop: Spacing.sm,
  },
  saveButtonLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
  },
  saveButtonContent: {
    paddingVertical: 6,
  },
  addButton: {
    borderRadius: Radii.md,
    borderColor: Colors.brandPrimary,
    marginTop: Spacing.sm,
  },
  addButtonLabel: {
    fontFamily: nunitoFamily('700'),
    fontSize: Typography.scale.button.size,
    color: Colors.brandPrimary,
  },
  addButtonContent: {
    paddingVertical: 6,
  },
});
