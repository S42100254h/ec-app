import React, { useState, useCallback, useEffect } from "react";
import TextInput from "../components/UIkit/TextInput";
import SelectBox from "../components/UIkit/SelectBox";
import PrimaryButton from "../components/UIkit/PrimaryButton";
import { useDispatch } from "react-redux";
import { saveProduct } from "../reducks/products/operations";
import { ImageArea, SetSizesArea } from "../components/Products/index";
import { db } from "../firebase";

const ProductEdit = () => {
  const dispatch = useDispatch();
  let id = window.location.pathname.split("/product/edit")[1];
  
  if (id !== "") {
    id = id.split("/")[1];
  } 

  const [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [price, setPrice] = useState(""),
        [category, setCategory] = useState(""),
        [categories, setCategories] = useState([]),
        [images, setImages] = useState([]),
        [gender, setGender] = useState(""),
        [sizes, setSizes] = useState([]);

  const inputName = useCallback((event) => {
    setName(event.target.value)
  }, [setName]);
  const inputDescription = useCallback((event) => {
    setDescription(event.target.value)
  }, [setDescription]);
  const inputPrice = useCallback((event) => {
    setPrice(event.target.value)
  }, [setPrice]);

  const genders = [
    { id: "all", name: "すべて"},
    { id: "male", name: "メンズ"},
    { id: "femail", name: "レディース"}
  ];

  useEffect(() => {
    if (id !== "") {
      db.collection("products").doc(id).get()
        .then(snapshot => {
          const data = snapshot.data();
          setImages(data.images);
          setName(data.name)
          setDescription(data.description);
          setCategory(data.category);
          setGender(data.gender);
          setPrice(data.price);
          setSizes(data.sizes);
        });
    }
  }, [id]);

  useEffect(() => {
    db.collection("categories")
      .orderBy("order", "asc")
      .get()
      .then(snapshots => {
        const list = [];
        snapshots.forEach(snapshot => {
          list.push(snapshot.data())
          setCategories(list);
        })
      })
  }, []);
  
  return (
   <section>
     <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
     <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true} label={"商品名"} multiline={false} required={true}
          onChange={inputName} rows={1} value={name} type={"text"}
        />
        <TextInput
          fullWidth={true} label={"商品説明"} multiline={true} required={true}
          onChange={inputDescription} rows={5} value={description} type={"text"}
        />
        <SelectBox
          label={"カテゴリー"} required={true} options={categories} select={setCategory} value={category}
        />
        <SelectBox
          label={"性別"} required={true} options={genders} select={setGender} value={gender}
        />
        <TextInput
          fullWidth={true} label={"価格"} multiline={false} required={true}
          onChange={inputPrice} rows={1} value={price} type={"number"}
        />
        <div className="module-spacer--small" />
        <SetSizesArea sizes={sizes} setSizes={setSizes}/>
        <div className="module-spacer--small" />
        <div className="center">
          <PrimaryButton
            label={"商品情報を保存"}
            onClick={() => dispatch(saveProduct(id, name, description, category, gender, images, price, sizes))}
          />
      </div>
     </div>
   </section> 
  );
};

export default ProductEdit;
