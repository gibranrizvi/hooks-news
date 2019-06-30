import fb from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';

// Initialize Firebase

class Firebase {
  constructor() {
    fb.initializeApp(firebaseConfig);
    this.auth = fb.auth();
  }

  register = async (name, email, password) => {
    const newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    // Update user's profile
    return await newUser.user.updateProfile({
      displayName: name
    });
  };

  login = async (email, password) => {
    return await this.auth.signInWithEmailAndPassword(email, password);
  };
}

const firebase = new Firebase();

export default firebase;
