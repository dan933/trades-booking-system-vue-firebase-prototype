<template>
  <v-container class="border">
    <div class="payment-summary-container">
      <h1>Payment</h1>
      <p><strong>Amount Payable:</strong> ${{ amountPayable }}</p>
      <p><strong>Number of Hours:</strong> {{ hoursBooked }}</p>
    </div>
    <v-form @submit.prevent="submitForm" v-model="validForm">
      <v-text-field v-model="cardName" label="Cardholder Name" />
      <v-text-field
        v-model="cardNumber"
        label="Card Number"
        :rules="cardNumberRules"
      />
      <div class="expiry-container">
        <v-text-field
          v-model="expiryDate"
          label="Expiration date (MM/YYYY)"
          :rules="expirationDateRules"
        />
        <v-text-field v-model="cvv" label="CVV" :rules="cvvRules" />
      </div>

      <v-btn type="submit" color="primary">Pay Now</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "Payment",
  props: ["selectedDateTimeSlot", "selectedServices", "customerInformation"],
  computed: {
    amountPayable() {
      return this.selectedServices.reduce((acc, curr) => {
        return (acc += curr.selection.rate * curr.hours);
      }, 0);
    },
    hoursBooked() {
      return this.selectedServices.reduce((acc, curr) => {
        return (acc += curr.hours);
      }, 0);
    },
  },
  data() {
    return {
      validForm: false,
      cardNumber: "4545454545454545",
      cardName: "Test Card",
      expiryDate: "01/2028",
      cvv: "123",
      cardNumberRules: [
        (v) => !!v || "Card number is required",
        (v) => /^\d{15,16}$/.test(v) || "Card number must be 15 or 16 digits",
      ],
      expirationDateRules: [
        (v) => !!v || "Expiration date is required",
        (v) => {
          const match = /^(0[1-9]|1[0-2])\/\d{4}$/.test(v);
          return match || "Expiration date must be in MM/YYYY format";
        },
        (v) => {
          if (!v) {
            return true;
          }
          const today = new Date();
          const expirationDate = new Date(`01/${v}`);
          expirationDate.setMonth(expirationDate.getMonth() + 1);
          expirationDate.setDate(expirationDate.getDate() - 1);
          return expirationDate >= today || "Card has expired";
        },
      ],
      cvvRules: [
        (v) => !!v || "CVV is required",
        (v) => /^\d{3,4}$/.test(v) || "CVV must be 3 or 4 digits",
      ],
    };
  },
  methods: {
    submitForm() {
      // if (this.validForm) {
      const cardDetails = {
        cardNumber: this.cardNumber,
        cardName: this.cardName,
        expiryDate: this.expiryDate,
        cvv: this.cvv,
      };

      //todo add stripe token here either get existing customer token or create a new one
      //check appointment is still available
      //stripe stuff here
      //payment success then
      //book appointment

      this.$emit("storePaymentDetails", cardDetails);

      return cardDetails;
      // }
    },
    paymentError() {
      //error handling
    },
    paymentSuccess() {
      //book appointment
    },
  },
};
</script>
<style lang="scss" scoped>
.payment-summary-container {
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  margin-bottom: 6px;
}
.expiry-container {
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
