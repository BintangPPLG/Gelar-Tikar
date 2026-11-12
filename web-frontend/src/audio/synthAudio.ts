// Web Audio API Synthesizer for Interactive Concert Experience

let audioCtx: AudioContext | null = null;
let currentPreviewOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let isPlayingPreview = false;
let currentPlayingArtistId: string | null = null;
let previewInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playIntroSonicBoom() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sub bass drop
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.3);

    // High shimmer synth
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'triangle';
    shimmerOsc.frequency.setValueAtTime(440, now);
    shimmerOsc.frequency.exponentialRampToValueAtTime(880, now + 0.8);

    shimmerGain.gain.setValueAtTime(0.15, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(now);
    shimmerOsc.stop(now + 0.85);
  } catch (e) {
    console.warn('Web Audio playback error', e);
  }
}

export function playClickBeep() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // ignore
  }
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + index * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.55);
    });
  } catch {
    // ignore
  }
}

// Artist sound loop synthesizers with different scales
const artistFrequencies: Record<string, number[]> = {
  'artist-1': [130.81, 196.00, 261.63, 329.63, 392.00], // Cyber / Trance (C3, G3, C4, E4, G4)
  'artist-2': [146.83, 220.00, 293.66, 369.99, 440.00], // Synthwave (D3, A3, D4, F#4, A4)
  'artist-3': [110.00, 164.81, 220.00, 277.18, 329.63], // Deep Techno (A2, E3, A3, C#4, E4)
  'artist-4': [164.81, 246.94, 329.63, 392.00, 493.88], // Melodic Bass (E3, B3, E4, G4, B4)
  'artist-5': [130.81, 164.81, 196.00, 246.94, 293.66], // Ambient House (C3, E3, G3, B3, D4)
  'artist-6': [174.61, 261.63, 349.23, 440.00, 523.25], // Vocal EDM (F3, C4, F4, A4, C5)
};

export function toggleArtistAudioPreview(
  artistId: string, 
  onStateChange: (isPlaying: boolean, activeId: string | null) => void
) {
  try {
    if (isPlayingPreview && currentPlayingArtistId === artistId) {
      stopArtistAudioPreview();
      onStateChange(false, null);
      return;
    }

    stopArtistAudioPreview();
    const ctx = getAudioContext();
    const scale = artistFrequencies[artistId] || artistFrequencies['artist-1'];

    isPlayingPreview = true;
    currentPlayingArtistId = artistId;
    onStateChange(true, artistId);

    let step = 0;
    const playStep = () => {
      if (!isPlayingPreview) return;
      const now = ctx.currentTime;
      const noteFreq = scale[step % scale.length];

      // Bass note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = step % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      // Filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);

      currentPreviewOscillators.push({ osc, gain });

      // Sub kick on 1st & 3rd beat
      if (step % 2 === 0) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
        kickGain.gain.setValueAtTime(0.25, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.22);
      }

      step++;
    };

    playStep();
    previewInterval = window.setInterval(playStep, 220);
  } catch (e) {
    console.warn('Audio preview error', e);
  }
}

export function stopArtistAudioPreview() {
  isPlayingPreview = false;
  currentPlayingArtistId = null;
  if (previewInterval !== null) {
    clearInterval(previewInterval);
    previewInterval = null;
  }
  currentPreviewOscillators.forEach(({ osc }) => {
    try {
      osc.stop();
    } catch {
      // already stopped
    }
  });
  currentPreviewOscillators = [];
}
