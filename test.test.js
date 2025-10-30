const PasswordGenerator = require("./index.js");

console.log("========================================");
console.log("  PASSWORD GENERATOR - TESTS ACTUALIZADOS");
console.log("========================================\n");

// ============================================
// 1. GENERACIÓN ESTÁNDAR (Retrocompatibilidad)
// ============================================
console.log("1️⃣  GENERACIÓN ESTÁNDAR\n");

const pass1 = PasswordGenerator.generatePassword(12, "human2");
const pass2 = PasswordGenerator.generatePassword(14, "human5");
const passDefault = PasswordGenerator.generatePassword();

console.log("Aleatorio (12 chars, human2):", pass1);
console.log("Pronunciable (14 chars, human5):", pass2);
console.log("Por defecto (6 chars, human3):", passDefault);

// ============================================
// 2. VALIDACIÓN DE FUERZA
// ============================================
console.log("\n2️⃣  VALIDACIÓN DE FUERZA\n");

const passwords = [
  pass1,
  pass2,
  passDefault,
  "password123",
  "MyS3cur3P@ssw0rd!",
];

passwords.forEach((pwd) => {
  const strength = PasswordGenerator.calculatePasswordStrength(pwd);
  console.log(`Password: "${pwd}"`);
  console.log(`  Score: ${strength.score}/100`);
  console.log(`  Nivel: ${strength.level}`);
  console.log(`  Entropía: ${strength.entropy} bits`);
  console.log(`  Feedback: ${strength.feedback.join(", ")}\n`);
});

// ============================================
// 3. EXCLUSIÓN DE CARACTERES AMBIGUOS
// ============================================
console.log("3️⃣  EXCLUSIÓN DE CARACTERES AMBIGUOS\n");

const normalPass = PasswordGenerator.generatePassword(12, "human2");
const noAmbiguousPass = PasswordGenerator.generatePassword(12, "human2", {
  excludeAmbiguous: true,
});

console.log("Normal:", normalPass);
console.log("Sin ambiguos (sin 0/O, 1/l/I):", noAmbiguousPass);

// Verificar que no contenga caracteres ambiguos
const hasAmbiguous = /[0OIZil|]/.test(noAmbiguousPass);
console.log("¿Contiene ambiguos?:", hasAmbiguous ? "❌ SÍ" : "✅ NO");

// ============================================
// 4. PATRONES PERSONALIZADOS
// ============================================
console.log("\n4️⃣  PATRONES PERSONALIZADOS\n");

const patterns = [
  {
    pattern: "uudd-llll",
    description: "2 mayúsculas, 2 dígitos, guion, 4 minúsculas",
  },
  {
    pattern: "ullds-ssss",
    description:
      "Mayúscula, 2 minúsculas, dígito, especial, guion, 4 especiales",
  },
  {
    pattern: "vcvc-dddd",
    description: "Vocal, consonante, vocal, consonante, guion, 4 dígitos",
  },
  {
    pattern: "????-????-????",
    description: "12 caracteres aleatorios separados por guiones",
  },
];

patterns.forEach(({ pattern, description }) => {
  const pwd = PasswordGenerator.generateWithPattern(pattern);
  console.log(`Patrón: "${pattern}"`);
  console.log(`Descripción: ${description}`);
  console.log(`Resultado: ${pwd}\n`);
});

// Con exclusión de ambiguos
const patternNoAmbiguous = PasswordGenerator.generateWithPattern("uuddllll", {
  excludeAmbiguous: true,
});
console.log("Patrón sin ambiguos:", patternNoAmbiguous, "\n");

// ============================================
// 5. GENERACIÓN MÚLTIPLE
// ============================================
console.log("5️⃣  GENERACIÓN MÚLTIPLE\n");

const multiplePasswords = PasswordGenerator.generateMultiple(5, 12, "human3", {
  excludeAmbiguous: true,
});

console.log("5 contraseñas únicas generadas:\n");
multiplePasswords.forEach((item, index) => {
  console.log(`${index + 1}. ${item.password}`);
  console.log(`   Fuerza: ${item.strength.score}/100 (${item.strength.level})`);
});

// ============================================
// 6. CONTRASEÑAS MEMORABLES
// ============================================
console.log("\n6️⃣  CONTRASEÑAS MEMORABLES\n");

// Configuración básica
const memorable1 = PasswordGenerator.generateMemorable({
  words: 4,
  separator: "-",
  capitalize: true,
  includeNumber: true,
});
console.log("Memorable básico (4 palabras + número):", memorable1);

// Más segura
const memorable2 = PasswordGenerator.generateMemorable({
  words: 5,
  separator: ".",
  capitalize: true,
  includeNumber: true,
  includeSpecial: true,
});
console.log("Memorable seguro (5 palabras + número + especial):", memorable2);

