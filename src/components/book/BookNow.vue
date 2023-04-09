<template>
  <v-card flat class="book-now-container">
    <v-window
      direction="vertical"
      v-model="onboarding"
      class="window-container"
    >
      <v-window-item
        v-for="n in length"
        :key="`card-${n}`"
        :value="n"
        class="window-container"
      >
        <v-card flat rounded="0" class="book-now-card">
          <h3>Pick a date</h3>
          <!-- <v-calendar
            v-model="selectedDate"
            title-position="left"
            :disabled-dates="disabledDates"
            @dayclick="onCalendarClick"
          >
          </v-calendar> -->
          <VDatePicker
            v-model="selectedDate"
            :disabled-dates="disabledDates"
            @dayclick="onCalendarClick"
          >
            <template #default="{ togglePopover }">
              <div class="date-input">
                <v-btn
                  class="text-none text-subtitle-1"
                  color="primary"
                  variant="elevated"
                  @click="togglePopover"
                >
                  Choose Date
                </v-btn>
              </div>
            </template>
          </VDatePicker>
          {{ availabilityMessage }}
          <v-container v-if="IsAvailableDate" class="timeslot-container">
            <h3>Pick A Timeslot</h3>
            <v-autocomplete
              v-model="selectedTimeSlot"
              :items="availableTimeSlots"
              label="Select a time slot"
              style="width: 200px"
            ></v-autocomplete>
            <v-btn
              v-if="selectedTimeSlot"
              class="text-none text-subtitle-1"
              color="primary"
              variant="elevated"
            >
              Select Services
            </v-btn>
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-evenly">
      <v-item-group v-model="onboarding" class="text-center" mandatory>
        <v-item
          v-for="n in length"
          :key="`btn-${n}`"
          v-slot="{ isSelected, toggle }"
          :value="n"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-record"
            @click="toggle"
          ></v-btn>
        </v-item>
      </v-item-group>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "BookNow",
  data: () => ({
    selectedDate: null,
    length: 3,
    onboarding: 0,
    availabilityMessage: "",
    IsAvailableDate: false,
    selectedTimeSlot: "",
    availableTimeSlots: ["15:00", "14:00", "13:00"],
  }),
  methods: {
    getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    onCalendarClick(context) {
      this.selectedTimeSlot = "";
      const clickedDate = new Date(context.date);
      const day = clickedDate.getDate();
      const suffix = this.getOrdinalSuffix(day);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[clickedDate.getMonth()];
      const year = clickedDate.getFullYear();

      this.IsAvailableDate = !context.isDisabled;
      if (context.isDisabled) {
        this.availabilityMessage = `No bookings available for ${day}${suffix} ${month} ${year}`;
      } else {
        this.availabilityMessage = `${day}${suffix} ${month} ${year}`;
      }
    },
  },
  mounted() {},
  computed: {
    disabledDates() {
      // create a new Date object
      let today = new Date();

      // subtract 1 day from today's date
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let disabledDates = [{ start: null, end: null }];
      disabledDates[0].end = yesterday;

      disabledDates[1] = {
        start: new Date("2023-04-23"),
        end: new Date("2023-04-23"),
      };

      return disabledDates;
    },
  },
};
</script>

<style lang="scss">
.date-input {
  border-radius: 5px;
  padding: 5px;
}
.book-now-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  max-height: 700px;
  margin: 10px;
  margin-top: 20px;
  padding: 5px;
}
.book-now-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 15px;
  height: 90%;
  width: 100%;
  padding: 10px;
  overflow: auto;
}

.timeslot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 15px;
}
.window-container {
  width: 100%;
  height: 100%;
}
.vc-day-content.vc-disabled {
  text-decoration: line-through;
  color: rgba(211, 211, 211, 0.721);
}
</style>
