import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TargetList } from "../list/TargetList";

function Options() {
  return (
    <div className="p-4 bg-zinc-800 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Extension Options</h1>

      {/* Color customization section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Category Colors</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label>Fake News Color:</label>
            <input
              type="color"
              defaultValue="#FF4444"
              onChange={(e) => {
                chrome.storage.sync.set({ fakeNewsColor: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <label>Parody Color:</label>
            <input
              type="color"
              defaultValue="#FFA500"
              onChange={(e) => {
                chrome.storage.sync.set({ parodyColor: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <label>Satire Color:</label>
            <input
              type="color"
              defaultValue="#FFD700"
              onChange={(e) => {
                chrome.storage.sync.set({ satireColor: e.target.value });
              }}
            />
          </div>
        </div>
      </section>

      {/* Target List section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Manage Target List</h2>
        <TargetList />
      </section>
    </div>
  );
}

// Mount the component
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Options />
  </StrictMode>
);
