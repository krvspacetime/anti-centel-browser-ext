// Hide user details
export function hideUserDetails() {
  console.log("Trying to hide user details ...");

  // First try to remove it directly
  const userDetailContainer = document.querySelector(
    "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > header > div > div > div > div.css-175oi2r.r-184id4b",
  ) as HTMLElement;
  const whatsHappeningImg = document.querySelector(
    "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-kemksi.r-1kqtdi0.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div.css-175oi2r.r-kemksi.r-184en5c > div > div.css-175oi2r.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-175oi2r.r-18kxxzh.r-1wron08.r-onrtq4.r-ttdzmv > div",
  ) as HTMLElement;

  if (userDetailContainer && whatsHappeningImg) {
    console.log("User details found.");
    userDetailContainer.style.display = "none";
    whatsHappeningImg.style.display = "none";
    console.log("User details removed.");
    return;
  }

  if (userDetailContainer === null && whatsHappeningImg === null) {
    console.log("User details not found.");
  }

  // If not found, set up observer
  const observer = new MutationObserver(() => {
    const container = document.querySelector(
      "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > header > div > div > div > div.css-175oi2r.r-184id4b",
    ) as HTMLElement;
    const whatsHappeningImg = document.querySelector(
      "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-14lw9ot.r-jxzhtn.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div.css-175oi2r.r-14lw9ot.r-184en5c > div > div.css-175oi2r.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-175oi2r.r-18kxxzh.r-1wron08.r-onrtq4.r-ttdzmv > div",
    ) as HTMLElement;

    if (container && whatsHappeningImg) {
      container.style.display = "none";
      whatsHappeningImg.style.display = "none";
      console.log("User details removed.");
      observer.disconnect();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}
