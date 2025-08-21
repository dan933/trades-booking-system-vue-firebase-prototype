<template>
  <div class="landing-conatiner">
    <header>
      <div class="header-container">
        <div class="header-description">
          <h2 class="header-title">Customer Bookings made simple</h2>
          <p class="header-subtitle">Streamline customer scheduling and payments</p>
          <router-link to="/demo" class="live-demo">Live Demo</router-link>
        </div>
        <div class="header-image-container">
          <img class="header-image" src="../../../public/laptop.png" alt="laptop"></img>
        </div>
      </div>
    </header>
    <div class="content-container">
      <section class="content-row">
        <div class="icon">
          <span class="material-symbols-outlined">
            calendar_add_on
          </span>
        </div>
        <h3 class="section-header">
          Streamline Bookings
        </h3>
        <p class="section-description">
          Effortlessly manage your bookings with our intuitive calendar system, designed to keep you organized and
          efficient.
        </p>
      </section>
      <section class="content-row">
        <div class="icon">
          <span class="material-symbols-outlined">
            flex_wrap
          </span>
        </div>
        <h3 class="section-header">
          Customised Schedule
        </h3>
        <p class="section-description">
          Set your available hours and define gaps between bookings to suit your workflow. Our flexible scheduling
          options
          let you control when and how customers can book your services.
        </p>
      </section>
      <section class="content-row">
        <div class="icon">
          <span class="material-symbols-outlined">
            attach_money
          </span>
        </div>
        <h3 class="section-header">
          Payment Management
        </h3>
        <p class="section-description">
          Process payments seamlessly through our integrated platform. Customers select their preferred time slot,
          services,
          and duration. Need to cancel? Simply click to cancel appointments and automatically process customer refunds.
        </p>
      </section>
    </div>

  </div>

</template>

<script setup>

</script>
<style scoped>
.landing-conatiner {
  position: relative;
  width: 100%;
}

.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 70vh;
  min-height: fit-content;
  max-height: 700px;
  position: relative;


  .header-description {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 70%;
    z-index: 2;

    .header-title {
      font-size: 60px;
      margin: 0 0 15px;
      line-height: 1.3em;
      font-weight: 700;
      color: white;
      font-family: 'Josefin Sans', sans-serif;
      text-align: center;
    }

    .header-subtitle {
      font-size: 18px;
      margin: 0 0 30px;
      color: rgba(255, 255, 255, 0.8);
      font-family: 'Josefin Sans', sans-serif;
      text-align: center;
    }

    .live-demo {
      display: inline-block;
      padding: 18px 50px;
      background: rgb(169, 48, 228);
      border-radius: 5px;
      color: #ffffff;
      font-family: 'Josefin Sans', sans-serif;
      font-weight: 700;
      position: relative;
      z-index: 1;
      -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: none;
      text-decoration: none;
      text-align: center;

      &:hover {
        color: #ffffff;
        -webkit-box-shadow: 0 30px 80px -15px #A930E4;
        box-shadow: 0 20px 40px -15px #A930E4;
      }
    }

  }

  .header-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    .header-image {
      width: auto;
      width: 400px;
      max-width: 100%;
      height: auto;
      position: relative;
      z-index: 1;
    }
  }


}


@media screen and (max-width:600px) {

  .header-container {
    .header-description {
      .header-title {
        font-size: 20px;
      }

    }
  }
}

.content-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-self: center;
  gap: 40px;
  max-width: 600px;
  width: 100%;

  .content-row {
    padding: 20px;
    /* margin-top: 200px; */
  }
}
</style>
