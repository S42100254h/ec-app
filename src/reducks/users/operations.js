import { signInAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimeStamp } from "../../firebase/index";
import { isValidEmailFormat, isValidRequiredInput } from "../../function/common";

export const signIn = (email, password) => {
  return async (dispatch) => {
    // Validation
    if (!isValidRequiredInput(email, password)) {
      alert("メールアドレスかパスワードが未入力です。");
      return false;
    }

    if (!isValidEmailFormat(email)) {
      alert("メールアドレスの形式が不正です");
      return false;
    }

    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください");
      return false;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user

        if (user) {
          const uid = user.uid

          db.collection("users").doc(uid).get()
            .then(snapshots=> {
              const data = snapshots.data();

              dispatch(signInAction( {
                isSignIn: true,
                role: data.role,
                uid: uid,
                username: data.username
              }));

              dispatch(push("/"));
            });
        }
      });
  };
};

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    // Validation
    if (!isValidRequiredInput(username, email, password, confirmPassword)) {
      alert("必須項目が未入力です");
      return false;
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致していません。");
      return false;
    }

    if(!isValidEmailFormat(email)) {
      alert("メールアドレスの形式が不正です。もう一度お試しください。");
      return false;
    }

    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください");
      return false;
    }

    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user
        
        if(user) {
          const uid = user.uid;
          const timestamp = FirebaseTimeStamp.now();

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
