const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// get user and add custom claim (teacher)
exports.addTeacherRole = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, {
      teacher: true,
    });
  }).then(()=>{
    return {
      message: `Success! ${data.email} has been made a teacher`,
    };
  }).catch((err) => {
    return err;
  });
});
