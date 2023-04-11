<template>
  <v-card flat rounded="0" class="book-now-card">
    <h3>Add Services</h3>
    <div>
      <p>
        <strong>Date:</strong>
        {{
          `${selectedDateTimeSlot?.date
            .getDate()
            .toString()
            .padStart(2, "0")}/${selectedDateTimeSlot?.date
            .getMonth()
            .toString()
            .padStart(2, "0")}/${selectedDateTimeSlot?.date.getFullYear()}`
        }}
      </p>
      <p>
        <strong>Time:</strong>
        {{ `${selectedDateTimeSlot.timeslot.time}` }}
      </p>
      <p>
        <strong>Remaining Hours Available:</strong>
        {{ remainingHoursAvailable }}
      </p>
    </div>
    <div>
      <v-form class="d-flex flex-column" v-model="serviceForm">
        <!-- add v-for that adds input field -->
        <div v-for="service in selectedServices" class="mb-3">
          <div class="add-service-container">
            <v-autocomplete
              v-model="service.selection"
              style="width: 200px; height: 50px"
              label="Service"
              :items="services"
              :item-title="
                (item) => {
                  return item?.name ? `${item.name}` : '';
                }
              "
              :item-value="(item) => item"
              :rules="[(v) => !!v || 'service required']"
            ></v-autocomplete>
            <v-text-field
              v-model="service.hours"
              style="width: 130px"
              type="number"
              label="Hours"
              hide-details="auto"
              :rules="[
                (v) =>
                  remainingHoursAvailable >= 0 || 'Hours Available Exceeded',
                (v) => !!v || 'Hours Required',
              ]"
            ></v-text-field>
          </div>
          <p class="mt-6">
            Price: ${{
              service?.selection?.rate && +service?.hours
                ? service.selection.rate * +service?.hours
                : 0
            }}
          </p>
        </div>
        <v-btn class="mt-5" @click="addInput">Add Service</v-btn>
        <v-btn class="mt-5" type="submit">Review</v-btn>
      </v-form>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "selectServices",
  data: () => ({
    serviceForm: false,
    services: [
      { name: "Cleaning", rate: 25 },
      { name: "Roofing", rate: 50 },
      { name: "Gardening", rate: 33 },
    ],
    selectedServices: [],
  }),
  props: ["selectedDateTimeSlot"],
  methods: {
    addInput() {
      this.selectedServices.push({});
    },
  },
  mounted() {},
  //todo add watch on this.selectedDateTimeSlot.timeslot.availableHours
  computed: {
    remainingHoursAvailable() {
      let remainingHoursAvailable =
        this.selectedDateTimeSlot.timeslot.availableHours;

      let totalHoursSelected = this.selectedServices.reduce((prev, curr) => {
        if (+curr.hours) {
          return prev + +curr.hours;
        } else {
          return prev;
        }
      }, 0);

      remainingHoursAvailable = remainingHoursAvailable - totalHoursSelected;

      return remainingHoursAvailable;
    },
  },
};
</script>

<style lang="scss">
.add-service-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  column-gap: 10px;
  row-gap: 30px;
  margin-bottom: 10px;
}
</style>
