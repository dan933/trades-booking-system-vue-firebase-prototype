const Appointments = () => Promise.resolve({
<template>
  <section class="appointment-section" @scroll.passive="handleScroll">
    <h1 v-if="appointments.length <= 0">You currently have no appointments</h1>
    <table v-if="appointments.length > 0" class="table">
      <thead>
        <tr>
          <th><strong>Booking </strong></th>
          <th><strong>Start Time</strong></th>
          <th><strong>End Time </strong></th>
          <th><strong>Hours </strong></th>
          <th><strong>Price </strong></th>
          <th><strong>Status </strong></th>
          <th><strong>Booking </strong></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in appointments" :key="appointment.bookingId">
          <td>
            {{
              new Date(
                appointment.bookingDate.seconds * 1000
              ).toLocaleDateString()
            }}
          </td>
          <td>{{ appointment.startHour }}:00</td>
          <td>{{ appointment.endHour }}:00</td>
          <td>{{ appointment.services[0].hours }}</td>
          <td>
            ${{
              appointment.services[0].selection.rate *
              appointment.services[0].hours
            }}
          </td>
          <td>{{ appointment.status }}</td>
          <td>{{ appointment.bookingId }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getAppointments } from "../../services/api/bookingService.js";

export default {
  name: "Appointments",
  setup() {
    const appointments = ref([]);
    const route = useRoute();
    const isLoading = ref(false);
    const pagination = ref({
      lastVisible: null,
      size: 2,
      stopCalls: false,
    });

    const getUserAppointments = async () => {
      const orgId = route.params.id;

      let size = pagination.value.size;
      let lastVisible = pagination.value.lastVisible;
      let stopCalls = pagination.value.stopCalls;

      console.log(stopCalls);

      const response = await getAppointments(
        orgId,
        lastVisible,
        size,
        stopCalls
      );

      if (response) {
        pagination.value.lastVisible = response.lastVisible;
        pagination.value.stopCalls = response.stopAPICalls;

        isLoading.value = true;
        appointments.value = [...appointments.value, ...response.appointments];

        isLoading.value = false;

        pagination.value.lastVisable =
          pagination.value.lastVisable + pagination.value.size;
      }
    };

    const handleScroll = (event) => {
      // Check if user has scrolled to the bottom
      const isBottom =
        event.target.scrollHeight - event.target.scrollTop ===
        event.target.clientHeight;

      // If user has scrolled to bottom and we're not already loading, call API
      if (isBottom && !isLoading.value) {
        getUserAppointments();
      }
    };

    onMounted(getUserAppointments);

    return { appointments, isLoading, handleScroll };
  },
};
</script>

<style lang="scss">
.appointment-section {
  overflow: auto;
  margin-top: 10px;
  display: block;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
}

.table {
  width: 100%;
  max-width: 900px;
  border-collapse: collapse;

  thead {
    background-color: #f5f5f5;

    th {
      padding: 10px 15px;
      text-align: left;
      border-bottom: 2px solid #e0e0e0;
    }
  }

  tbody {
    tr {
      &:nth-child(even) {
        background-color: #f8f8f8;
      }
    }

    td {
      padding: 10px 15px;
      border-bottom: 1px solid #e0e0e0;
    }
  }
}

.card {
  width: 100%;
  height: 100%;
  margin-top: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-image {
  width: 100%;
  border-radius: 5px;
}

.carousel-container {
  display: flex;
  max-width: 90vw;
  width: 700px;
  min-height: 200px;
}
</style>

})
