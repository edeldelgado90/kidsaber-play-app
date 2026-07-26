import { useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSoundStore, rehydrateSoundStore } from '@/infrastructure/store/soundStore';

import TRACK_A from '../../../assets/brand/saturday-in-the-trees.mp3';
import TRACK_B from '../../../assets/brand/little-star-falling.mp3';

const TARGET_VOLUME = 0.55;
const CROSSFADE_DURATION_S = 4;
const CROSSFADE_TRIGGER_S = 5;
const POLL_MS = 500;
const FADE_STEP_MS = 50;

/**
 * Alternates between two background music tracks with a smooth crossfade so
 * the transition between songs is imperceptible. Mount once in the (main) layout.
 */
export function useBackgroundMusic() {
  const isMuted = useSoundStore(s => s.isMuted);
  const playerA = useAudioPlayer(TRACK_A);
  const playerB = useAudioPlayer(TRACK_B);

  const activeRef = useRef<'A' | 'B'>('A');
  const fadingRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function getActive() {
    return activeRef.current === 'A' ? playerA : playerB;
  }

  function getIncoming() {
    return activeRef.current === 'A' ? playerB : playerA;
  }

  function startCrossfade() {
    if (fadingRef.current) return;
    fadingRef.current = true;

    const outgoing = getActive();
    const incoming = getIncoming();
    const isMutedNow = useSoundStore.getState().isMuted;

    incoming.volume = 0;
    if (!isMutedNow) {
      incoming.play();
    }

    const totalSteps = (CROSSFADE_DURATION_S * 1000) / FADE_STEP_MS;
    let step = 0;

    fadeRef.current = setInterval(() => {
      step++;
      const ratio = step / totalSteps;

      if (!useSoundStore.getState().isMuted) {
        outgoing.volume = TARGET_VOLUME * (1 - ratio);
        incoming.volume = TARGET_VOLUME * ratio;
      }

      if (step >= totalSteps) {
        if (fadeRef.current !== null) clearInterval(fadeRef.current);
        fadeRef.current = null;

        outgoing.pause();
        void outgoing.seekTo(0);
        outgoing.volume = 0;

        incoming.volume = TARGET_VOLUME;
        activeRef.current = activeRef.current === 'A' ? 'B' : 'A';
        fadingRef.current = false;
      }
    }, FADE_STEP_MS);
  }

  useEffect(() => {
    rehydrateSoundStore();

    playerA.loop = false;
    playerB.loop = false;
    playerA.volume = TARGET_VOLUME;
    playerB.volume = 0;

    if (!useSoundStore.getState().isMuted) {
      playerA.play();
    }

    pollRef.current = setInterval(() => {
      if (fadingRef.current) return;

      const isMutedNow = useSoundStore.getState().isMuted;
      const active = getActive();
      const { duration, currentTime } = active;

      if (!isMutedNow && !active.playing) {
        // Track ended without crossfade catching it — restart from beginning
        void active.seekTo(0);
        active.volume = TARGET_VOLUME;
        active.play();
        return;
      }

      if (duration > 0 && currentTime > 0 && duration - currentTime <= CROSSFADE_TRIGGER_S) {
        startCrossfade();
      }
    }, POLL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (fadeRef.current) clearInterval(fadeRef.current);
      playerA.pause();
      playerB.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isMuted) {
      playerA.pause();
      playerB.pause();
    } else {
      // Only resume the currently active player; crossfade manages the incoming one
      if (!fadingRef.current) {
        getActive().play();
      }
    }
  }, [isMuted]); // eslint-disable-line react-hooks/exhaustive-deps
}
