import React from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { signInAction } from "../reducks/users/actions";

const SignIn = () => {
  const dispatch = useDispatch();
  
  return (
    <div>
      <h2>サインイン</h2>
      <button onClick={() => {
        dispatch(signInAction({ uid: "00001", username: "neko"}));
        dispatch(push("/"))
      }}>
        サインイン
      </button>
    </div>
  );
};

export default SignIn;
