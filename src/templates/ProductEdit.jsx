import React, { useState, useCallback } from "react";
import TextInput from "../components/UIkit/TextInput";
import SelectBox from "../components/UIkit/SelectBox";
import PrimaryButton from "../components/UIkit/PrimaryButton";

const ProductEdit = () => {
  const [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [price, setPrice] = useState(""),
        [category, setCategory] = useState(""),
        [gender, setGender] = useState("");

  const inputName = useCallback((event) => {
    setName(event.target.value)
  }, [setName]);
  const inputDescription = useCallback((event) => {
    setDescription(event.target.value)
  }, [setDescription]);
  const inputPrice = useCallback((event) => {
    setPrice(event.target.value)
  }, [setPrice]);

  const categories = [
    { id: "tops",   name: "トップス" },
    { id: "shirts", name: "シャツ" },
    { id: "pants",  name: "パンツ" }
  ];

  const genders = [
    { id: "all", name: "すべて"},
    { id: "male", name: "メンズ"},
    { id: "femail", name: "レディース"}
  ];
  
  return (
   <section>
     <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
     <div className="c-section-container">
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
      <div className="module-spacer--medium" />
      <div classNmae="center">
        <PrimaryButton
          label={"商品情報を保存"}
        />
      </div>
     </div>
   </section> 
  );
};

export default ProductEdit;
