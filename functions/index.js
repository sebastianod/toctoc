const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// get user and add custom claim (teacher)
// addTeacherRole will be accessible from client. onCall does that.
// onCall( <callback> ), callback will fire when addTeacherRole is called
// <callback> has two inputs, data and context. Data is what will get passed
// to the function addTeacherRole. Context has context regarding the user
exports.addTeacherRole = functions.https.onCall((data, context) => {
  // context has info on the user that is triggering the function
  // Check if user is a teacher, only they can set other teachers
  if ( context.auth.token.teacher !== true ) {
    return "Error: Only teachers can create teacher roles!";
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

// give custom claim of teacher to sebastianochoad@gmail.com
const userEmail = 'sebastianochoad@gmail.com';
admin.auth().getUserByEmail(userEmail) 
  .then((user) => { //when promise is resolved you get the user

    const teacherClaim = {
      teacher: true
    };
    
    admin.auth().setCustomUserClaims(user.uid, teacherClaim)
      .then(() => { //response to user in front end
        console.log('Custom claim added to user');
      })
      .catch((error) => {
        console.log('Error adding custom claim:', error);
      });
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
