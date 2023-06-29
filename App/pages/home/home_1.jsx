import React from "react";
import {
  Hero,
  Bids,
  Top_collection,
  Tranding_category,
  NewseLatter,
} from "../../components/component";
import Meta from "../../components/Meta";

const Home_1 = () => {

  return (
    <main>
      <Meta title="Home" />
      <Hero />
      <Bids />
      <Tranding_category />
    </main>
  );
};

export default Home_1;
