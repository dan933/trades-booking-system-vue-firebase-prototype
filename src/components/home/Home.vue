<template>
    <v-parallax
    src="https://images.unsplash.com/photo-1481277542470-605612bd2d61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1406&q=80">
        <div
        class="parallax-container">
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
                        <div class="d-flex fill-height justify-center align-center">
                            <img
                                class="carousel-image"
                                :src="slide" alt=""
                            >
                        </div>
                    </v-carousel-item>
                </v-carousel>
            </div>
            <v-card
            elevation="3"
            class="card"
            >
                <v-card-text>
                    <div class="pa-3 text-body text-center">
                        As your home ages, it may no longer meet your needs or style preferences. That's where we come in. Our home renovation services can help you create the home of your dreams.

Whether you want to update your kitchen, add a home office, or renovate your entire home, our team of experienced professionals can help. We'll work with you from start to finish, ensuring that your vision becomes a reality.

We understand that home renovations can be stressful, which is why we make the process as smooth as possible. Our team will handle all of the details, from obtaining necessary permits to ensuring that the work meets all safety standards.

Don't settle for a home that doesn't meet your needs. Contact us today to learn more about our home renovation services and start transforming your space into the home of your dreams.
                    </div>  
                </v-card-text>
            </v-card>
        </div>
</v-parallax>

</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            carouselImages: [
                "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
                "https://images.unsplash.com/photo-1586280268958-9483002d016a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
            ]
        }
    }
}

</script>

<style lang="scss" scoped>

.carousel-image{
    border-radius: 5px;
}

.carousel-container{
    display: flex;
    width: 90vw;
    max-width: 600px;
    
}
.card{
    margin: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 600px;
    width: 90%;
}

.carousel-image{
    width: 100%;
    border-radius: 5px;
}

.parallax-container{
    display: flex;
    min-width:100vw;
    overflow: auto;
    min-height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
}
</style>