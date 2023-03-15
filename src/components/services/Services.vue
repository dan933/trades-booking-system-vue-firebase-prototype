<template>
    <div class="text-h3 mt-3">
        Services
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, sit, temporibus voluptate recusandae culpa maiores fugiat perferendis ipsam ex eaque facilis modi sint voluptatibus vero, impedit odio exercitationem harum perspiciatis.
            </div>
            <ul v-for="service in servicesBulletPoints">
                <li>
                    {{ service }}
                </li>
            </ul>
        </v-card-text>
    </v-card>

    <div class="services-gallery">
        <v-card
        class="mx-auto"
        max-width="400"
        >
        <v-img
        class="align-end text-white"
        height="200"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        cover
        >
        <v-card-title>Top 10 Australian beaches</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
        Number 10
        </v-card-subtitle>

        <v-card-text>
        <div>Whitehaven Beach</div>

        <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text>

        <v-card-actions>
        <v-btn color="orange">
        Share
        </v-btn>

        <v-btn color="orange">
        Explore
        </v-btn>
        </v-card-actions>
        </v-card>

        <v-card
        class="mx-auto"
        max-width="400"
        >
        <v-img
        class="align-end text-white"
        height="200"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        cover
        >
        <v-card-title>Top 10 Australian beaches</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
        Number 10
        </v-card-subtitle>

        <v-card-text>
        <div>Whitehaven Beach</div>

        <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text>

        <v-card-actions>
        <v-btn color="orange">
        Share
        </v-btn>

        <v-btn color="orange">
        Explore
        </v-btn>
        </v-card-actions>
        </v-card>

        <v-card
        class="mx-auto"
        max-width="400"
        >
        <v-img
        class="align-end text-white"
        height="200"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        cover
        >
        <v-card-title>Top 10 Australian beaches</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
        Number 10
        </v-card-subtitle>

        <v-card-text>
        <div>Whitehaven Beach</div>

        <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text>

        <v-card-actions>
        <v-btn color="orange">
        Share
        </v-btn>

        <v-btn color="orange">
        Explore
        </v-btn>
        </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "Services",
    data() {
        return {
            carouselImages: [
                "https://images.unsplash.com/photo-1622480198867-016a77991bd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
                "https://images.unsplash.com/photo-1526392587392-d1627b6c134a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
            ],
            servicesBulletPoints: [
                "Regularly check and clean gutters to prevent water damage",
                "Replace air filters in HVAC system every 3 months",
                "Test smoke detectors and carbon monoxide detectors monthly",
                "Inspect and repair roof as needed to prevent leaks",
                "Seal cracks in foundation and walls to prevent water penetration",
                "Keep trees and bushes trimmed away from your home to prevent damage from falling branches",
            ]
        }
    }
}

</script>

<style lang="scss" scoped>

.services-gallery{
    display: flex;
    flex-wrap: wrap;
    column-gap: 3px;
    row-gap: 15px;
    margin: 5px;
}

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