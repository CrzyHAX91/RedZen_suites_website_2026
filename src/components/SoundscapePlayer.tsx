import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Disc, Radio, Activity, Waves } from 'lucide-react';

interface SoundscapeTrack {
  id: string;
  name: string;
  sub: string;
  freq: string;
  baseFreq: number;
  modFreq: number;
  effectType: 'cedar' | 'rain' | 'drone' | 'crystal';
  description: string;
}

const TRACKS: SoundscapeTrack[] = [
  { 
    id: 'warm-cedar', 
    name: 'Warm Cedar Wood', 
    sub: '432 Hz Natural Frequency', 
    freq: '432 Hz', 
    baseFreq: 216, 
    modFreq: 432,
    effectType: 'cedar',
    description: 'Binaural tonen gecombineerd met harmonische boventonen voor hartcoherentie en diepe ontspanning.'
  },
  { 
    id: 'zen-stone', 
    name: 'Rain on Slate & Bath', 
    sub: '528 Hz Solfeggio Flow', 
    freq: '528 Hz', 
    baseFreq: 264, 
    modFreq: 528,
    effectType: 'rain',
    description: 'Solfeggio frequentie voor herstel en stressreductie met een zacht waterruiseffect.'
  },
  { 
    id: 'deep-amber', 
    name: 'Deep Amber Drone', 
    sub: '108 Hz Theta Wave Resonance', 
    freq: '108 Hz', 
    baseFreq: 108, 
    modFreq: 216,
    effectType: 'drone',
    description: 'Diepe grondtonen en trage resonantie die de hersengolven naar de ontspannen Theta-staat brengen.'
  },
  { 
    id: 'crystal-temple', 
    name: 'Tibetan Sing Bowl & Mist', 
    sub: '7.83 Hz Schumann Resonance', 
    freq: '7.83 Hz', 
    baseFreq: 144, 
    modFreq: 288,
    effectType: 'crystal',
    description: 'Subtiele aardresonantie en heldere boventonen voor zuivere mentale helderheid na de sauna.'
  },
  { 
    id: 'sensual-silk', 
    name: 'Sensual Silk & Warm Pulse', 
    sub: '528 Hz Heart Attunement & Low Sub', 
    freq: '528 Hz', 
    baseFreq: 132, 
    modFreq: 528,
    effectType: 'drone',
    description: 'Swoele, diepe basklanken en zachte pulsen die een intieme, zwoele sfeer creëren voor twee.'
  },
  { 
    id: 'midnight-velvet', 
    name: 'Midnight Velvet & Warm Rain', 
    sub: '174 Hz Deep Body Relaxation', 
    freq: '174 Hz', 
    baseFreq: 174, 
    modFreq: 348,
    effectType: 'rain',
    description: 'Verleidelijke warme regengeluiden vermengd met fluweelzachte grondtonen voor ongekende intimiteit.'
  },
];

