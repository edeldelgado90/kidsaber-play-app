/**
 * Manual dependency injection container.
 * Creates and wires all repository and service implementations.
 * Import from here throughout the app — never instantiate dependencies directly.
 */

import { LocalProfileRepository } from '../../data/repositories/LocalProfileRepository';
import { LocalProgressRepository } from '../../data/repositories/LocalProgressRepository';
import { DeviceTokenService } from '../../data/services/DeviceTokenService';
import { QuestionsApiService } from '../../data/services/QuestionsApiService';
import { Config } from '../config/env';

// Repositories (singletons — shared across the app)
export const profileRepository = new LocalProfileRepository();
export const progressRepository = new LocalProgressRepository();

// Auth (singleton — owns the in-memory token cache and deviceId lifecycle)
export const tokenProvider = new DeviceTokenService(Config.API_URL);

// Services (singletons)
export const questionsService = new QuestionsApiService(Config.API_URL, tokenProvider);
