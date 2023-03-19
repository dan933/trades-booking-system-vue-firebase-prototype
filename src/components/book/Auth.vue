
const Auth = () => 
Promise.resolve({
    <template>
        <button @click="signIn">Sign In</button>
        <button @click="currentUser">Current User</button>
    </template>
    
    <script>
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

    export default {
        name: "Auth",
        data() {
            return {
                provider: null
            }
        },
        mounted() {
            this.provider = new GoogleAuthProvider();
        },
        methods: {
            signIn() {
                const auth = getAuth();
                signInWithPopup(auth, this.provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
            }
        }
    }
    
    </script>
    
    <style lang="scss" scoped>
    
    .auth-section{
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
    </style>

})