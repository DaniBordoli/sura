type OscType = OscillatorType;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

function tone(
  ac: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  type: OscType = "sine",
  gain = 0.18
) {
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  vol.gain.setValueAtTime(gain, startAt);
  vol.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(vol);
  vol.connect(ac.destination);
  osc.start(startAt);
  osc.stop(startAt + duration);
}

export const sounds = {
  /** Login exitoso: arpeggio ascendente */
  loginSuccess() {
    const ac = ctx();
    if (!ac) return;
    const now = ac.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, f, now + i * 0.1, 0.25, "sine", 0.15));
  },

  /** Tap de navegación: click sutil */
  tap() {
    const ac = ctx();
    if (!ac) return;
    const now = ac.currentTime;
    tone(ac, 880, now, 0.08, "sine", 0.1);
    tone(ac, 1100, now + 0.04, 0.06, "sine", 0.08);
  },

  /** Swap de tarjeta: whoosh */
  cardSwap() {
    const ac = ctx();
    if (!ac) return;
    const now = ac.currentTime;
    const buf = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const vol = ac.createGain();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.2);
    vol.gain.setValueAtTime(0.12, now);
    vol.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    src.buffer = buf;
    src.connect(filter);
    filter.connect(vol);
    vol.connect(ac.destination);
    src.start(now);
  },

  /** Logout: tono descendente */
  logout() {
    const ac = ctx();
    if (!ac) return;
    const now = ac.currentTime;
    [440, 349.23, 261.63].forEach((f, i) => tone(ac, f, now + i * 0.1, 0.2, "sine", 0.12));
  },

  /** Error: buzz */
  error() {
    const ac = ctx();
    if (!ac) return;
    const now = ac.currentTime;
    tone(ac, 180, now, 0.15, "sawtooth", 0.1);
    tone(ac, 160, now + 0.1, 0.15, "sawtooth", 0.08);
  },
};
