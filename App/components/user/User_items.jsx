import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Image from "next/image";
import Trending_categories_items from "../categories/trending_categories_items";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import OwnedNFTs from "../categories/Owned_nfts";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { getNFTsScript } from "../../../flow/cadence/scripts/get_nfts";


const User_items = () => {
  const [itemActive, setItemActive] = useState(1);

  const superCoolContext = React.useContext(SupercoolAuthContext);
  // const [nfts, setNFTs] = useState([]);

  const { user, nftsForSell, allNfts } = superCoolContext;
  // useEffect(() => {
  //   if (user?.addr !== undefined) {
  //     getUserNFTs();
  //   }
  // }, [user?.addr])

  // const getUserNFTs = async () => {
  //   let account = user?.addr
  //   // console.log('address',account);
  //   const result = await fcl.send([
  //     fcl.script(getNFTsScript),
  //     fcl.args([
  //       fcl.arg(account, t.Address)
  //     ])
  //   ]).then(fcl.decode);

  //   console.log('result==>', result);
  //   let metadataa = []
  //   for (let i = 0; i < result.length; i++) {
  //     const tokenURI = result[i].ipfsHash;
  //     const tokenid = result[i].id;
  //     const response = await fetch(tokenURI);
  //     const metadata = await response.json();
  //     const newMetadata = {...metadata, id : tokenid}
  //     metadataa.push(newMetadata)
  //   }

  //   setNFTs(metadataa);
  // }

  // console.log('nfts==>', nfts);


  const tabItem = [
    {
      id: 1,
      text: "on sale",
      icon: "on-sale",
    },
    {
      id: 2,
      text: "owned",
      icon: "owned",
    },
  ];
  return (
    <>
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          {/* <img src="img/gradient_light.jpg" alt="gradient" className="h-full w-full" /> */}
          <Image
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
            layout="fill"
          />
        </picture>
        <div className="container">
          {/* <!-- Tabs Nav --> */}
          <Tabs className="tabs">
            <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
              {tabItem.map(({ id, text, icon }) => {
                return (
                  <Tab
                    className="nav-item"
                    role="presentation"
                    key={id}
                    onClick={() => setItemActive(id)}
                  >
                    <button
                      className={
                        itemActive === id
                          ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                          : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                      }
                    >
                      <svg className="icon mr-1 h-5 w-5 fill-current">
                        <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                      </svg>
                      <span className="font-display text-base font-medium">
                        {text}
                      </span>
                    </button>
                  </Tab>
                );
              })}
            </TabList>



            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items
                  data={nftsForSell}
                />
              </div>
            </TabPanel>


            <TabPanel>
              <div>
                <OwnedNFTs
                  data={allNfts}
                />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default User_items;
