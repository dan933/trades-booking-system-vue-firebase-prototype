const Auth = () => 
Promise.resolve({
    <template>
			<div class="auth-section">
				<v-card
				elevation="5"
				>
					<h1 class="card-title">Login in to book</h1>
					<div class="card-container">
						<v-btn @click="signIn" class="google-button">
							<img class="google-logo" src="../../../public/icons/google-logo.png" alt="" srcset=""/>
							<span>Sign In With Google</span>
						</v-btn>
					
					</div>

				</v-card>
			</div>
    </template>
    
    <script>
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import router from "../../router/router";

    export default {
        name: "Auth",
        data() {
            return {
                provider: null
            }
        },
        mounted() {
        },
        methods: {
            signIn() {

							this.provider = new GoogleAuthProvider();

							const auth = getAuth();
							signInWithPopup(auth, this.provider)
							.then(() => {
								
								router.push('/book')
            	}).catch((error) => {
                
                // // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // // The email of the user's account used.
                // const email = error.customData.email;
                // // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
            });
            }
        }
    }
    
    </script>
    
    <style lang="scss" scoped>

		.google-button{
			margin: 10px;
			height: 60px;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
		}
		.google-logo{
			margin-right: 10px;
			height: 40px;
			max-height: 10vh;
		}
    
    .auth-section{
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 700px;
        width: 90%;
				height: 100%;
    }
    
		
		.card-title{
			text-align: center;
			margin: 10px;
		}

    .card-container{
				overflow: auto;
				height: 500px;
				width:500px;
				max-height: 50vh;
				max-width: 90vw;
        margin-top: 5px;
        padding: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;    
    }
    </style>

})