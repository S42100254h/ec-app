import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsInCart } from "../reducks/users/selectors";
import { makeStyles } from "@material-ui/styles";
import { CartListItem } from "../components/Products";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { PrimaryButton } from "../components/UIkit";

const useStyles = makeStyles((theme) => ({
  detailBox: {
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      width: 320
    },
    [theme.breakpoints.up("sm")]: {
      width: 512
    }
  },
  orderBox: {
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    boxShadow: "0 4px 2px 2px rgba(0, 0, 0, 0.2)",
    height: 256,
    margin: "24px auto 16px auto",
    padding: 16,
    width: 288
  }
}));

const OrderConfirm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const productsInCart = getProductsInCart(selector);

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">注文の確認</h2>
      <div className={classes.detailBox}>
        <List>
          {productsInCart.length > 0 && (
            productsInCart.map(product => <CartListItem product={product} key={product.cartId} />)
          )}
        </List>
      </div>
      <div className={classes.orderBox}>

      </div>
    </section>
  );
};

export default OrderConfirm;
