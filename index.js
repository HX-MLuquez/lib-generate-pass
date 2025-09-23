(function (global) {
  const characterTypes = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyzñ",
    consonant: "bcdfghjklmnpqrstvwxyzñ",
    vocal: "aeiou",
    number: "0123456789",
    special: "!@#$%^&*_+~|:?></-=",
  };

  const qualityConfig = {
    human1: ["special", "uppercase", "number", "lowercase"],
    human2: [
      "special",
      "uppercase",
      "uppercase",
      "number",
      "number",
      "lowercase",
      "lowercase",
    ],
    human3: [
      "uppercase",
      "vocal",
      "consonant",
      "number",
      "lowercase",
      "lowercase",
      "vocal",
      "consonant",
    ],
    human4: [
      "uppercase",
      "consonant",
      "vocal",
      "lowercase",
      "vocal",
      "consonant",
      "lowercase",
      "lowercase",
      "number",
    ],
    human5: [
      "lowercase",
      "vocal",
      "consonant",
      "vocal",
      "lowercase",
      "vocal",
      "consonant",
      "number",
    ],
  };

  // Función principal
  function generatePassword(length = 6, quality = "human3") {
    if (typeof length !== "number" || length < 4 || length > 24) {
      throw new Error("Password length must be between 4 and 24 characters.");
    }

    const selectedTypes = qualityConfig[quality];
    if (!selectedTypes) {
      throw new Error("Invalid quality level. Use human1 to human5.");
    }

    const requiredTypes = [...new Set(selectedTypes)];
    if (length < requiredTypes.length) {
      throw new Error("Password length too short for required complexity.");
    }

    const MAX_ATTEMPTS = 100; //* Número máximo de intentos para generar la contraseña
    let attempt = 0; //* Contador de intentos

    while (attempt < MAX_ATTEMPTS) {
      attempt++;

      const usedTypes = {};
      const passwordChars = [];

      for (let i = 0; i < length; i++) {
        const type =
          selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
        const chars = characterTypes[type];
        const char = chars[Math.floor(Math.random() * chars.length)];
        passwordChars.push(char);
        usedTypes[type] = true;
      }

      const allRequiredIncluded = requiredTypes.every((t) => usedTypes[t]);

      if (allRequiredIncluded) {
        return passwordChars.join("");
      }
    }

    throw new Error("Failed to generate password with desired complexity.");
  }

  // Exportación universal
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = generatePassword;
  } else {
    global.generatePassword = generatePassword;
  }
})(typeof window !== "undefined" ? window : global);
