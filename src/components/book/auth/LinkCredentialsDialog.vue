<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="auto">
      <!-- ------ provider sign in -------- -->
      <v-card
        v-if="
          signInResponse?.firstSignInMethod &&
          signInResponse?.firstSignInMethod !== 'password' &&
          !IsSignedIn
        "
      >
        <v-card-text>
          You already have an account with
          {{ signedInMessage().provider }} please sign in.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="signInWithExistingAccount"
            >Sign in with {{ signedInMessage().button }}</v-btn
          >
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
      <!-- ------ Email sign in -------- -->
      <v-card v-if="signInResponse?.firstSignInMethod === 'password'">
        <v-card-text>
          You are signed in with {{ signedInMessage().provider }}
        </v-card-text>
        <v-card-actions class="flex-column">
          <v-btn color="primary" block @click="linkAccounts"> Sign In </v-btn>
          <v-btn color="primary" block @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-if="IsSignedIn && signInResponse?.firstSignInMethod !== 'password'"
      >
        <!-- ------ Link Accounts -------- -->
        <v-card-text>
          You are signed in with {{ signedInMessage().provider }}
        </v-card-text>
        <v-card-actions class="flex-column">
          <v-btn color="primary" block @click="linkAccounts">
            Link {{ linkMessage() }} Account
          </v-btn>
          <v-btn color="primary" block @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { authService } from "../../../services/auth/auth-services.js";
export default {
  name: "LinkCredentialsDialog",
  data() {
    return {
      dialog: false,
      signInResponse: null,
      IsSignedIn: false,
    };
  },
  methods: {
    open(signInResponse) {
      this.dialog = true;
      this.signInResponse = signInResponse;
    },
    closeDialog() {
      this.dialog = false;
      this.$router.push("/book");
    },
    signedInMessage() {
      let message = {};
      switch (this.signInResponse?.firstSignInMethod) {
        case "google.com":
          message.provider = "Google";
          message.button = "Google";
          break;
        case "facebook.com":
          message.provider = "Facebook";
          message.button = "Facebook";
          break;
        case "password":
          message.provider = "us";
          message.button = "Your Email";
        default:
          break;
      }
      return message;
    },
    linkMessage() {
      let reg = /^.*(?=\.com)/g;
      let message = this.signInResponse?.pendingProvider?.match(reg)[0];
      return message;
    },
    async signInWithExistingAccount() {
      let response = await authService.signInWithExistingAccount(
        this.signInResponse
      );

      if (response?.IsSameToExistingEmailSignIn) {
        this.IsSignedIn = true;
      } else {
        this.dialog = false;
        this.$router.push("/book");
      }
    },
    linkAccounts() {
      authService.linkAccounts(this.signInResponse);

      this.$router.push("/book");
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>

<!-- {
  "IsUserDifferentCredentials": true,
  "firstSignInMethod": "google.com",
  "userSignInMethods": [
      "google.com"
  ],
  "tokenResponse": {
      "federatedId": "http://facebook.com/10227347098096392",
      "providerId": "facebook.com",
      "email": "dnadistrictservices@gmail.com",
      "emailVerified": false,
      "firstName": "Daniel",
      "fullName": "Daniel Albert",
      "lastName": "Albert",
      "photoUrl": "https://graph.facebook.com/10227347098096392/picture",
      "localId": "In8PUoZfosSOzt6aTfIPWGgbwUc2",
      "displayName": "Daniel Albert",
      "context": "",
      "verifiedProvider": [
          "google.com"
      ],
      "needConfirmation": true,
      "oauthAccessToken": "EAASEOfW0nSkBACX9HZAFOKmW6PDRjA0JmrxNckPMVjQT05aMUdZAatxMlKPCIYdpLKkPMGNQ0k3jNXs7fRp3RdKfNx2n7HlYrbcV8BUdMcKMJ17NuZAxQ8PmARwgbfrzzbxqZCapf1ZArQUV6nqPHLspFkWrZC5v2wEiz7HlfIqjTCZBPxa9KV3lJRFNfqYP5RVIlYvdRsN9Rn7FUJqWcv9vmjTi9mhy6ZAG0iwg3mzeGwZDZD",
      "oauthExpireIn": 5183999,
      "rawUserInfo": "{\"name\":\"Daniel Albert\",\"last_name\":\"Albert\",\"granted_scopes\":[\"email\",\"public_profile\"],\"id\":\"10227347098096392\",\"first_name\":\"Daniel\",\"email\":\"dnadistrictservices@gmail.com\",\"picture\":{\"data\":{\"is_silhouette\":false,\"width\":100,\"url\":\"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10227347098096392&height=100&width=100&ext=1682669816&hash=AeRGnYNzWrneoYe0EeU\",\"height\":100}}}",
      "kind": "identitytoolkit#VerifyAssertionResponse"
  }
} -->
