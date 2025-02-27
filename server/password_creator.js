const bcrypt = require('bcryptjs');

let password = "admin123";

async function hashPassword() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

hashPassword();

// const bcrypt = require('bcryptjs');

// let array = ["rahul123", "priya123", "anand123", "neha123", "vikas123", "simran123", "amit123", "kavita123", "suresh123", "divya123", "rajiv123", "meera123", "arjun123", "swati123", "vivek123"];

// async function hashPasswords() {
//   for (const element of array) {
//     const hashedPassword = await bcrypt.hash(element, 10);
//     console.log(element , hashedPassword);
//   }
// }

// hashPasswords();