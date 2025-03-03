const currentTabInfo = (title, url) => {
  const format = (type) => {
    switch(type) {
      case "markdown":
        return `[${title}](${url})`;
      default:
        return title;
    }
  }

  return {
    format,
  };
}

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

const updateClipboard = async (newClip) => {
  const permissionOption = { name: "clipboard-write" };
  const result = await navigator.permissions.query(permissionOption);

  if (result.state !== "granted") {
    return false;
  }

  try {
    await navigator.clipboard.writeText(newClip);
    return true;
  } catch(error) {
    console.error(error);
    return false;
  }
};

const copy = async (type) => {
  const tab = await getCurrentTab();
  const text = currentTabInfo(tab.title, tab.url).format(type);

  return await updateClipboard(text);
};

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("copy-button/markdown");
  button.addEventListener("click", () => copy("markdown"));
});
