import {
  validateProfileName,
  validateGrade,
  GRADE_LABELS,
  GRADE_SHORT_LABELS,
  ALL_GRADES,
} from '../../src/domain/entities/Profile';

describe('validateProfileName', () => {
  it('returns null for a valid 2-char name', () => {
    expect(validateProfileName('Ab')).toBeNull();
  });

  it('returns null for a valid 20-char name', () => {
    expect(validateProfileName('A'.repeat(20))).toBeNull();
  });

  it('returns error when trimmed name is empty', () => {
    expect(validateProfileName('')).not.toBeNull();
  });

  it('returns error when trimmed name is 1 char', () => {
    expect(validateProfileName('A')).toMatch(/al menos 2/);
  });

  it('returns error when name has 21 chars', () => {
    expect(validateProfileName('A'.repeat(21))).toMatch(/más de 20/);
  });

  it('trims whitespace before validation', () => {
    expect(validateProfileName('  A  ')).toMatch(/al menos 2/);
  });

  it('accepts name with exactly 20 chars after trim', () => {
    expect(validateProfileName('  ' + 'A'.repeat(20) + '  ')).toBeNull();
  });
});

describe('validateGrade', () => {
  it('returns null for grade 1', () => {
    expect(validateGrade(1)).toBeNull();
  });

  it('returns null for grade 6', () => {
    expect(validateGrade(6)).toBeNull();
  });

  it('returns null for all valid grades 1-6', () => {
    for (let g = 1; g <= 6; g++) {
      expect(validateGrade(g)).toBeNull();
    }
  });

  it('returns error for grade 0', () => {
    expect(validateGrade(0)).not.toBeNull();
  });

  it('returns error for grade 7', () => {
    expect(validateGrade(7)).not.toBeNull();
  });

  it('returns error for non-integer', () => {
    expect(validateGrade(1.5)).not.toBeNull();
  });

  it('returns error for negative grade', () => {
    expect(validateGrade(-1)).not.toBeNull();
  });
});

describe('GRADE_LABELS', () => {
  it('has entries for all 6 grades', () => {
    expect(Object.keys(GRADE_LABELS)).toHaveLength(6);
  });

  it('label for grade 1 contains "1"', () => {
    expect(GRADE_LABELS[1]).toContain('1');
  });

  it('label for grade 6 contains "6"', () => {
    expect(GRADE_LABELS[6]).toContain('6');
  });
});

describe('GRADE_SHORT_LABELS', () => {
  it('has entries for all 6 grades', () => {
    expect(Object.keys(GRADE_SHORT_LABELS)).toHaveLength(6);
  });

  it('short label for grade 3 is shorter than full label', () => {
    expect(GRADE_SHORT_LABELS[3].length).toBeLessThan(GRADE_LABELS[3].length);
  });
});

describe('ALL_GRADES', () => {
  it('contains exactly grades 1 through 6', () => {
    expect(ALL_GRADES).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
