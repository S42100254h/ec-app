import { push } from "connected-react-router";
import { db, FirebaseTimeStamp } from "../../firebase/index";
import { deleteProductsAction, fetchProductsAction } from "./actions";

const productsRef = db.collection("products");

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    productsRef.doc(id).delete()
      .then(() => {
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(product => product.id !== id);
        dispatch(deleteProductsAction(nextProducts));
      });
  };
};

export const fetchProducts = (gender, category) => {
  return async(dispatch) => {
    let query = productsRef.orderBy("updated_at", "desc");
    query= (gender !== "") ? query.where("gender", "==", gender) : query;
    query= (category !== "") ? query.where("category", "==", category) : query;
    query.get()
      .then(snapshots => {
        const productList = [];
        snapshots.forEach(snapshot => {
          const product = snapshot.data();
          productList.push(product);
        })
        dispatch(fetchProductsAction(productList));
      });
  };
};

export const orderProduct = (productsInCart, price) => {
  return async (dispatch, getState) => {
    const uid = getState().users.id;
    const userRef = db.collection("users").doc(uid);
    const timestamp = FirebaseTimeStamp.now();
    let products = {};
    let soldOutProducts = [];

    const batch = db.batch();

    for (const product of productsInCart) {
      const snapshot = await productsRef.doc(product.productId).get();
      const sizes = snapshot.data().sizes;

      // Create a new arry of the product sizes
      const updateSizes = sizes.map(size => {
        if (size.size === product.size) {
          if (size.quantity === 0) {
            soldOutProducts.push(product.name);
            return size;
          }
          return {
            size: size.size,
            quantity: size.quantity - 1
          };
        } else {
          return size;
        }
      });

      products[product.productId] = {
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      };

      batch.update(productsRef.doc(product.productId), {sizes: updateSizes});
      batch.delete(userRef.collection('cart').doc(product.cartId));
    }

    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) ? soldOutProducts.join("???") : soldOutProducts[0];
      alert("?????????????????????????????????" + errorMessage + "?????????????????????????????????????????????????????????????????????");
      return false;
    } else {
      return batch.commit()
        .then(() => {
          const orderRef = userRef.collection("orders").doc();
          const date = timestamp.toDate();
          const shippingDate = FirebaseTimeStamp.fromDate(new Date(date.setDate(date.getDate() + 3)));

          const history = {
            amount: price,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate,
            updated_at: timestamp
          }

          orderRef.set(history);
          dispatch(push("/order/complete"));
        }).catch(() => {
          alert("????????????????????????????????????????????????????????????????????????????????????????????????????????????");
        })
    }
  };
};

export const saveProduct = (id, name, description, category, gender, images, price, sizes) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimeStamp.now();

    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp
    };

    if (id === "") {
      const ref = productsRef.doc();
      id = ref.id;
      data.id = id;
      data.created_at = timestamp;
    }

    return productsRef.doc(id).set(data, { merge: true })
      .then(() => {
        dispatch(push("/"))
      }).catch((error) => {
        throw new Error(error);
      })
  }
};
