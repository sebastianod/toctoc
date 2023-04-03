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
  if (context.auth.token.teacher !== true) {
    return "Error: Only teachers can create teacher roles!";
  }

  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        teacher: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made a teacher`,
      };
    })
    .catch((err) => {
      return err;
    });
});

// give custom claim of teacher to sebastianochoad@gmail.com
const userEmail = "sebastianochoad@gmail.com";
admin
  .auth()
  .getUserByEmail(userEmail)
  .then((user) => {
    //when promise is resolved you get the user

    const teacherClaim = {
      teacher: true,
    };

    admin
      .auth()
      .setCustomUserClaims(user.uid, teacherClaim)
      .then(() => {
        //response to user in front end
        console.log("Custom claim added to user");
      })
      .catch((error) => {
        console.log("Error adding custom claim:", error);
      });
  })
  .catch((error) => {
    console.log("Error fetching user data:", error);
  });

// write users to firestore if user is a teacher.
// First authenticate to get uid, then create a user document in users collection in firestore
exports.addUsers = functions.https.onCall(async (data, context) => {
  if (context.auth.token.teacher === true) {
    try {
      const users = data; // The array of user objects

      // Authenticate each user and get their UID, or get UID if user already exists
      const authPromises = users.map(async (user) => {
        const { email, password, name } = user;
        let uid = null;
        try {
          const userRecord = await admin.auth().getUserByEmail(email); // check if user already exists
          uid = userRecord.uid;
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            // if user doesn't exist, create user authentication
            const newUserRecord = await admin.auth().createUser({
              email,
              password,
              displayName: name,
            });
            uid = newUserRecord.uid;
          } else {
            throw error;
          }
        }
        return { uid, email, name }; // return user info whether user existed or was created
      });

      // Wait for all the authentication promises to resolve
      const authResults = await Promise.all(authPromises);

      // Create a Firestore document for each user
      const firestorePromises = authResults.map(async (authResult) => {
        const { uid, email, name } = authResult;
        const userDocRef = admin.firestore().collection("users").doc(uid);

        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          // User already exists, update their details
          await userDocRef.update({ email, name });
        } else {
          // User doesn't exist, create a new document
          const createdAt = new Date();
          await userDocRef.set({ email, name, createdAt });
        }
      });

      // Wait for all the Firestore promises to resolve
      await Promise.all(firestorePromises);

      return { success: true };
    } catch (error) {
      console.error("Error creating users:", error);
      throw new functions.https.HttpsError("internal", "Error creating users");
    }
  } else {
    return "Error: Only teachers can add users!";
  }
});
