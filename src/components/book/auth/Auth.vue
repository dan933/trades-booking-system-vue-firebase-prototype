const Auth = () => Promise.resolve({
<template>
  <section class="container-center">
    <v-card elevation="5" class="auth-section">
      <h1 class="card-title">{{ title }}</h1>

      <EmailRegister
        v-if="!IsLogin"
        @switchForm="switchForm"
        @registerEmailUser="registerEmailUser"
      ></EmailRegister>

      <EmailLogin @switchForm="switchForm" v-if="IsLogin"></EmailLogin>

      <v-container class="provider-container">
        <v-btn @click="() => signIn('Google')" class="provider-button">
          <img
            class="google-logo"
            src="../../../../public/icons/google-logo.png"
            alt=""
            srcset=""
          />
          <span>Continue With Google</span>
        </v-btn>
        <v-btn @click="() => signIn('Facebook')" class="provider-button">
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
import EmailRegister from "./emailRegister.vue";
import EmailLogin from "./emailLogin.vue";

export default {
  name: "Auth",
  components: { LinkCredentialsDialog, EmailRegister, EmailLogin },
  data() {
    return {
      IsLogin: true,
      provider: null,
    };
  },
  computed: {
    title() {
      return this.IsLogin ? "Login" : "Register";
    },
  },
  mounted() {},
  methods: {
    switchForm() {
      this.IsLogin = !this.IsLogin;
    },
    async signIn(providerName) {
      const signInResponse = await authService.signIn(providerName);

      console.log(signInResponse);

      //if response is successful reroute to booking page
      if (signInResponse?.IsLoginSuccess) {
        this.$router.push("/book");
      }

      //if account exists with different credentials
      if (signInResponse?.IsUserDifferentCredentials) {
        //open dialog box
        this.$refs.linkCredentialsDialogRef.open(signInResponse);
      }
    },
    async registerEmailUser(registerUser) {
      const response = await authService.registerUser(registerUser);
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
