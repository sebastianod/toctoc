const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// get user and add custom claim (teacher)
// addTeacherRole will be accessible from client. onCall does that.
// onCall( <callback> ), callback will fire when addTeacherRole is called
exports.addTeacherRole = functions.https.onCall((data, context) => {
  // context has info on the user that is triggering the function
  // Check if user is a teacher, only they can set other teachers
  if ( context.auth.token.teacher !== true ) {
    return {error: "Only teachers can create teacher roles!"};
  }

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