// Corta y simple
const memorable3 = PasswordGenerator.generateMemorable({
  words: 3,
  separator: "_",
  capitalize: false,
  includeNumber: false,
});
console.log("Memorable simple (3 palabras):", memorable3);

// Analizar fuerza de memorables
const memorableStrength =
  PasswordGenerator.calculatePasswordStrength(memorable1);
console.log(
  `\nFuerza del memorable: ${memorableStrength.score}/100 (${memorableStrength.level})`
);

// ============================================
// 7. API UNIFICADA generate()
// ============================================
console.log("\n7️⃣  API UNIFICADA - generate()\n");

// Estándar
const std = PasswordGenerator.generate({
  length: 12,
  quality: "human3",
  excludeAmbiguous: true,
});
console.log("Estándar:", std);

// Patrón
const ptrn = PasswordGenerator.generate({
  type: "pattern",
  pattern: "uudd-llll-ssss",
  excludeAmbiguous: true,
});
console.log("Con patrón:", ptrn);

// Memorable
const memo = PasswordGenerator.generate({
  type: "memorable",
  memorable: {
    words: 4,
    includeNumber: true,
  },
});
console.log("Memorable:", memo);

// Múltiples con patrón
const multiPattern = PasswordGenerator.generate({
  type: "pattern",
  pattern: "uudd-llll",
  count: 3,
  excludeAmbiguous: true,
});
console.log("\n3 contraseñas con patrón:");
multiPattern.forEach((item, i) => {
  console.log(`  ${i + 1}. ${item.password} (${item.strength.score}/100)`);
});

// ============================================
// 8. CASOS EXTREMOS Y MANEJO DE ERRORES
// ============================================
console.log("\n8️⃣  CASOS EXTREMOS\n");

try {
  // Longitud mínima
  const minPass = PasswordGenerator.generatePassword(4, "human1");
  console.log("✅ Longitud mínima (4):", minPass);
} catch (error) {
  console.log("❌ Error:", error.message);
}

try {
  // Longitud máxima
  const maxPass = PasswordGenerator.generatePassword(24, "human4");
  console.log("✅ Longitud máxima (24):", maxPass);
} catch (error) {
  console.log("❌ Error:", error.message);
}

try {
  // Patrón complejo
  const complexPattern = PasswordGenerator.generateWithPattern(
    "uuuu-dddd-ssss-llll"
  );
  console.log("✅ Patrón complejo:", complexPattern);
} catch (error) {
  console.log("❌ Error:", error.message);
}

