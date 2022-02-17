import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import React from "react";
import { CREATE_USER } from './graphql/mutations';
import { useMutation } from '@apollo/react-hooks';
import defaultUserImage from './images/default-user-image.jpg';

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyAFOI9-VpciXbUsEAS-p2CLXPfoFK87REw",
  authDomain: "instagram-clone-cobiejoe.firebaseapp.com",
  projectId: "instagram-clone-cobiejoe",
  storageBucket: "instagram-clone-cobiejoe.appspot.com",
  messagingSenderId: "160784047673",
  appId: "1:160784047673:web:8ea40246154fe375f0f7e8",
  measurementId: "G-DG1CZDNKMZ"
});

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [authState, setAuthState] = React.useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref(`metadata/${user.uid}/refreshTime`);

          metadataRef.on("value", async (data) => {
            if(!data.exists) return
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  async function signInWithGoogle() {
      await firebase.auth().signInWithPopup(provider);
  };

  async function signUpWithEmailAndPassword(formData) {
    const data = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
    if (data.additionalUserInfo.isNewUser) {
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        email: data.user.email,
        bio: "",
        website: "",
        phoneNumber: "",
        profileImage: defaultUserImage
      }
      await createUser({ variables })
    }
  }

  async function signOut() {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
  };

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
          authState,
          signInWithGoogle,
          signOut,
          signUpWithEmailAndPassword
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

}

export default AuthProvider;