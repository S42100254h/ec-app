import React from "react";
import { getUserId } from "../reducks/users/selectors";
import { useSelector } from "react-redux";

const Home = () => {
  const selector = useSelector( state => state);
  const uid = getUserId(selector);

  return(
    <>
      <h2>Home</h2>
      <p>{uid}</p>
    </>
  );
};

export default Home;
