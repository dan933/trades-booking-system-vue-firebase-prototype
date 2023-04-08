const Auth = () => Promise.resolve({
<template>
  <section class="container-center">
    <v-card elevation="5" class="auth-section">
      <EmailRegister
        v-if="selectedForm === 'Register'"
        @switchForm="switchForm"
        @registerEmailUser="registerEmailUser"
      ></EmailRegister>

      <EmailLogin
        v-if="selectedForm === 'Login'"
        :signInResponse="signInResponse"
        @switchForm="switchForm"
        @signIn="signIn"
      ></EmailLogin>

      <v-container class="provider-container">
        <v-btn
          @click="() => signIn({ providerName: 'Google' })"
          class="provider-button"
        >
          <img
            class="google-logo"
            src="../../../../public/icons/google-logo.png"
            alt=""
            srcset=""
          />
          <span>Continue With Google</span>
        </v-btn>
        <v-btn
          @click="() => signIn({ providerName: 'Facebook' })"
          class="provider-button"
        >
          <v-icon icon="mdi:mdi-facebook" size="50px" color="blue"></v-icon>
          <span> Continue With Facebook </span>
        </v-btn>
      </v-container>
    </v-card>
    <LinkCredentialsDialog
      ref="linkCredentialsDialogRef"
    ></LinkCredentialsDialog>
  </section>
</template>

<script>
import { authService } from "../../../services/auth/auth-services.js";
import LinkCredentialsDialog from "./LinkCredentialsDialog.vue";
import EmailRegister from "./EmailRegister.vue";
import EmailLogin from "./EmailLogin.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "Auth",
  components: { LinkCredentialsDialog, EmailRegister, EmailLogin },
  data() {
    return {
      selectedForm: "Login",
      provider: null,
      signInResponse: null,
      currentUser: null,
    };
  },
  computed: {},
  watch: {
    currentUser(newVal) {
      if (newVal && !this.signInResponse?.IsUserDifferentCredentials) {
        console.log(newVal);
        this.$router.push("/book");
      }
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  },
  methods: {
    //checks to see if user is trying to link accounts
    switchForm(formName) {
      this.selectedForm = formName;
    },
    async signIn(signInDetails) {
      //stops redirect to booking page
      //redirect too book happens if the user is already signed in on initial load
      this.signInResponse = await authService.signIn(signInDetails);

      //if account exists with different credentials
      if (this.signInResponse?.IsUserDifferentCredentials) {
        //open dialog box
        this.$refs.linkCredentialsDialogRef.open(this.signInResponse);
      }
    },
    async registerEmailUser(registerUser) {
      //stops redirect to booking page
      //redirect too book happens if the user is already signed in on initial load
      this.signInResponse = await authService.registerUser(registerUser);

      if (this.signInResponse?.IsUserDifferentCredentials) {
        //open dialog box
        this.$refs.linkCredentialsDialogRef.open(this.signInResponse);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.auth-section {
  display: block;
  overflow: auto;
  width: 466px;
}

.provider-container {
  padding: 10px;
  background-color: lightgrey;
  height: 200px;
  width: 90%;
  min-width: 200px;
  display: flex;
  row-gap: 30px;
  border-radius: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.provider-button {
  font-size: 14px;
  padding: 30px;
  width: 332px;
  display: flex;
  flex-direction: row;
}
.google-logo {
  margin-right: 10px;
  height: 40px;
  max-height: 10vh;
}

.card-title {
  margin-top: 10px;
  text-align: center;
}

@media screen and (max-width: 400px) {
  span {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

})
