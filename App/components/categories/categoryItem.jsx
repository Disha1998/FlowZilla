import React, { useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import { listForSaleTx } from "../../../flow/cadence/transactions/list_for_sale";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
const likes = 54;
const CategoryItem = ({ data }) => {
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { storeSellNftOnFirebase, updateForSale, user, getUserNFTs } = superCoolContext;
  const [saleLoading, setSaleLoading] = useState(false);

  const listForSale = async (_id, _price, _item) => {
    setSaleLoading(true);
    try {
      const transactionId = await fcl.send([
        fcl.transaction(listForSaleTx),
        fcl.args([
          fcl.arg(parseInt(_id), t.UInt64),
          fcl.arg(_price, t.UFix64)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);

      console.log(transactionId);
      alert('NFT listed for Sale Succesfully :) ')
      const transactionStatus = await fcl.tx(transactionId).onceSealed();

      if (transactionStatus.status === 4) {
        console.log("Transaction succeeded!");
        await updateForSale(_item);
        user && (await getUserNFTs());
      setSaleLoading(false);

      } else {
        console.log("Transaction failed:", transactionStatus.errorMessage);
      setSaleLoading(false);
      }

    } catch (error) {
      console.log(error);
      setSaleLoading(false);

    }
  }

  const SaleNft = async (_id, _price, _item) => {
    listForSale(_id, _price, _item)
  }
  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {data && data.map((item) => {

        return (
          <article key={item.tokenId}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <a>
                    <img
                      style={{ cursor: "pointer" }}
                      src={item.image}
                      alt="item 5"
                      className="w-full h-[230px] rounded-[0.625rem] object-cover"
                    />
                </a>
                <Likes like={likes} />

              </figure>
              <div className="mt-3 flex items-center justify-between">
                <a>
                  <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                    {item.title}
                  </span>
                </a>
              </div>
              <div className="mt-2 text-sm">
                <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  {item.description}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  {item.price} Flow
                </span>
              </div>
              <div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <a className="group flex items-center">
                  <button onClick={() => SaleNft(item.id, item.price, item)}
                    className="text-accent font-display text-sm font-semibold"
                    style={{ border: "1px dotted white", borderRadius: "5px", padding: "5px" }}
                  >
                    List NFT for Sale
                  </button>
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CategoryItem;
