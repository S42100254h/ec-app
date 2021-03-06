import { fetchOrdersHistoryAction, fetchProductsInCartAction, signInAction, signOutAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimeStamp } from "../../firebase/index";
import { isValidEmailFormat, isValidRequiredInput } from "../../function/common";
import { hideLoadingAction, showLoadingAction } from "../loading/actions";

export const addProductToCart = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const cartRef = db.collection("users").doc(uid).collection("cart").doc();
    addedProduct["cartId"] = cartRef.id;
    await cartRef.set(addedProduct);
    dispatch(push("/"));
  }
};

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const list = []; 

    db.collection("orders")
      .orderBy("updated_at", "desc")
      .get()
      .then((snapshots) => {
        snapshots.forEach(snapshot => {
          const data = snapshot.data();
          list.push(data);
        })

        dispatch(fetchOrdersHistoryAction(list));
      })
  }
};

export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInCartAction(products))
  }
};

export const listenAuthState = () => {
  return async (dispatch) => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid
  
        db.collection("users").doc(uid).get()
          .then(snapshot => {
            const data = snapshot.data();
  
            dispatch(signInAction({
              isSignedIn: true,
              role: data.role,
              uid: uid,
              username: data.username
            }));
          })
      } else {
        dispatch(push("/signin"));
      }
    })
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    dispatch(showLoadingAction("Sign in..."))
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

export const signOut = () => {
  return async (dispatch) => {
    auth.signOut()
      .then(() => {
        dispatch(signOutAction());
        dispatch(push("/signin"));
      });
  }
};

export const resetPassword = (email) => {
  return async (dispatch) => {
    if (email === "") {
      alert("必須項目が未入力です。");
      return false;
    } else {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert("入力されたアドレスにパスワードリセット用のメールを送りました。");
          dispatch(push("/signin"));
        }).catch(() => {
            alert("パスワードリセットに失敗しました。通信環境を確認してください。");
        })
    }
  };
};
