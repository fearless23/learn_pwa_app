const fbAuth = firebase.auth();

const login = async function(userEmail, password) {
  try {
    const { user } = await fbAuth.signInWithEmailAndPassword(
      userEmail,
      password
    );
    const {
      ma,
      refreshToken,
      uid,
      displayName,
      photoUrl,
      email,
      emailVerified,
      phoneNumber,
      metadata: { lastSignInTime, creationTime }
    } = user;

    const finalData = {
      ma,
      refreshToken,
      uid,
      displayName,
      photoUrl,
      email,
      emailVerified,
      phoneNumber,
      lastSignInTime,
      creationTime
    };
    const el = document.getElementById("login");
    const keys = Object.keys(finalData);
    let data = "";
    for (let i = 0; i < keys.length; ++i) {
      data += `<p style="overflow:hidden; height: 30px">${keys[i]}: ${
        finalData[keys[i]]
      }</pre>`;
    }
    el.innerHTML += data;
  } catch (error) {
    console.log(error);
  }
};

const googleLogin = async function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  try {
    const result = await fbAuth.signInWithPopup(provider);
    // const result = await fbAuth.signInWithRedirect(provider);
    console.log(result)
    var token = result.credential.accessToken;
  } catch (error) {
    console.log(error);
  }
};

const createUserEP = async function(userEmail, password) {
  try {
    const result = await createUserWithEmailAndPassword(email, password);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};