try {
  // Múltiples memorables
  const multiMemo = PasswordGenerator.generate({
    type: "memorable",
    count: 3,
    memorable: { words: 3, includeNumber: true },
  });
  console.log("✅ 3 contraseñas memorables generadas");
  multiMemo.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.password}`);
  });
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Errores esperados
console.log("\n❌ PRUEBAS DE ERRORES ESPERADOS:\n");

try {
  PasswordGenerator.generatePassword(3, "human1");
} catch (error) {
  console.log("✓ Longitud muy corta:", error.message);
}

try {
  PasswordGenerator.generatePassword(25, "human1");
} catch (error) {
  console.log("✓ Longitud muy larga:", error.message);
}

try {
  PasswordGenerator.generatePassword(12, "human99");
} catch (error) {
  console.log("✓ Calidad inválida:", error.message);
}

try {
  PasswordGenerator.generateWithPattern("");
} catch (error) {
  console.log("✓ Patrón vacío:", error.message);
}

try {
  PasswordGenerator.generateMultiple(150, 12, "human3");
} catch (error) {
  console.log("✓ Demasiadas contraseñas:", error.message);
}

// ============================================
// 9. COMPARACIÓN DE CALIDADES
// ============================================
console.log("\n9️⃣  COMPARACIÓN DE CALIDADES\n");

const qualities = ["human1", "human2", "human3", "human4", "human5"];
qualities.forEach((quality) => {
  const pwd = PasswordGenerator.generatePassword(12, quality);
  const strength = PasswordGenerator.calculatePasswordStrength(pwd);
  console.log(`${quality}: ${pwd}`);
  console.log(`  Score: ${strength.score}/100, Nivel: ${strength.level}\n`);
});

console.log("========================================");
console.log("  ✅ TODOS LOS TESTS COMPLETADOS");
console.log("========================================");

//* -----------------------------------------------------------------------

/*
* INFORME de EJEMPLO
========================================
  PASSWORD GENERATOR - TESTS ACTUALIZADOS
========================================

1️⃣  GENERACIÓN ESTÁNDAR

Aleatorio (12 chars, human2): 2CiT9e-sJ6Uf
Pronunciable (14 chars, human5): uuve3ee5rgadbm
Por defecto (6 chars, human3): 4vuocM

2️⃣  VALIDACIÓN DE FUERZA

Password: "2CiT9e-sJ6Uf"
  Score: 100/100
  Nivel: muy-fuerte
  Entropía: 77 bits
  Feedback: Excelente diversidad de caracteres

Password: "uuve3ee5rgadbm"
  Score: 80/100
  Nivel: muy-fuerte
  Entropía: 73 bits
  Feedback: Agregar más tipos de caracteres mejorará la seguridad

Password: "4vuocM"
  Score: 63/100
  Nivel: fuerte
  Entropía: 36 bits
  Feedback: Contraseña muy corta (mínimo 8 caracteres recomendados)

Password: "password123"
  Score: 69/100
  Nivel: fuerte
  Entropía: 57 bits
  Feedback: Agregar más tipos de caracteres mejorará la seguridad

Password: "MyS3cur3P@ssw0rd!"
  Score: 100/100
  Nivel: muy-fuerte
  Entropía: 108 bits
  Feedback: Excelente diversidad de caracteres

3️⃣  EXCLUSIÓN DE CARACTERES AMBIGUOS

Normal: *57!*NM7yzcm
Sin ambiguos (sin 0/O, 1/l/I): +YBñzR%u/d4t
¿Contiene ambiguos?: ✅ NO

4️⃣  PATRONES PERSONALIZADOS

Patrón: "uudd-llll"
Descripción: 2 mayúsculas, 2 dígitos, guion, 4 minúsculas
Resultado: RC32-lirw

Patrón: "ullds-ssss"
Descripción: Mayúscula, 2 minúsculas, dígito, especial, guion, 4 especiales
Resultado: Ewr6&-^&~?

Patrón: "vcvc-dddd"
Descripción: Vocal, consonante, vocal, consonante, guion, 4 dígitos
Resultado: imuh-5171

Patrón: "????-????-????"
Descripción: 12 caracteres aleatorios separados por guiones
Resultado: G~sZ-/6iv-?azR

Patrón sin ambiguos: WH69sprd

5️⃣  GENERACIÓN MÚLTIPLE

5 contraseñas únicas generadas:

1. hduhx8rgtSnx
   Fuerza: 95/100 (muy-fuerte)
2. hBpkazieh6wa
   Fuerza: 95/100 (muy-fuerte)
3. ej9i5oidEyañ
   Fuerza: 95/100 (muy-fuerte)
4. Mea8qihcwAgJ
   Fuerza: 95/100 (muy-fuerte)
5. 7t9qhdojiÑhE
   Fuerza: 95/100 (muy-fuerte)

6️⃣  CONTRASEÑAS MEMORABLES

Memorable básico (4 palabras + número): Flor-Leer-Luz-Pequeño-179
Memorable seguro (5 palabras + número + especial): Azul.Viejo.Libro.Feliz.Grande.841&
Memorable simple (3 palabras): soñar_puerta_tierra

Fuerza del memorable: 100/100 (muy-fuerte)

7️⃣  API UNIFICADA - generate()

Estándar: qiS5yg3PAekr
Con patrón: TU47-mgvm-=/->
Memorable: Nuevo-Volar-Rojo-Leer-466

3 contraseñas con patrón:
  1. VE93-tpkz (99/100)
  2. DA78-gjhd (99/100)
  3. HR36-gcwf (99/100)

8️⃣  CASOS EXTREMOS

✅ Longitud mínima (4): $Ri6
✅ Longitud máxima (24): khRovaapz75mi9v5aeievzñR
✅ Patrón complejo: HGDY-8630-+?*~-lcbc
✅ 3 contraseñas memorables generadas
  1. Bailar-Sombra-Puerta-756
  2. Rapido-Lento-Rio-967
  3. Azul-Viento-Viento-212

❌ PRUEBAS DE ERRORES ESPERADOS:

✓ Longitud muy corta: Password length must be between 4 and 24 characters.
✓ Longitud muy larga: Password length must be between 4 and 24 characters.
✓ Calidad inválida: Invalid quality level. Use human1 to human5.
✓ Patrón vacío: Pattern must be a non-empty string
✓ Demasiadas contraseñas: Count must be between 1 and 100.

9️⃣  COMPARACIÓN DE CALIDADES

human1: %npH*9qs55_<
  Score: 100/100, Nivel: muy-fuerte

human2: e++dGN6gw6m6
  Score: 100/100, Nivel: muy-fuerte

human3: kivAodjp7ñ8d
  Score: 95/100, Nivel: muy-fuerte

human4: Una8d0cexWtx
  Score: 95/100, Nivel: muy-fuerte

human5: 6ceieodatouw
  Score: 80/100, Nivel: muy-fuerte

========================================
  ✅ TODOS LOS TESTS COMPLETADOS
========================================
*/
