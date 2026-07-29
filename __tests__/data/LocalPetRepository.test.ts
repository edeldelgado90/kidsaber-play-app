import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalPetRepository } from '../../src/data/repositories/LocalPetRepository';
import { StorageKeys } from '../../src/data/storage/StorageKeys';
import { createPetState, type Pets } from '../../src/domain/entities/Pet';

const mockAS = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function seedPets(pets: Pets) {
  mockAS.getItem.mockImplementation(key => {
    if (key === StorageKeys.PETS) return Promise.resolve(JSON.stringify(pets));
    return Promise.resolve(null);
  });
  mockAS.setItem.mockResolvedValue(undefined);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAS.getItem.mockResolvedValue(null);
  mockAS.setItem.mockResolvedValue(undefined);
});

describe('LocalPetRepository', () => {
  it('returns null when the profile has no pet', async () => {
    const repo = new LocalPetRepository();
    expect(await repo.getPet('p1')).toBeNull();
  });

  it('saves and returns a pet per profile', async () => {
    const repo = new LocalPetRepository();
    const pet = createPetState('capybara');
    await repo.savePet('p1', pet);

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Pets;
    expect(saved.byProfileId['p1']).toEqual(pet);
  });

  it('reads back stored pets', async () => {
    const pet = createPetState('dragon');
    seedPets({ byProfileId: { p1: pet } });
    const repo = new LocalPetRepository();
    expect(await repo.getPet('p1')).toEqual(pet);
  });

  it('fills missing equip slots from older schema versions', async () => {
    const pet = createPetState('shiba');
    const legacy = {
      ...pet,
      equipped: { hat: 'hat_wool' }, // stored before coat/shoes/glasses existed
    };
    seedPets({ byProfileId: { p1: legacy as never } });
    const repo = new LocalPetRepository();

    const loaded = await repo.getPet('p1');
    expect(loaded?.equipped).toEqual({ hat: 'hat_wool', coat: null, shoes: null, glasses: null });
  });

  it('resetPet removes only that profile', async () => {
    seedPets({
      byProfileId: { p1: createPetState('capybara'), p2: createPetState('shiba') },
    });
    const repo = new LocalPetRepository();
    await repo.resetPet('p1');

    const saved = JSON.parse((mockAS.setItem as jest.Mock).mock.calls[0][1] as string) as Pets;
    expect(saved.byProfileId['p1']).toBeUndefined();
    expect(saved.byProfileId['p2']).toBeDefined();
  });

  it('treats corrupted data as missing', async () => {
    mockAS.getItem.mockResolvedValue('{not json');
    const repo = new LocalPetRepository();
    expect(await repo.getPets()).toEqual({ byProfileId: {} });
  });
});
