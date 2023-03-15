<template>
    <div class="text-h3 mt-3">About Us</div>
    <br>
    <div class="carousel-container">
        <v-carousel
            cycle
            height="200"
            hide-delimiter-background
            show-arrows="hover"
            color="#D3D3D3"
        >
            <v-carousel-item
            v-for="(slide, i) in carouselImages"
            :key="i"
            >
            <v-sheet
                height="100%"
            >
                <div class="d-flex fill-height justify-center align-center">
                    <img
                        class="carousel-image"
                        :src="slide" alt=""
                    >
                </div>
            </v-sheet>
            </v-carousel-item>
        </v-carousel>
    </div>
    <br>
    <v-card
    elevation="3"
    class="ma-3 pa-3 d-flex flex-column justify-center align-center">
        <v-card-text>
            <div class="pa-3 text-body text-center">
                We are a team of experienced professionals dedicated to helping you create the home of your dreams. Our home renovation services are designed to meet your needs and style preferences, no matter how unique they may be.
                We understand that home renovations can be stressful, which is why we make the process as smooth as possible. From obtaining necessary permits to ensuring that the work meets all safety standards, we handle all of the details so that you don't have to.
                Our team is committed to providing high-quality workmanship and exceptional customer service. We'll work with you from start to finish to ensure that your vision becomes a reality.
                Contact us today to learn more about our home renovation services and start transforming your space into the home of your dreams.
            </div>  
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "About",
    data() {
        return {
            carouselImages: [
                "https://images.unsplash.com/photo-1622480198867-016a77991bd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
                "https://images.unsplash.com/photo-1526392587392-d1627b6c134a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
            ]
        }
    }
}

</script>

<style lang="scss" scoped>

.carousel-image{
    width: 100%;
    border-radius: 5px;
}

.carousel-container{
    display: flex;
    width: 90vw;
    max-width: 600px;
    
}


</style>