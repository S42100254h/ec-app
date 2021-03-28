import { push } from "connected-react-router";
import { db, FirebaseTimeStamp } from "../../firebase/index";

const productsRef = db.collection("products");

export const saveProduct = (name, description, category, gender, images, price) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimeStamp.now();

    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price, 10),
      updated_at: timestamp
    };

    const ref = productsRef.doc();
    const id = ref.id;
    data.id = id;
    data.created_at = timestamp;

    return productsRef.doc(id).set(data)
      .then(() => {
        dispatch(push("/"))
      }).catch((error) => {
        throw new Error(error);
      })
  }
};
