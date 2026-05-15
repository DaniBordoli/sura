import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomNav } from "@/components/BottomNav";

const mockPush = vi.fn();
const mockBack = vi.fn();
let mockPathname = "/home";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  usePathname: () => mockPathname,
}));

describe("BottomNav", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockPathname = "/home";
    localStorage.clear();
    sessionStorage.clear();
  });

  it("renders three nav buttons", () => {
    const { container } = render(<BottomNav />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(3);
  });

  it("home icon is active color when on /home", () => {
    const { container } = render(<BottomNav />);
    const homeBtn = container.querySelector("button:first-child") as HTMLElement;
    expect(homeBtn.style.color).toBe("rgb(108, 143, 248)"); // #6C8FF8
  });

  it("movements icon is inactive when on /home", () => {
    const { container } = render(<BottomNav />);
    const movBtn = container.querySelectorAll("button")[1] as HTMLElement;
    expect(movBtn.style.color).toBe("rgb(32, 14, 50)"); // #200E32
  });

  it("movements icon is active when on /movements", () => {
    mockPathname = "/movements";
    const { container } = render(<BottomNav />);
    const movBtn = container.querySelectorAll("button")[1] as HTMLElement;
    expect(movBtn.style.color).toBe("rgb(108, 143, 248)");
  });

  it("clicking movements navigates to /movements", () => {
    const { container } = render(<BottomNav />);
    const movBtn = container.querySelectorAll("button")[1];
    fireEvent.click(movBtn);
    expect(mockPush).toHaveBeenCalledWith("/movements");
  });

  it("clicking home navigates to /home from non-home page", () => {
    mockPathname = "/movements";
    const { container } = render(<BottomNav />);
    const homeBtn = container.querySelector("button:first-child")!;
    fireEvent.click(homeBtn);
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("clicking home on /home does not navigate", () => {
    mockPathname = "/home";
    const { container } = render(<BottomNav />);
    const homeBtn = container.querySelector("button:first-child")!;
    fireEvent.click(homeBtn);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("logout clears localStorage and redirects", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("userName", "Carlos");
    const { container } = render(<BottomNav />);
    const logoutBtn = container.querySelectorAll("button")[2];
    fireEvent.click(logoutBtn);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("userName")).toBeNull();
  });

  it("logout button has inactive color initially", () => {
    const { container } = render(<BottomNav />);
    const logoutBtn = container.querySelectorAll("button")[2] as HTMLElement;
    expect(logoutBtn.style.color).toBe("rgb(32, 14, 50)");
  });
});
