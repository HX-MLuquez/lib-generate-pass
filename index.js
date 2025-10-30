(function (global) {
  const characterTypes = {
    uppercase: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyzñ",
    consonant: "bcdfghjklmnpqrstvwxyzñ",
    vocal: "aeiou",
    number: "0123456789",
    special: "!@#$%^&*_+~|:?></-=",
  };

  // Caracteres ambiguos que pueden causar confusión
  const ambiguousChars = {
    uppercase: "OIZ",
    lowercase: "oil",
    number: "01",
    special: "|",
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

  // Diccionario de palabras simples en español para contraseñas memorables
  const wordList = {
    sustantivos: [
      "casa",
      "perro",
      "gato",
      "mesa",
      "libro",
      "agua",
      "sol",
      "luna",
      "mar",
      "rio",
      "flor",
      "arbol",
      "pan",
      "cafe",
      "cielo",
      "tierra",
      "fuego",
      "viento",
      "nube",
      "luz",
      "sombra",
      "camino",
      "puerta",
      "ventana",
    ],
    adjetivos: [
      "rojo",
      "azul",
      "verde",
      "grande",
      "pequeño",
      "feliz",
      "triste",
      "rapido",
      "lento",
      "fuerte",
      "suave",
      "claro",
      "oscuro",
      "nuevo",
      "viejo",
    ],
    verbos: [
      "correr",
      "saltar",
      "nadar",
      "volar",
      "comer",
      "beber",
      "dormir",
      "cantar",
      "bailar",
      "leer",
      "escribir",
      "jugar",
      "pensar",
      "soñar",
    ],
  };

  // Función para obtener un número aleatorio criptográficamente seguro
  function getSecureRandom() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / (0xffffffff + 1);
    }
    // Fallback a Math.random si crypto no está disponible
    return Math.random();
  }

  // Función para seleccionar un elemento aleatorio de forma segura
  function secureRandomChoice(array) {
    return array[Math.floor(getSecureRandom() * array.length)];
  }

  // Función para eliminar caracteres ambiguos de un conjunto
  function removeAmbiguous(chars, type) {
    if (!ambiguousChars[type]) return chars;
    const ambiguous = ambiguousChars[type];
    return chars
      .split("")
      .filter((c) => !ambiguous.includes(c))
      .join("");
  }

  // Función para obtener caracteres según opciones
  function getCharacterSet(type, options = {}) {
    let chars = characterTypes[type];
    if (!chars) return "";

    if (options.excludeAmbiguous) {
      chars = removeAmbiguous(chars, type);
    }

    return chars;
  }

  // 1. SISTEMA DE VALIDACIÓN DE FUERZA
  function calculatePasswordStrength(password) {
    if (!password || typeof password !== "string") {
      return { score: 0, level: "invalid", feedback: ["Contraseña inválida"] };
    }

    let score = 0;
    const feedback = [];
    const length = password.length;

    // Análisis de longitud
    if (length >= 16) {
      score += 30;
    } else if (length >= 12) {
      score += 20;
    } else if (length >= 8) {
      score += 10;
    } else {
      feedback.push("Contraseña muy corta (mínimo 8 caracteres recomendados)");
    }

    // Análisis de diversidad de caracteres
    const hasLowercase = /[a-zñ]/.test(password);
    const hasUppercase = /[A-ZÑ]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*_+~|:?><\/\-=]/.test(password);

    const diversity = [
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSpecial,
    ].filter(Boolean).length;
    score += diversity * 15;

    if (diversity === 4) {
      feedback.push("Excelente diversidad de caracteres");
    } else if (diversity < 3) {
      feedback.push("Agregar más tipos de caracteres mejorará la seguridad");
    }

    // Penalización por patrones comunes
    if (/(.)\1{2,}/.test(password)) {
      score -= 10;
      feedback.push("Evitar caracteres repetidos consecutivos");
    }

    if (/^[a-z]+$/.test(password) || /^[A-Z]+$/.test(password)) {
      score -= 15;
      feedback.push("Solo letras - muy vulnerable");
    }

    if (/^[0-9]+$/.test(password)) {
      score -= 20;
      feedback.push("Solo números - muy vulnerable");
    }

    // Calcular entropía aproximada
    const charsetSize =
      (hasLowercase ? 27 : 0) +
      (hasUppercase ? 27 : 0) +
      (hasNumbers ? 10 : 0) +
      (hasSpecial ? 19 : 0);

    const entropy = length * Math.log2(charsetSize);
    score += Math.min(entropy / 2, 30);

    // Normalizar score
    score = Math.max(0, Math.min(100, score));

    // Determinar nivel
    let level;
    if (score >= 80) level = "muy-fuerte";
    else if (score >= 60) level = "fuerte";
    else if (score >= 40) level = "moderada";
    else if (score >= 20) level = "débil";
    else level = "muy-débil";

    return {
      score: Math.round(score),
      level,
      entropy: Math.round(entropy),
      length,
      feedback: feedback.length > 0 ? feedback : ["Buena contraseña"],
      details: {
        hasLowercase,
        hasUppercase,
        hasNumbers,
        hasSpecial,
        diversity,
      },
    };
  }

  // 2. GENERACIÓN CON PATRONES PERSONALIZADOS
  function generateWithPattern(pattern, options = {}) {
    if (!pattern || typeof pattern !== "string") {
      throw new Error("Pattern must be a non-empty string");
    }

    const patternMap = {
      u: "uppercase", // U - mayúscula
      l: "lowercase", // l - minúscula
      d: "number", // d - dígito
      s: "special", // s - especial
      c: "consonant", // c - consonante
      v: "vocal", // v - vocal
    };

    const passwordChars = [];

    for (let char of pattern) {
      const lowerChar = char.toLowerCase();

      if (patternMap[lowerChar]) {
        const type = patternMap[lowerChar];
        const chars = getCharacterSet(type, options);

        if (chars.length === 0) {
          throw new Error(`No characters available for type: ${type}`);
        }

        passwordChars.push(secureRandomChoice(chars));
      } else if (char === "?") {
        // Carácter aleatorio de cualquier tipo
        const types = Object.keys(characterTypes);
        const randomType = secureRandomChoice(types);
        const chars = getCharacterSet(randomType, options);
        passwordChars.push(secureRandomChoice(chars));
      } else {
        // Carácter literal
        passwordChars.push(char);
      }
    }

    return passwordChars.join("");
  }

  // 3. FUNCIÓN PRINCIPAL CON EXCLUSIÓN DE AMBIGUOS
  function generatePassword(length = 6, quality = "human3", options = {}) {
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

    const MAX_ATTEMPTS = 100;
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
      attempt++;
      const usedTypes = {};
      const passwordChars = [];

      for (let i = 0; i < length; i++) {
        const type = secureRandomChoice(selectedTypes);
        const chars = getCharacterSet(type, options);

        if (chars.length === 0) {
          throw new Error(`No characters available for type: ${type}`);
        }

        const char = secureRandomChoice(chars);
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

  // 4. GENERACIÓN DE MÚLTIPLES CONTRASEÑAS
  function generateMultiple(
    count,
    length = 6,
    quality = "human3",
    options = {}
  ) {
    if (typeof count !== "number" || count < 1 || count > 100) {
      throw new Error("Count must be between 1 and 100.");
    }

    const passwords = [];
    const uniquePasswords = new Set();

    let attempts = 0;
    const MAX_TOTAL_ATTEMPTS = count * 50;

    while (passwords.length < count && attempts < MAX_TOTAL_ATTEMPTS) {
      attempts++;

      try {
        const password = generatePassword(length, quality, options);

        if (!uniquePasswords.has(password)) {
          uniquePasswords.add(password);
          passwords.push({
            password,
            strength: calculatePasswordStrength(password),
          });
        }
      } catch (error) {
        console.warn("Failed to generate password:", error.message);
      }
    }

    if (passwords.length < count) {
      throw new Error(
        `Could only generate ${passwords.length} unique passwords out of ${count} requested.`
      );
    }

    return passwords;
  }

  // 5. GENERACIÓN DE CONTRASEÑAS MEMORABLES
  function generateMemorable(options = {}) {
    const {
      words = 4,
      separator = "-",
      capitalize = true,
      includeNumber = true,
      includeSpecial = false,
      minWordLength = 3,
      maxWordLength = 7,
    } = options;

    if (words < 2 || words > 8) {
      throw new Error("Number of words must be between 2 and 8.");
    }

    const selectedWords = [];
    const categories = Object.keys(wordList);

    for (let i = 0; i < words; i++) {
      const category = secureRandomChoice(categories);
      const categoryWords = wordList[category].filter(
        (w) => w.length >= minWordLength && w.length <= maxWordLength
      );

      if (categoryWords.length === 0) {
        throw new Error("No words match the specified length criteria.");
      }

      let word = secureRandomChoice(categoryWords);

      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      selectedWords.push(word);
    }

    let password = selectedWords.join(separator);

    if (includeNumber) {
      const num = Math.floor(getSecureRandom() * 1000);
      password += separator + num;
    }

    if (includeSpecial) {
      const specials = "!@#$%&*";
      password += secureRandomChoice(specials);
    }

    return password;
  }

  // FUNCIÓN AUXILIAR: Generar con todas las opciones
  function generate(config = {}) {
    const {
      type = "standard", // "standard", "pattern", "memorable"
      length = 12,
      quality = "human3",
      pattern = null,
      count = 1,
      excludeAmbiguous = false,
      memorable = {},
    } = config;

    const options = { excludeAmbiguous };

    if (type === "pattern" && pattern) {
      if (count > 1) {
        return Array.from({ length: count }, () => ({
          password: generateWithPattern(pattern, options),
          strength: calculatePasswordStrength(
            generateWithPattern(pattern, options)
          ),
        }));
      }
      return generateWithPattern(pattern, options);
    }

    if (type === "memorable") {
      if (count > 1) {
        return Array.from({ length: count }, () => {
          const pwd = generateMemorable(memorable);
          return {
            password: pwd,
            strength: calculatePasswordStrength(pwd),
          };
        });
      }
      return generateMemorable(memorable);
    }

    // Standard generation
    if (count > 1) {
      return generateMultiple(count, length, quality, options);
    }

    return generatePassword(length, quality, options);
  }

  // Exportar todas las funciones
  const PasswordGenerator = {
    generate,
    generatePassword,
    generateWithPattern,
    generateMemorable,
    generateMultiple,
    calculatePasswordStrength,
    characterTypes,
    qualityConfig,
    wordList,
  };

  // Exportación universal
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = PasswordGenerator;
  } else {
    global.PasswordGenerator = PasswordGenerator;
    // Mantener retrocompatibilidad
    global.generatePassword = generatePassword;
  }
})(typeof window !== "undefined" ? window : global);
