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

const handleClick = async (type) => {
  const tab = await getCurrentTab();
  const text = currentTabInfo(tab.title, tab.url).format(type);

  const completed = await updateClipboard(text);
  if (!completed) {
    return;
  }

  const buttonText = document.getElementById("copy-button-text");
  const buttonIcon = document.getElementById("copy-button-icon");
  buttonText.innerText = "copied";
  buttonIcon.innerText = "check_circle";
  
  setTimeout(() => {
    buttonText.innerText = "markdown style";
    buttonIcon.innerText = "content_copy";
  }, 3000);
};

document.addEventListener("DOMContentLoaded", () => {
  // update title / URL
  getCurrentTab()
    .then((tab) => {
      const title = document.getElementById("current-tab-title");
      const url = document.getElementById("current-tab-url");
      const img = document.getElementById("current-tab-icon");
      title.innerText = tab.title;
      url.innerText = tab.url;
      img.src = tab.favIconUrl;
    })
    .catch((error) => {
      console.error(error);
    });

  // add EventLister to copy button
  const button = document.getElementById("copy-button");
  button.addEventListener("click", () => handleClick("markdown"));
});
