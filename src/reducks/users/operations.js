import { signInAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimeStamp } from "../../firebase/index";

export const signIn = (email, password) => {
  return async (dispatch, getState) => {
    const state = getState();
    const isSignedIn = state.users.isSignedIn;

    if (!isSignedIn) {
      const userDate = await emailSignIn(email, password)
      dispatch(signInAction({
        isSignedIn: true,
        uid: "0001",
        username: "neko"
      }));
    }
  };
};

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    // Validation
    if (username === "" || email ==== "" || password === "" || confirmPassword === "" ) {
      alert("必須項目が未入力です");
      return false;
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致していません。");
      return false;
    }

    return auth.createUserWithEmailAndPassword(emial, password)
      .then(result => {
        const user = result.user
        
        if(user) {
          const uid = user.uid;
          const timestamp = FirebaseTimeStamp.naw();

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username
          };

          db.collection("users").doc(uid).set(userInitialData)
            .then(() => {
              dispatch(push("/"));
            });
        }
      })
  };
};
