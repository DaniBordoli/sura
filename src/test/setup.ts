import "@testing-library/jest-dom";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/home",
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createElement } = require("react");
    return createElement("img", { ...props, src: props.src as string });
  },
}));

// Stub Web Audio API
class MockAudioContext {
  currentTime = 0;
  createOscillator() {
    return {
      type: "",
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
  createBuffer(_c: number, _l: number, _r: number) {
    return { getChannelData: () => new Float32Array(100) };
  }
  createBufferSource() {
    return { buffer: null, connect: vi.fn(), start: vi.fn() };
  }
  createBiquadFilter() {
    return {
      type: "",
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
  get destination() {
    return {};
  }
}

Object.defineProperty(window, "AudioContext", { writable: true, value: MockAudioContext });
Object.defineProperty(window, "webkitAudioContext", { writable: true, value: MockAudioContext });

// Stub localStorage / sessionStorage
const storage: Record<string, string> = {};
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (k: string) => storage[k] ?? null,
    setItem: (k: string, v: string) => { storage[k] = v; },
    removeItem: (k: string) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
  },
});
Object.defineProperty(window, "sessionStorage", {
  value: {
    getItem: (_k: string) => null,
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});
