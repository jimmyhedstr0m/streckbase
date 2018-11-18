// export interface User {
//   id: string;
//   firstname: string;
//   lastname: string;
//   email?: string;
//   debt: number;
// }


// export type UserModel = mongoose.Document & {
//   email: string,
//   password: string,
//   passwordResetToken: string,
//   passwordResetExpires: Date,

//   facebook: string,
//   tokens: AuthToken[],

//   profile: {
//     name: string,
//     gender: string,
//     location: string,
//     website: string,
//     picture: string
//   },

//   comparePassword: comparePasswordFunction,
//   gravatar: (size: number) => string
// };

// const db = require('./../config/dbConnection');

// exports.get = (userId, done) => {
//   db.query('SELECT user_id, firstname, lastname, email, debt FROM Users WHERE user_id=?', [userId], (error, results) => {
//     done(error, results);
//   });
// }

// exports.getAll = () => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT user_id, firstname, lastname, email, debt FROM Users', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         const responseArray = results.map((result) => ({
//           id: result.user_id,
//           firstname: result.firstname,
//           lastname: result.lastname,
//           email: result.email,
//           debt: result.debt
//         }));

//         resolve(responseArray);
//       }
//     });
//   });
// }
