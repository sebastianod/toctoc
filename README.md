# TocToc

**The problem:** ESL teachers can easily take two weeks in testing and or grading their student's pronunciation, be it in the classroom or through sent audios that the teacher must later listen to and grade. 

**The solution:** TocToc, A simple app that allows teachers to create courses with tests that include the words or phrases to grade and do it instantly.

.

.

.

## Security

### Data structure and Security rules
Security concerns will directly impact decisions made for our data structure.

In order to create user roles that decide what content is shown to what users, and so that a student cannot simply change a test's questions or their own grades, we need to choose a way to set these roles.
We are presented with two choices that directly impact our data structure:
1. Create `teachers` and `students` collections in order to create user roles.
```
/teachers (collection)
    - teacherId (document)
/students (collection)
    - studentId (document)
 ```
2. Create a `users` collection where users can have custom claims with the `teacher` or `student` role.

```
/users (collection)
    - userId (document)
        - name: <string>
        - email: <string>
        - customClaims: ["teacher"]
    - userId (document)
        - name: <string>
        - email: <string>
        - customClaims: ["student"]
```

If we choose to make a teachers and a students collection, these will need their own firestore security rules adding more complexity. 
While if we choose to only create a users collection that uses custom claims, we need not make extra security rules for these collections.

.

.

.

### Protected routes
In the frontend we need to check a user's status and based on this show different UI. If the user is athenticated as a teacher, they should be directed to the teacher dashboard, while if they're a student, they should be directed to the student dashboard. 

We accomplish this through a combination of:
1. [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims). Through which we set the userId document with the role for each user, student or teacher.
2. [React router](https://reactrouter.com/en/main/start/overview), through a [higher order component](https://www.makeuseof.com/create-protected-route-in-react/) that checks a user's authentication before rendering one of the above mentioned components.

## Firebase Authentication

I'm using Firebase for all things database and authentication. Here are a few important mentions.

### `getAuth()` method
 `auth` is a reference to the Firebase Authentication service that you can use to create and manage user accounts, authenticate users, and more.

Once you have initialized the Authentication service using `getAuth()`, you can use the methods provided by the Auth class to perform various tasks related to authentication, such as:

1. Creating a new user account using `createUserWithEmailAndPassword()`
2. Signing in an existing user using `signInWithEmailAndPassword()` or `signInWithPopup()`
3. Signing out the current user using `signOut()`
4. Checking if a user is signed in using `onAuthStateChanged()`


And many more.
