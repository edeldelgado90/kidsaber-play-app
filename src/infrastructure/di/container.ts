/**
 * Manual dependency injection container.
 * Creates and wires all repository and service implementations.
 * Import from here throughout the app — never instantiate dependencies directly.
 */

import { LocalProfileRepository } from '../../data/repositories/LocalProfileRepository';
import { LocalProgressRepository } from '../../data/repositories/LocalProgressRepository';
import { FirebaseTokenService } from '../../data/services/FirebaseTokenService';
import { QuestionsApiService } from '../../data/services/QuestionsApiService';
import { firebaseAuth } from '../firebase/firebaseApp';
import { Config } from '../config/env';

// Repositories (singletons — shared across the app)
export const profileRepository = new LocalProfileRepository();
export const progressRepository = new LocalProgressRepository();

// Auth (singleton — signs in anonymously via Firebase and provides ID tokens).
// When Firebase credentials are absent (e.g. local dev), tokenProvider is undefined
// and QuestionsApiService makes unauthenticated requests.
export const tokenProvider = firebaseAuth ? new FirebaseTokenService(firebaseAuth) : undefined;

// Services (singletons)
export const questionsService = new QuestionsApiService(Config.API_URL, tokenProvider);
