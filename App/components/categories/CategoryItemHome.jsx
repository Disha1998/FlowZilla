import React, { useEffect, useState } from "react";
import Link from "next/link";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import { listForSaleTx } from "../../../flow/cadence/transactions/list_for_sale";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
const likes = 54;
const CategoryItemHome = ({ data }) => {
  // console.log(data);
  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {data && data.map((item) => {

        return (
          <article key={item.id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <a>
                  <Link href={`/item/${item.id}`}>
                    <img
                      style={{ cursor: "pointer" }}
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
                  {item.price} Flow
                </span>

              </div>

              <div>

              </div>

              <div className="mt-5 flex items-center justify-between">

                <a className="group flex items-center">


                  <button
                    type="button"
                    className="text-accent font-display text-sm font-semibold"
                    style={{ border: "1px dotted white", padding: "5px", borderRadius:"5px" }}

                  >
                    Purchase
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

export default CategoryItemHome;
