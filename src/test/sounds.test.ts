import { describe, it, expect, vi } from "vitest";
import { sounds } from "@/lib/sounds";

describe("sounds", () => {
  it("loginSuccess runs without throwing", () => {
    expect(() => sounds.loginSuccess()).not.toThrow();
  });

  it("tap runs without throwing", () => {
    expect(() => sounds.tap()).not.toThrow();
  });

  it("cardSwap runs without throwing", () => {
    expect(() => sounds.cardSwap()).not.toThrow();
  });

  it("logout runs without throwing", () => {
    expect(() => sounds.logout()).not.toThrow();
  });

  it("error runs without throwing", () => {
    expect(() => sounds.error()).not.toThrow();
  });

  it("does nothing on server (no window)", () => {
    const originalWindow = global.window;
    // @ts-expect-error simulate SSR
    delete global.window;
    expect(() => sounds.tap()).not.toThrow();
    global.window = originalWindow;
  });

  it("all sound functions are exported", () => {
    expect(typeof sounds.loginSuccess).toBe("function");
    expect(typeof sounds.tap).toBe("function");
    expect(typeof sounds.cardSwap).toBe("function");
    expect(typeof sounds.logout).toBe("function");
    expect(typeof sounds.error).toBe("function");
  });
});
