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
  provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  try {
    const result = await fbAuth.signInWithPopup(provider);
    // const result = await fbAuth.signInWithRedirect(provider);
    console.log(result);
    var token = result.credential.accessToken;
  } catch (error) {
    console.log(error);
  }
};

const createUserEP = async function(userEmail, password) {
  try {
    const result = await fbAuth.createUserWithEmailAndPassword(
      userEmail,
      password
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const getPhoneNumberFromUserInput = function() {
  const mobNumberInput = document.getElementById("mobNumber");
  return mobNumberInput.value;
};

const getCodeFromUserInput = function() {
  const codeInput = document.getElementById("code");
  return codeInput.value;
};

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  "recaptcha-container",
  {
    size: "normal",
    callback: () => phoneLoginInternal(),
    "expired-callback": () => {
      console.log("CALLBACK EXPIRED");
    }
  }
);

const mobileLogin = async function() {
  await recaptchaVerifier.render();
};

const phoneLoginInternal = async function() {
  try {
    const phoneNumber = getPhoneNumberFromUserInput();
    // var recaptchaResponse = grecaptcha.getResponse(window.recaptchaWidgetId);
    // console.log("RCR: ", recaptchaResponse);
    window.captchaResult = await fbAuth.signInWithPhoneNumber(
      phoneNumber,
      window.recaptchaVerifier
    );
  } catch (err) {
    console.log(err);
  }
};

const putCode = async function() {
  // qwerty
  try {
    const code = getCodeFromUserInput();
    const result = await window.captchaResult.confirm(code);
    console.log("FINAL", result);
  } catch (err) {
    console.log(err);
  }
};
