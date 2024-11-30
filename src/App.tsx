import { MantineProvider } from "@mantine/core";
import { AppLayout } from "./content/components/layout/AppLayout";

function App() {
  return (
    <>
      <MantineProvider forceColorScheme="dark">
        <AppLayout />
      </MantineProvider>
    </>
  );
}

export default App;
