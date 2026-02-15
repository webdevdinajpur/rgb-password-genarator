// --- Character sets ---
const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>/?";

// --- DOM Elements ---
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const output = document.getElementById("passwordOutput");
const copyBtn = document.querySelector(".copy-btn");
const generateBtn = document.querySelector(".generate-btn");
const strengthBar = document.querySelector(".strength-bar");

// Update slider value dynamically
lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

// --- Generate Unique Password ---
function generatePassword(length, options) {
  const { hasLower, hasUpper, hasNumber, hasSymbol } = options;

  let charPool = "";
  let password = "";

  if (hasLower) {
    charPool += lowerChars;
    password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  }
  if (hasUpper) {
    charPool += upperChars;
    password += upperChars[Math.floor(Math.random() * upperChars.length)];
  }
  if (hasNumber) {
    charPool += numbers;
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }
  if (hasSymbol) {
    charPool += symbols;
    password += symbols[Math.floor(Math.random() * symbols.length)];
  }

  // Fill remaining characters
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    password += charPool[randomIndex];
  }

  // Shuffle for unpredictability
  password = password.split("").sort(() => Math.random() - 0.5).join("");
  return password;
}

// --- Strength Meter ---
function updateStrength(password) {
  let strength = 0;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  if (password.length >= 12) strength++;

  const percentage = (strength / 5) * 100;
  strengthBar.style.width = percentage + "%";
}

// --- Typewriter Animation ---
function typePassword(password) {
  output.value = ""; // clear previous password
  let i = 0;

  const interval = setInterval(() => {
    output.value += password[i];
    i++;
    if (i >= password.length) clearInterval(interval);
  }, 50);
}

// --- Copy to Clipboard ---
copyBtn.addEventListener("click", () => {
  if (!output.value) return; // use .value for input
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  });
});

// --- Generate Button ---
generateBtn.addEventListener("click", () => {
  const options = {
    hasLower: document.querySelector("input[value='lower']").checked,
    hasUpper: document.querySelector("input[value='upper']").checked,
    hasNumber: document.querySelector("input[value='number']").checked,
    hasSymbol: document.querySelector("input[value='symbol']").checked,
  };

  const length = parseInt(lengthSlider.value);

  if (!options.hasLower && !options.hasUpper && !options.hasNumber && !options.hasSymbol) {
    alert("Please select at least one option!");
    return;
  }

  const password = generatePassword(length, options);
  typePassword(password);
  updateStrength(password);
});