export const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [audioBars, setAudioBars] = useState<number[]>([15, 30, 45, 60, 40, 25, 50, 35]);

  // Web Audio Synthesizer Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscNodesRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activeTrack = TRACKS[activeTrackIndex];

  // Visualizer Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      setAudioBars([12, 16, 20, 16, 12, 18, 14, 10]);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let t = 0;
    const animate = () => {
      t += 0.05;
      setAudioBars([
        Math.sin(t * 1.2) * 25 + 40,
        Math.cos(t * 0.9) * 30 + 50,
        Math.sin(t * 1.5) * 35 + 55,
        Math.cos(t * 2.0) * 40 + 60,
        Math.sin(t * 1.1) * 30 + 45,
        Math.cos(t * 1.7) * 25 + 50,
        Math.sin(t * 0.8) * 35 + 55,
        Math.cos(t * 1.4) * 20 + 35,
      ]);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const stopAudio = () => {
    try {
      oscNodesRef.current.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      oscNodesRef.current = [];
      if (noiseSourceRef.current) {
        try { noiseSourceRef.current.stop(); noiseSourceRef.current.disconnect(); } catch (e) {}
        noiseSourceRef.current = null;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startAudio = (track: SoundscapeTrack) => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.20, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Harmonic Oscillators
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(track.baseFreq, ctx.currentTime);
    gain1.gain.setValueAtTime(0.55, ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(track.baseFreq * 1.5, ctx.currentTime);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(track.modFreq, ctx.currentTime);
    gain3.gain.setValueAtTime(0.18, ctx.currentTime);

    // Warm Slow Breathing LFO (Low-frequency oscillator)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // 1 breathing wave every ~12 seconds
    lfoGain.gain.setValueAtTime(0.12, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(gain1.gain);

    // Subtle Filter for Acoustic Softness
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(track.effectType === 'rain' ? 650 : 420, ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);
    filter.connect(masterGain);

    // Optional Pink/Water Noise generator for Rain / Slate
    if (track.effectType === 'rain') {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.8, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.20, ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;
    }

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    oscNodesRef.current = [osc1, osc2, osc3, lfo];
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(activeTrack);
      setIsPlaying(true);
    }
  };

  const selectTrack = (index: number) => {
    setActiveTrackIndex(index);
    if (isPlaying) {
      startAudio(TRACKS[index]);
    }
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume * 0.20, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating mini bar */}
      <div className="flex items-center gap-3 bg-[#15191A]/95 backdrop-blur-md border border-[#A9875A]/40 rounded-full px-4 py-2.5 shadow-2xl shadow-black/90 hover:border-[#A9875A] transition-all">
        
        {/* Toggle Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying 
              ? 'bg-[#A9875A] text-[#0B0D0E] shadow-lg shadow-[#A9875A]/40 animate-pulse' 
              : 'bg-[#0B0D0E] text-[#A9875A] border border-white/10 hover:border-[#A9875A]'
          }`}
          title={isPlaying ? 'Pauzeer soundscape' : 'Luister RedZen Soundscape'}
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Live Audio Visualizer Equalizer */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-end gap-0.5 h-4 w-12 cursor-pointer py-0.5"
          title="Audio Frequentie Monitor"
        >
          {audioBars.map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                isPlaying ? 'bg-[#A9875A]' : 'bg-white/20'
              }`}
              style={{ height: `${Math.max(15, h * 0.16)}px` }}
            />
          ))}
        </div>

        {/* Track Label */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer select-none pr-1"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif text-[#F7F5F1] font-medium leading-none">
              {activeTrack.name}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0B0D0E] text-[#A9875A] border border-[#A9875A]/30">
              {activeTrack.freq}
            </span>
          </div>
          <span className="text-[10px] text-[#A9AAA7] font-light block mt-0.5">
            {isPlaying ? 'Live soundscape actief' : 'Tik voor sound studio'}
          </span>
        </div>

        {/* Expand pill toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full text-[#A9AAA7] hover:text-[#F7F5F1] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A9875A]" />
        </button>
      </div>

      {/* Expanded Sound Menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-84 sm:w-96 bg-[#15191A]/95 border border-[#A9875A]/40 rounded-3xl p-5 shadow-2xl space-y-4 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#A9875A]">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Akoestische Studio</span>
              </div>
              <h4 className="text-base font-serif text-[#F7F5F1]">RedZen Sound Studio</h4>
            </div>
            <span className="text-[11px] font-mono text-[#A9875A] px-2 py-0.5 rounded bg-[#0B0D0E] border border-[#A9875A]/30">
              Binaural Audio
            </span>
          </div>

          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            In elke RedZen Suite stem je de akoestiek af met afgestemde frequenties voor diepe parasympathische ontspanning en stressreductie.
          </p>

          {/* Tracks list */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {TRACKS.map((track, idx) => {
              const isSelected = activeTrackIndex === idx;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => selectTrack(idx)}
                  className={`w-full p-3.5 rounded-2xl text-left flex items-start justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0B0D0E] border-[#A9875A] text-[#F7F5F1] shadow-lg ring-1 ring-[#A9875A]'
                      : 'bg-[#0B0D0E]/50 border-white/5 hover:border-white/15 text-[#A9AAA7]'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="text-xs font-serif font-medium text-[#F7F5F1] flex items-center gap-2">
                      <Disc className={`w-3.5 h-3.5 shrink-0 ${isSelected && isPlaying ? 'text-[#A9875A] animate-spin' : 'text-neutral-500'}`} />
                      <span>{track.name}</span>
                    </div>
                    <span className="text-[10px] text-[#A9875A] font-mono block pl-5">{track.sub}</span>
                    <p className="text-[11px] text-[#A9AAA7] font-light pl-5 leading-tight">
                      {track.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#A9875A] font-bold shrink-0 pt-0.5">
                    {track.freq}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Volume slider */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex justify-between text-[11px] text-[#A9AAA7] font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#A9875A]" /> Volume & Intensiteit
              </span>
              <span className="text-[#F7F5F1] font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#0B0D0E] rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
            />
          </div>

          {/* Quick Play Trigger in drawer */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:brightness-110"
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlaying ? 'Pauzeer Soundscape' : 'Start Deze Soundscape'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
