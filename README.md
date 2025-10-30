# 🔐 LIB-GENERATE-CODE

Librería moderna y completa para generar contraseñas seguras con múltiples estrategias: estándar, patrones personalizados, memorables y más.

[![npm version](https://img.shields.io/npm/v/lib-generate-code.svg)](https://www.npmjs.com/package/lib-generate-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

- 🎲 **Generación criptográficamente segura** usando `crypto.getRandomValues()`
- 🎯 **5 niveles de calidad predefinidos** (human1 a human5)
- 🔤 **Patrones personalizados** para contraseñas específicas
- 🧠 **Contraseñas memorables** estilo "correct-horse-battery-staple"
- 🚫 **Exclusión de caracteres ambiguos** (0/O, 1/l/I)
- 📊 **Validación de fuerza** con score y feedback detallado
- 🔢 **Generación múltiple** sin duplicados
- 🌐 **Soporte para español** (incluye ñ y palabras en español)
- ♻️ **Retrocompatible** con versiones anteriores

## 📦 Instalación

```bash
npm install lib-generate-code
```

## 🚀 Uso Rápido

```javascript
const PasswordGenerator = require("lib-generate-code");

// Generación estándar
const password = PasswordGenerator.generatePassword(12, "human3");
console.log(password); // "Ab3$xYz9Mn2@"

// Con la API unificada
const pwd = PasswordGenerator.generate({
  length: 12,
  quality: "human3",
  excludeAmbiguous: true,
});
```

## 📚 API Completa

### 1. Generación Estándar

#### `generatePassword(length, quality, options)`

Genera una contraseña con longitud y calidad específicas.

**Parámetros:**

- `length` (number, 4-24): Longitud de la contraseña
- `quality` (string): Nivel de calidad (human1 a human5)
- `options` (object, opcional):
  - `excludeAmbiguous` (boolean): Excluir caracteres ambiguos

**Niveles de calidad:**

| Nivel    | Descripción                   | Ejemplo      |
| -------- | ----------------------------- | ------------ |
| `human1` | Muy aleatorio y seguro        | `F@k5zH7l`   |
| `human2` | Balance seguridad/legibilidad | `K@9M#3pL2x` |
| `human3` | Equilibrado (por defecto)     | `Ae4xMn8Tu`  |
| `human4` | Más pronunciable              | `Dapo2miku9` |
| `human5` | Muy pronunciable              | `vano3lecu8` |

```javascript
// Básico
const pass1 = PasswordGenerator.generatePassword(12, "human2");

// Sin caracteres ambiguos
const pass2 = PasswordGenerator.generatePassword(12, "human3", {
  excludeAmbiguous: true,
});

// Por defecto (6 caracteres, human3)
const passDefault = PasswordGenerator.generatePassword();
```

### 2. Patrones Personalizados

#### `generateWithPattern(pattern, options)`

Genera contraseñas siguiendo un patrón específico.

**Caracteres de patrón:**

- `u` - Mayúscula (Uppercase)
- `l` - Minúscula (Lowercase)
- `d` - Dígito (Digit)
- `s` - Especial (Special)
- `c` - Consonante
- `v` - Vocal
- `?` - Aleatorio
- Cualquier otro carácter se incluye literalmente

```javascript
// Formato tarjeta de crédito
const cc = PasswordGenerator.generateWithPattern("dddd-dddd-dddd-dddd");
// Resultado: "4829-3761-0284-5932"

// Formato corporativo
const corp = PasswordGenerator.generateWithPattern("uudd-llll-ssss");
// Resultado: "AB42-xypz-@#!%"

// Pronunciable personalizado
const pronounceable = PasswordGenerator.generateWithPattern("vcvc-dddd");
// Resultado: "omo-8374"

// Con exclusión de ambiguos
const safe = PasswordGenerator.generateWithPattern("uuddllll", {
  excludeAmbiguous: true,
});
```

### 3. Contraseñas Memorables

#### `generateMemorable(options)`

Genera contraseñas fáciles de recordar usando palabras en español.

**Opciones:**

- `words` (number, 2-8): Cantidad de palabras (default: 4)
- `separator` (string): Separador entre palabras (default: "-")
- `capitalize` (boolean): Capitalizar primera letra (default: true)
- `includeNumber` (boolean): Agregar número al final (default: true)
- `includeSpecial` (boolean): Agregar carácter especial (default: false)
- `minWordLength` (number): Longitud mínima de palabras (default: 3)
- `maxWordLength` (number): Longitud máxima de palabras (default: 7)

```javascript
// Básica
const memo1 = PasswordGenerator.generateMemorable();
// Resultado: "Casa-Feliz-Correr-Azul-742"

// Segura
const memo2 = PasswordGenerator.generateMemorable({
  words: 5,
  separator: ".",
  capitalize: true,
  includeNumber: true,
  includeSpecial: true,
});
// Resultado: "Perro.Grande.Saltar.Verde.Rapido.891@"

// Simple
const memo3 = PasswordGenerator.generateMemorable({
  words: 3,
  separator: "_",
  capitalize: false,
  includeNumber: false,
});
// Resultado: "gato_mesa_libro"
```

### 4. Generación Múltiple

#### `generateMultiple(count, length, quality, options)`

Genera múltiples contraseñas únicas con análisis de fuerza.

```javascript
const passwords = PasswordGenerator.generateMultiple(5, 12, "human3", {
  excludeAmbiguous: true,
});

// Resultado:
// [
//   {
//     password: "Ab3$xYz9Mn2@",
//     strength: { score: 78, level: "muy-fuerte", ... }
//   },
//   ...
// ]

passwords.forEach((item, i) => {
  console.log(`${i + 1}. ${item.password} (${item.strength.score}/100)`);
});
```

### 5. Validación de Fuerza

#### `calculatePasswordStrength(password)`

Analiza la fortaleza de cualquier contraseña.

**Retorna:**

```javascript
{
  score: 78,              // 0-100
  level: "muy-fuerte",    // muy-débil, débil, moderada, fuerte, muy-fuerte
  entropy: 68,            // Bits de entropía
  length: 12,             // Longitud
  feedback: [...],        // Array de sugerencias
  details: {
    hasLowercase: true,
    hasUppercase: true,
    hasNumbers: true,
    hasSpecial: true,
    diversity: 4
  }
}
```

```javascript
const strength = PasswordGenerator.calculatePasswordStrength("MyP@ssw0rd123");
console.log(strength.score); // 65
console.log(strength.level); // "fuerte"
console.log(strength.entropy); // 78
console.log(strength.feedback); // ["Excelente diversidad de caracteres"]
```

### 6. API Unificada

#### `generate(config)`

API todo-en-uno para cualquier tipo de generación.

```javascript
// Estándar
const pwd1 = PasswordGenerator.generate({
  length: 12,
  quality: "human3",
  excludeAmbiguous: true,
});

// Patrón
const pwd2 = PasswordGenerator.generate({
  type: "pattern",
  pattern: "uudd-llll-ssss",
});

// Memorable
const pwd3 = PasswordGenerator.generate({
  type: "memorable",
  memorable: {
    words: 4,
    includeNumber: true,
  },
});

// Múltiples con patrón
const pwds = PasswordGenerator.generate({
  type: "pattern",
  pattern: "uudd-llll",
  count: 5,
  excludeAmbiguous: true,
});
```

## 🎯 Ejemplos de Uso

### Caso 1: Sistema Corporativo

```javascript
// Contraseñas seguras sin caracteres ambiguos
const corporatePassword = PasswordGenerator.generate({
  length: 16,
  quality: "human2",
  excludeAmbiguous: true,
});
```

### Caso 2: Contraseñas Temporales

```javascript
// Patrón específico para PIN temporales
const tempPin = PasswordGenerator.generateWithPattern("dddd-dddd");
```

### Caso 3: Onboarding de Usuarios

```javascript
// Genera 10 contraseñas temporales únicas
const userPasswords = PasswordGenerator.generateMultiple(10, 10, "human4", {
  excludeAmbiguous: true,
});

userPasswords.forEach(({ password, strength }) => {
  console.log(`Password: ${password} - Fuerza: ${strength.level}`);
});
```

### Caso 4: Contraseñas para Usuarios Finales

```javascript
// Fácil de recordar pero segura
const userFriendly = PasswordGenerator.generateMemorable({
  words: 4,
  separator: "-",
  capitalize: true,
  includeNumber: true,
});

const strength = PasswordGenerator.calculatePasswordStrength(userFriendly);
console.log(`Password: ${userFriendly}`);
console.log(`Seguridad: ${strength.score}/100`);
```

### Caso 5: Validación de Políticas

```javascript
function validatePasswordPolicy(password) {
  const strength = PasswordGenerator.calculatePasswordStrength(password);

  if (strength.score < 60) {
    return {
      valid: false,
      message: `Contraseña muy débil. ${strength.feedback.join(". ")}`,
    };
  }

  if (strength.details.diversity < 3) {
    return {
      valid: false,
      message: "Debe incluir al menos 3 tipos de caracteres diferentes",
    };
  }

  return { valid: true };
}
```

## 🔧 Configuración Avanzada

### Acceso a Configuraciones Internas

```javascript
// Ver todos los tipos de caracteres disponibles
console.log(PasswordGenerator.characterTypes);

// Ver configuraciones de calidad
console.log(PasswordGenerator.qualityConfig);

// Ver diccionario de palabras memorables
console.log(PasswordGenerator.wordList);
```

### Caracteres Disponibles

- **uppercase**: `ABCDEFGHIJKLMNÑOPQRSTUVWXYZ`
- **lowercase**: `abcdefghijklmnopqrstuvwxyzñ`
- **number**: `0123456789`
- **special**: `!@#$%^&*_+~|:?></-=`
- **consonant**: `bcdfghjklmnpqrstvwxyzñ`
- **vocal**: `aeiou`

### Caracteres Ambiguos Excluidos

Cuando se usa `excludeAmbiguous: true`, se excluyen:

- Mayúsculas: `O`, `I`, `Z`
- Minúsculas: `o`, `i`, `l`
- Números: `0`, `1`
- Especiales: `|`

## 🔒 Seguridad

Esta librería utiliza:

- `crypto.getRandomValues()` cuando está disponible (navegador/Node.js moderno)
- Fallback a `Math.random()` en entornos sin crypto API
- Sin duplicados garantizado en generación múltiple
- Validación de complejidad en cada generación

## ⚡ Rendimiento

- Generación típica: < 1ms
- Generación múltiple (100): < 50ms
- Sin bloqueo del event loop
- Optimizado para Node.js y navegadores

## 🧪 Testing

```bash
npm test
```

El archivo `test.js` incluye pruebas completas de todas las funcionalidades.

## 📝 Retrocompatibilidad

El código anterior sigue funcionando:

```javascript
const generatePassword = require("lib-generate-code");

const pass1 = generatePassword(12, "human2");
const pass2 = generatePassword(14, "human5");
const passDefault = generatePassword();
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👨‍💻 Autor

Tu Nombre / Empresa

## 🔗 Enlaces

- [Repositorio en GitHub](https://github.com/tu-usuario/lib-generate-code)
- [Reportar un bug](https://github.com/tu-usuario/lib-generate-code/issues)
- [NPM Package](https://www.npmjs.com/package/lib-generate-code)

---

