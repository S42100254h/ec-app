import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { signIn } from "../reducks/users/operations";

const Reset = () => {
  const dispatch = useDispatch();
  
  const [ email, setEmail ] = useState("");

  const inputPassword = useCallback((event) => {
    setPassword(event.target.value)
  }, [setPassword]);
  
  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">アカウント登録</h2>
      <div className="module-spacer--medium" />
      <TextInput
        fullWidth={true} label={"メールアドレス"} multiline={false} required={true} rows={1} value={email} type={"email"} onChange={inputEmail}
      />
      <div className="module-spacer--medium"></div>
      <div className="center">
        <PrimaryButton
          label={"パスワードをリセットする"}
          onClick={() => dispatch(signIn(email, password))}
        />
      </div>
    </div>
  );
};

export default SignIn;
