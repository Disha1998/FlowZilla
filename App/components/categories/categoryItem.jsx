import React, { useEffect, useState } from "react";
import Link from "next/link";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import { listForSaleTx } from "../../../flow/cadence/transactions/list_for_sale";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
const likes = 54;
const CategoryItem = ({ data }) => {
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { storeSellNftOnFirebase } = superCoolContext;

  const listForSale = async (_id,_price,_item) => {
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
      await storeSellNftOnFirebase(_id,_item);
      return fcl.tx(transactionId).onceSealed();  
    } catch (error) {
     console.log(error); 
    }
    
}

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {data && data.map((item) => {

        return (
          <article key={item.tokenId}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <a>
                <Link href={`/item/${item.tokenId}`}>
                  <img
                    style={{cursor:"pointer"}}
                    src={item.image}
                    alt="item 5"
                    className="w-full h-[230px] rounded-[0.625rem] object-cover"
                  />
                </Link>
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
                  {item.price} Matic
                </span>
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  {/* 1/1 */}
                  ~ ${item.maticToUSD}
                </span>
              </div>

              <div>

              </div>

              <div className="mt-5 flex items-center justify-between">

                <a className="group flex items-center">
                  <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                    <use xlinkHref="/icons.svg#icon-history"></use>
                  </svg>
                  <span onClick={() => listForSale(item.id,item.price,item)}  className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                   List NFT for Sale
                  </span>
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
