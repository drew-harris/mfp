import { describe, expect, it } from "vitest";
import { getRatioFromInputString } from "../components/nodes/SplitterNode";

describe("Finds the correct mission based on a task", () => {
  it("returns empty array with empty input", () => {
    const ratios = getRatioFromInputString("");
    expect(ratios).toStrictEqual([]);
  });

  it("returns [1] with any single letter", () => {
    const ratios = getRatioFromInputString("a");
    expect(ratios).toStrictEqual([1]);
  });

  it("returns half with two letters", () => {
    const ratios = getRatioFromInputString("AB");
    expect(ratios).toStrictEqual([0.5, 0.5]);
  });

  it("handles ratios", () => {
    const ratios = getRatioFromInputString("ABAA");
    expect(ratios).toStrictEqual([0.75, 0.25]);
  });

  it("handles ratios with spaces", () => {
    const ratios = getRatioFromInputString("A B A    A");
    expect(ratios).toStrictEqual([0.75, 0.25]);
  });
});
