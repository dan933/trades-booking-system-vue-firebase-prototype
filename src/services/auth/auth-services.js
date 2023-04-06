import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

var authService = {
  registerUser: async (registerUserObject) => {
    try {
      console.log("registerUserObject", registerUserObject);
      const email = registerUserObject.email;
      const password = registerUserObject.password;

      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      return response;
    } catch (error) {
      return { errorCode: error.code, errorMessage: error.message };
    }
  },
  signIn: async (providerName) => {
    //Creates auth instance
    const auth = getAuth();

    try {
      //get provider
      let provider =
        providerName === "Google"
          ? new GoogleAuthProvider()
          : providerName === "Facebook"
          ? new FacebookAuthProvider()
          : null;

      const result = await signInWithPopup(auth, provider);
      return {
        result: result,
        IsLoginSuccess: true,
      };

      //if true return result if error return auth/account-exists-with-different-credential details
    } catch (error) {
      if (error.code == "auth/account-exists-with-different-credential") {
        let email = error.customData.email;
        let pendingCredential = error.credential;

        let userSignInMethods = await fetchSignInMethodsForEmail(auth, email);
        let firstSignInMethod =
          userSignInMethods?.length > 0 ? userSignInMethods[0] : "";

        return {
          IsUserDifferentCredentials: true,
          firstSignInMethod: firstSignInMethod,
          pendingCredential: pendingCredential,
          pendingProvider: error?.customData?._tokenResponse?.providerId,
          userSignInMethods: userSignInMethods,
          tokenResponse: error?.customData?._tokenResponse,
          error: error,
        };
      } else {
        return error;
      }
    }
  },
  getProviderForProviderId: function (providerId) {
    switch (providerId) {
      case GoogleAuthProvider.PROVIDER_ID:
        return new GoogleAuthProvider();
      case FacebookAuthProvider.PROVIDER_ID:
        return new FacebookAuthProvider();
      default:
        return null;
    }
  },
  signInWithExistingAccount: async function (signInResponse, userCredentials) {
    if (signInResponse?.firstSignInMethod === "password") {
      signInWithEmailAndPassword(
        userCredentials.email,
        userCredentials.password
      )
        .then((result) => {
          result.user.linkAccounts(userCredentials?.tokenResponse);
        })
        .then(() => {
          this.$router.push("/book");
        })
        .catch(() => {
          //error message here
        });

      return;
    }

    let provider = this.getProviderForProviderId(
      signInResponse?.firstSignInMethod
    );

    const auth = getAuth();

    const response = await signInWithPopup(auth, provider);

    let IsSameToExistingEmailSignIn =
      signInResponse?.tokenResponse?.email === response?.user?.email;

    if (response?.user?.uid) {
      return {
        IsSameToExistingEmailSignIn: IsSameToExistingEmailSignIn,
        success: true,
      };
    } else {
      return false;
    }
  },
  linkAccounts: async function (signInResponse) {
    const providerId = signInResponse?.pendingProvider;
    const provider = this.getProviderForProviderId(providerId);
    const auth = getAuth();
    await linkWithPopup(auth.currentUser, provider);
  },
};

//todo wait for popup link to finish then say you are signed
//todo sign in with email and password and be able to link to existing accounts

export { authService };
