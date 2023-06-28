/* eslint-disable @next/next/no-img-element */
import React from "react";
import { trendingCategoryData } from "../../data/categories_data";
import { HeadLine } from "../component";
import Trending_categories_items from "./trending_categories_items";
import { SupercoolAuthContext } from "../../context/supercoolContext";
const Tranding_category = () => {
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { allNFTSForSell } = superCoolContext;
  return (
    <section className="py-24">
      <div className="container">
        <HeadLine
          text="Trending categoriess"
          image="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/26a1.png"
          classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
        />

        {/* trending categories */}
        <Trending_categories_items data={allNFTSForSell}/>
      </div>
    </section>
  );
};

export default Tranding_category;
