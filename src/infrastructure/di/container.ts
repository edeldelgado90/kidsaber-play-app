/**
 * Manual dependency injection container.
 * Creates and wires all repository and service implementations.
 * Import from here throughout the app — never instantiate dependencies directly.
 */

import { LocalProfileRepository } from '../../data/repositories/LocalProfileRepository';
import { LocalProgressRepository } from '../../data/repositories/LocalProgressRepository';
import { LocalPetRepository } from '../../data/repositories/LocalPetRepository';
import { LocalEconomyRepository } from '../../data/repositories/LocalEconomyRepository';
import { FirebaseTokenService } from '../../data/services/FirebaseTokenService';
import { FirebaseAppCheckService } from '../../data/services/FirebaseAppCheckService';
import { QuestionsApiService } from '../../data/services/QuestionsApiService';
import { firebaseAuth } from '../firebase/firebaseApp';
import { firebaseAppCheck } from '../firebase/firebaseAppCheck';
import { Config } from '../config/env';

// Repositories (singletons — shared across the app)
export const profileRepository = new LocalProfileRepository();
export const progressRepository = new LocalProgressRepository();
export const petRepository = new LocalPetRepository();
export const economyRepository = new LocalEconomyRepository();

// Auth (singleton — signs in anonymously via Firebase and provides ID tokens).
// When Firebase credentials are absent (e.g. local dev), tokenProvider is undefined
// and QuestionsApiService makes unauthenticated requests.
export const tokenProvider = firebaseAuth ? new FirebaseTokenService(firebaseAuth) : undefined;

// App Check (singleton — web only; undefined on native and when the reCAPTCHA
// site key is absent). Attests that requests come from a genuine app instance.
export const appCheckProvider = firebaseAppCheck
  ? new FirebaseAppCheckService(firebaseAppCheck)
  : undefined;

// Services (singletons)
export const questionsService = new QuestionsApiService(
  Config.API_URL,
  tokenProvider,
  appCheckProvider,
);
