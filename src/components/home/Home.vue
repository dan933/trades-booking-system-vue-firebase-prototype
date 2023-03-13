<template>
    <div class="text-h3">
        company logo here
    </div>
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
                todo replace content with home description
            </div>
            <div class="pa-3 text-body text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, sit, temporibus voluptate recusandae culpa maiores fugiat perferendis ipsam ex eaque facilis modi sint voluptatibus vero, impedit odio exercitationem harum perspiciatis.
            </div>  
        </v-card-text>

        <ul>
            <li>Quality</li>
            <li>Experience</li>
            <li>Ect</li>
        </ul>
    </v-card>

</template>

<script>
export default {
    name: "Home",
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