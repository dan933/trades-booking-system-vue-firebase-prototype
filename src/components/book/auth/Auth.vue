const Auth = () => Promise.resolve({
<template>
  <div class="auth-section">
    <v-card elevation="5">
      <h1 class="card-title">Login in to book</h1>
      <div class="card-container">
        <v-btn @click="() => signIn('Google')" class="google-button">
          <img
            class="google-logo"
            src="../../../../public/icons/google-logo.png"
            alt=""
            srcset=""
          />
          <span>Sign In With Google</span>
        </v-btn>
        <v-btn @click="() => signIn('Facebook')" class="google-button">
          <img
            class="facebook-logo"
            src="../../../../public/icons/facebook-login.png"
            alt=""
            srcset=""
          />
        </v-btn>
      </div>
    </v-card>
  </div>
  <LinkCredentialsDialog ref="linkCredentialsDialogRef"></LinkCredentialsDialog>
</template>

<script>
//todo google/facebook component
//todo regular signing
import router from "../../../router/router.js";
import { authService } from "../../../services/auth/auth-services.js";
import LinkCredentialsDialog from "./LinkCredentialsDialog.vue";

export default {
  name: "Auth",
  components: { LinkCredentialsDialog },
  data() {
    return {
      provider: null,
    };
  },
  computed: {},
  mounted() {},
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
.google-button {
  margin: 10px;
  height: 60px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.google-logo {
  margin-right: 10px;
  height: 40px;
  max-height: 10vh;
}

.facebook-logo {
  height: 50px;
}

.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  width: 90%;
  height: 100%;
}

.card-title {
  text-align: center;
  margin: 10px;
}

.card-container {
  overflow: auto;
  height: 500px;
  width: 500px;
  max-height: 50vh;
  max-width: 90vw;
  margin-top: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

})
