window.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("themeCheckbox");
  const isDark = window.initialTheme.value === "dark";

  if(isDark) {
    checkbox.checked = isDark;
    const link = document.getElementById("theme");
    link.href = "dark.css";
  }

  checkbox.addEventListener("change", () => {
    console.log("Checkbox clicked" + isDark)
    window.windowAPI.setTheme(checkbox.checked ? "dark" : "light");
  });
});

window.windowAPI.onThemeChanged((theme) => {
  const link = document.getElementById("theme");
  if (link) {
    link.href = theme === "dark" ? "dark.css" : "light.css";
  }
});