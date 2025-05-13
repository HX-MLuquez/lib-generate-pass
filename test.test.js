const generatePassword = require('./index.js');

const pass1 = generatePassword(12, 'human2'); // Más aleatorio
const pass2 = generatePassword(14, 'human5'); // Más parecido a palabras
const passDefault = generatePassword(); // Con 6 caracteres y calidad "human3" por defecto

console.log(pass1); // "F@k5zH7l4u1Q"
console.log(pass2); // "Mik42trasoni9"
console.log(passDefault); // "a1e2i3o4"