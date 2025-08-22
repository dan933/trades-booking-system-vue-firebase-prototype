const Auth = () => Promise.resolve({
<template>
  <section class="container-center">
    <div elevation="5" class="auth-section">
      <EmailRegister v-if="selectedForm === 'Register'" @switchForm="switchForm" @registerEmailUser="registerEmailUser">

        <template #providers>
          <div class="provider-container">
            <button @click="() => signIn({ providerName: 'Google' })" class="provider-button text-subtitle-2">
              <img class="google-logo" src="../../../../public/icons/google-logo.png" alt="" srcset="" />
              Continue With Google
            </button>
            <button @click="() => signIn({ providerName: 'Facebook' })" class="provider-button text-subtitle-2">
              <span icon="mdi:mdi-facebook" size="50px" color="blue"></span>
              Continue With Facebook
            </button>
            <button @click="() => signIn({ providerName: 'Guest' })" class="provider-button text-subtitle-2">
              <span icon="mdi:mdi-account" size="50px" color="black"></span>
              Continue as Guest
            </button>
          </div>
        </template>

      </EmailRegister>

      <EmailLogin v-if="selectedForm === 'Login'" :signInResponse="signInResponse" @switchForm="switchForm"
        @signIn="signIn">
        <template #providers>
          <div class="provider-container">
            <button @click="() => signIn({ providerName: 'Google' })" class="provider-button text-subtitle-2">
              <img class="google-logo" src="../../../../public/icons/google-logo.png" alt="" srcset="" />
              Continue With Google
            </button>
            <button @click="() => signIn({ providerName: 'Facebook' })" class="provider-button text-subtitle-2">
              <span icon="mdi:mdi-facebook" size="50px" color="blue"></span>
              Continue With Facebook
            </button>
            <button @click="() => signIn({ providerName: 'Guest' })" class="provider-button text-subtitle-2">
              <span icon="mdi:mdi-account" size="50px" color="black"></span>
              Continue as Guest
            </button>
          </div>
        </template>
      </EmailLogin>


    </div>
    <LinkCredentialsDialog ref="linkCredentialsDialogRef" @resetSignInResponse="signInResponse = null">
    </LinkCredentialsDialog>
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
        // console.log(newVal);
        const orgId = this.$route.params.id;
        this.$router.push(`/org/${orgId}/book`);
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
      //get the organisation Id
      const orgId = this.$route.params.id;

      // console.log("org", orgId);

      //stops redirect to booking page
      //redirect too book happens if the user is already signed in on initial load
      this.signInResponse = await authService.signIn(signInDetails, orgId);

      //if the user is a Guest
      if (this.signInResponse?.IsGuest) {
        //update store of IsGuest
        this.$store.commit("setIsGuest", true);

        console.log("this.$store.state.IsGuest", this.$store.state.IsGuest);

        //redirect to booking page
        this.$router.push(`/org/${orgId}/book`);
      }

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

<style scoped>
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
  padding: 15px;
  background-color: lightgrey;
  height: auto;
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
  padding: 15px;
  width: 332px;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
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
