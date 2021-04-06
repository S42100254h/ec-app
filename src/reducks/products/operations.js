import { push } from "connected-react-router";
import { db, FirebaseTimeStamp } from "../../firebase/index";

const productsRef = db.collection("products");

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
