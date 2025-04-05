# Sentry - Chromium/Firefox Extension

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/Vite-5.3-purple?logo=vite)](https://vitejs.dev/) [![Mantine UI](https://img.shields.io/badge/Mantine-7.16-blue)](https://mantine.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-teal?logo=tailwind-css)](https://tailwindcss.com/)

A browser extension built with React, TypeScript, and Vite to customize your experience on x.com (Twitter). Tag users, apply visual styles (highlight, blur, hide) to their tweets, and manage your watchlist.

https://github.com/user-attachments/assets/022daf39-ed07-4732-bcca-27f06b129287

## Features

*   **Watchlist Management:** Add/remove users (@handles) to a watchlist via the popup.
*   **User Tagging:** Assign categories (e.g., Fake News, Parody, Bot, Spam) to users on your watchlist.
*   **Action Assignment:** Choose an action (Highlight, Blur, Hide, Tag Only) to apply to tweets from watched users.
*   **Tweet Styling:** Automatically applies the selected action (highlight, blur, hide) to tweets from users on your watchlist as you browse x.com.
    *   **Highlight:** Outlines tweets with configurable color, thickness, border radius, and glow.
    *   **Blur:** Applies a backdrop blur effect to tweets, with a button to temporarily reveal content.
    *   **Hide:** Collapses tweets from view, showing a minimal indicator with options.
*   **Popup Interface:** Manage your watchlist, add new users, select tags/actions directly from the extension popup.
*   **Options Page:** Detailed configuration for styling options (Highlight, Blur, Hide), privacy settings, and backup/restore functionality.
*   **Theme Awareness:** Content script detects x.com's light/dark theme and adjusts styles accordingly.
*   **Badge Counter:** The extension icon shows a badge indicating the number of users currently on the watchlist.
*   **(Optional) Hide User Details:** Ability to hide certain user profile elements on the X.com interface (configurable via Options page).
*   **Settings Backup:** Export and import your style configuration and watchlist via the Options page.
*   **Cross-Browser Support:** Includes manifests for both Chrome (`manifest.json`) and Firefox (`manifest-firefox.json`).

## Tech Stack

*   **Framework:** React 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **UI Library:** Mantine UI
*   **Styling:** Tailwind CSS, PostCSS
*   **State Management:** React Hooks (useState, useEffect)
*   **Linting/Formatting:** ESLint, Prettier

## Installation

### From Source (Development)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install or pnpm install
    ```
3.  **Build the extension:**
    ```bash
    npm run build
    ```
    This will create a `build` directory with the necessary files.

4.  **Load the extension in your browser:**

    *   **Chrome/Edge:**
        *   Open `chrome://extensions` or `edge://extensions`.
        *   Enable "Developer mode" (usually a toggle in the top right).
        *   Click "Load unpacked".
        *   Select the `build` directory created in step 3.

    *   **Firefox:**
        *   Open `about:debugging#/runtime/this-firefox`.
        *   Click "Load Temporary Add-on...".
        *   Navigate into the `build` directory and select the `manifest.json` file (or any file within the `build` directory).
        *   *Note:* The default build uses `manifest.json` (Chrome-focused). For full Firefox compatibility testing, you might need to manually replace `build/manifest.json` with the contents of `public/manifest-firefox.json` *after* the build process, or adjust the build script.

## Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start Vite in watch mode. Changes to the code should trigger fast HMR updates.
    *   **Note:** For changes in the content script or background script, you might need to manually reload the extension in your browser (`chrome://extensions` > Reload icon) and refresh the target page (x.com).
3.  **Load the unpacked extension:** Follow step 4 in the Installation section, selecting the **root project directory** (the one containing `vite.config.ts`) if Vite properly configures outputs for development, or the `build` directory after running `npm run build` if `dev` doesn't produce a directly loadable structure. Check Vite's output or documentation for the specific setup. *Based on the `vite.config.ts`, `npm run build` is necessary first, then load the `build` directory.* For development HMR, you'll likely need a different setup or frequent rebuilds/reloads.

### Available Scripts

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Creates a production-ready build in the `build/` directory.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Serves the production build locally for previewing.

## File Structure (Simplified)

```plaintext
.
├── build/                  # Output directory after `npm run build`
├── public/                 # Static assets, manifest files
│   ├── manifest.json       # Chrome manifest
│   └── manifest-firefox.json # Firefox-specific manifest settings
├── src/                    # Source code
│   ├── background/           # Background script logic (badge updates)
│   │   └── background.ts
│   ├── content/              # Content script logic (interacts with x.com)
│   │   ├── actions/          # Functions to create styling effects (blur, hide, highlight)
│   │   ├── components/       # UI components injected into the page (modals, buttons)
│   │   ├── constants/
│   │   ├── features/         # Specific feature logic (e.g., hide user details)
│   │   ├── types/            # TypeScript types for content script
│   │   ├── utils/            # Utility functions for content script
│   │   └── content.ts
│   ├── options_ui/           # Options page UI and logic
│   │   ├── components/
│   │   └── options.html      # HTML entry for options page
│   ├── popup/                # Extension popup UI and logic
│   │   ├── components/
│   │   └── types/
│   ├── icons/                # SVG icon definitions
│   ├── App.tsx               # Main popup component
│   ├── main.tsx              # Entry point for popup React app
│   ├── index.css             # Main CSS/Tailwind entry point
│   ├── custom.d.ts
│   └── vite-env.d.ts
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc             # Prettier configuration
├── index.html              # HTML entry for popup
├── package.json            # Project dependencies and scripts
├── postcss.config.cjs      # PostCSS config (Mantine related)
├── postcss.config.js       # PostCSS config (Tailwind/Autoprefixer)
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.app.json       # TypeScript config for app code
├── tsconfig.json           # Base TypeScript config
├── tsconfig.node.json      # TypeScript config for Node env (Vite config)
├── vite.config.ts          # Vite build configuration
└── README.md               # This file
## Configuration

Detailed configuration options for styling (highlight colors, blur levels, hide behavior), privacy settings, and backup/restore are available on the extension's **Options page**.

You can usually access the Options page by:
1.  Going to your browser's extensions management page (e.g., `chrome://extensions`).
2.  Finding the "Anti Centel" extension.
3.  Clicking on "Details".
4.  Scrolling down and clicking "Extension options".

## Permissions Used

*   `storage`: To save the user's watchlist and settings.
*   `activeTab`: Required for some content script interactions (though `scripting` might be needed depending on specific actions, `content_scripts` in manifest handles injection here).
*   `host_permissions`:
    *   `*://x.com/*`: Allows the content script to run on Twitter/X pages.
    *   `http://localhost:8000/*`: Included in manifest, likely for development purposes or a specific feature connecting to a local server.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

Distributed under the [Your License Here] License. See `LICENSE` file for more information. ( **Note:** Add a LICENSE file to your repository).
