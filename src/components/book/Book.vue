
const Book = () => 
Promise.resolve({
    <template>        
        <section class="book-section">
            <v-card
            elevation="3"
            class="card"
            >
            <v-card-title>
                Book Online
            </v-card-title>
                <v-card-text>
                    <div class="pa-3 text-body text-center">
                        We are a team of experienced professionals dedicated to helping you create the home of your dreams. Our home renovation services are designed to meet your needs and style preferences, no matter how unique they may be.
                        We understand that home renovations can be stressful, which is why we make the process as smooth as possible. From obtaining necessary permits to ensuring that the work meets all safety standards, we handle all of the details so that you don't have to.
                        Our team is committed to providing high-quality workmanship and exceptional customer service. We'll work with you from start to finish to ensure that your vision becomes a reality.
                        Contact us today to learn more about our home renovation services and start transforming your space into the home of your dreams.
                    </div>  
                </v-card-text>
            </v-card>
        </section>
    </template>
    
    <script>
    export default {
        name: "Book",
        data() {
            return {
                carouselImages: [
                    "https://source.unsplash.com/TRCJ-87Yoh0/700x200",
                    "https://source.unsplash.com/AQl-J19ocWE/700x200"
                ]
            }
        }
    }
    
    </script>
    
    <style lang="scss" scoped>
    
    .book-section{
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 700px;
        width: 90%;
    }
    
    .card{
        margin-top: 5px;
        padding: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    
    }
    
    .carousel-image{
        width: 100%;
        border-radius: 5px;
    }
    
    .carousel-container{
        display: flex;
        max-width: 90vw;
        width: 700px;
        min-height: 200px;
    }
    </style>

})