import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DraggableItem from "../components/DraggableItem";
import { resourceItems } from "../hardcoded/resourceItems";
import { MCPickerItem } from "../types/MCNodes";

describe("Draggable Info", () => {
  it("Should render properly", () => {
    const item: MCPickerItem = resourceItems[0];
    render(<DraggableItem item={item} />);
    expect(screen.getByText(item.title)).toBeTruthy();
  });
});
