const reshape = require('arabic-reshaper');
const original = 'مكتب التكوين المهني وإنعاش الشغل';
const reshaped = reshape.convertArabic ? reshape.convertArabic(original) : reshape(original);
const reversed = reshaped.split('').reverse().join('');

console.log('--- REVERSED AND SHAPED ---');
console.log(reversed);
console.log('---------------------------');
