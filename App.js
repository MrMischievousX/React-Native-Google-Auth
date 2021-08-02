import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const scope = [
  'profile',
  'email',
  'openid',
]

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  async function onGoogleButtonPress() {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }
  async function onToken() {
    const accessToken = await GoogleSignin.getTokens();
    console.log(accessToken)
  }

  useEffect(() => {
    //Put google-services.json file in android/app

    GoogleSignin.configure({
      webClientId: '', //Enter your webclient ID of Client type 3 from google-services.json
      offlineAccess: true,
      scopes: scope,
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null)
    } catch (error) {
      console.error(error);
    }
  };


  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.background}>
        <GoogleSigninButton
          style={{ width: 200, height: 50 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={onGoogleButtonPress}
        />
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <Text style={styles.text}>Welcome</Text>
      <Text style={styles.text}>{user.email}</Text>
      <Text onPress={signOut} style={styles.text}>SignOut</Text>
      <Text onPress={onToken} style={styles.text}>Access Token</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
    marginVertical: 5
  }
})

export default App;