import { signInAction } from "./actions";
import { push } from "connected-react-router";

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
