import { useHover } from "@mantine/hooks";
import { Button } from "@mantine/core";

export function OptionsMenu() {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      {hovered ? "I am hovered" : "Put mouse over me please"}
      <Button variant="outline" color="red">
        Test Mantine Button
      </Button>
    </div>
  );
}
