<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="cardName" label="Cardholder Name" />
      <v-text-field
        v-model="cardNumber"
        label="Card Number"
        :rules="[cardNumberValidation]"
      />

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="expiryMonth"
            label="Expiry Month"
            :rules="[expiryMonthValidation]"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="expiryYear"
            label="Expiry Year"
            :rules="[expiryYearValidation]"
          />
        </v-col>
      </v-row>
      <v-text-field v-model="cvv" label="CVV" :rules="[cvvValidation]" />
      <v-btn type="submit" color="primary">Pay Now</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "Payment",
  data() {
    return {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardNumberValidation: [
        (v) => creditCard.isValidCardNumber(v) || "Invalid card number",
      ],
      expiryMonthValidation: [
        (v) => creditCard.expirationMonth(v) || "Invalid expiry month",
      ],
      expiryYearValidation: [
        (v) => creditCard.expirationYear(v) || "Invalid expiry year",
      ],
      cvvValidation: [(v) => creditCard.isValidCardCVC(v) || "Invalid CVV"],
    };
  },
  methods: {
    submitForm() {
      if (this.$refs.form.validate()) {
        // Send payment details to server
        // Handle response
      }
    },
  },
};
</script>
