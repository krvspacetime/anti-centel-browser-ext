import { MantineProvider } from "@mantine/core";
import { OptionsMenu } from "./OptionsMenu";

export function Options() {
  return (
    <MantineProvider>
      <OptionsMenu />
    </MantineProvider>
  );
}
