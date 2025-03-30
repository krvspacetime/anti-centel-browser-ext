// Add dialog element
export const SettingsDialog = (handle: string, tag: string) => {
  const dialog = document.createElement("dialog");
  dialog.className = "options-dialog";
  dialog.style.cssText = `
  padding: 16px;
  border: 1px solid #2f3336;
  border-radius: 16px;
  background: #000;
  color: #fff;
  width: 300px;
`;

  // Create dialog content
  const options = [
    { text: "Don't show collapsed tweets", action: "hideAll" },
    { text: `Don't show tweets from ${handle}`, action: "hideUser" },
    { text: `Don't show tweets with tag "${tag}"`, action: "hideTag" },
  ];

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.style.cssText = `
    width: 100%;
    padding: 12px;
    text-align: left;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background: #2f3336;
    }
  `;

    button.addEventListener("click", () => {
      // Handle different options
      switch (option.action) {
        case "hideAll":
          // Add logic to hide all collapsed tweets
          console.log("hideAll");
          break;
        case "hideUser":
          // Add logic to hide tweets from this user
          console.log("hideUser");
          break;
        case "hideTag":
          // Add logic to hide tweets with this tag
          console.log("hideTag");
          break;
      }
      dialog.close();
    });

    dialog.appendChild(button);
  });

  return dialog;
};
