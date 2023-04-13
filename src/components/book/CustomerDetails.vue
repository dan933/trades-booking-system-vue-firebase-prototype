<template>
  <v-card flat rounded="0" class="service-card">
    <h3>Your Details</h3>
    <v-container>
      <v-form v-model="valid">
        <v-container class="name-container">
          <v-text-field
            style="width: 150px"
            v-model="firstName"
            label="First name"
            required
          ></v-text-field>
          <v-text-field
            style="width: 150px"
            v-model="lastName"
            label="Last name"
            required
          ></v-text-field>
        </v-container>
        <v-text-field
          v-model="phone"
          label="Phone number"
          type="tel"
          required
        ></v-text-field>
        <v-textarea v-model="address" label="Address"></v-textarea>
        <v-btn color="primary" :disabled="!valid" @click="submitForm"
          >Next</v-btn
        >
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "CustomerDetails",
  data() {
    return {
      valid: false,
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    };
  },
  props: ["selectedDateTimeSlot"],
  methods: {
    submitForm() {
      // Perform any actions you want to do when the form is submitted
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.name-container {
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
  padding: 0px;
  margin: 0px;
}
.service-card {
  overflow: auto;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.service-form-container {
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
  overflow: auto;
}
.border {
  border: black solid 2px !important;
  border-radius: 5px;
}
.service-item-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  column-gap: 10px;
  row-gap: 30px;
  margin-bottom: 10px;
}
</style>
