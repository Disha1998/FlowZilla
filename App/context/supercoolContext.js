import React, { useState, createContext, useEffect } from "react";
import { SUPER_COOL_NFT_CONTRACT, abi } from "../constant/constant";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import axios from "axios";
import * as fcl from "@onflow/fcl";
import { getNFTs, getNFTsScript } from "../../flow/cadence/scripts/get_nfts";
import * as types from "@onflow/types";
import * as t from "@onflow/types";
import { getSaleNFTsScript } from "../../flow/cadence/scripts/get_sale_nfts";
import { initializeApp } from "firebase/app";
import { RandomPrompts } from "../components/RandomImgs";
import { getAnalytics } from "firebase/analytics";
import { getTotalTokenSupply } from "../../flow/cadence/scripts/get_totalSupply";
import { checkIsInitialized } from "../../flow/cadence/scripts/checkIsInitialized_collection";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from 'firebase/storage';
export const SupercoolAuthContext = createContext(undefined);

export const SupercoolAuthContextProvider = (props) => {
  // let defPrompt = "I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called Midjourney. I will provide you with short content ideas and your job is to elaborate these into full, explicit, coherent prompts. Prompts involve describing the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. Your focus needs to be on nouns and adjectives. I will give you some example prompts for your reference. Please define the exact camera that should be used Here is a formula for you to use(content insert nouns here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting, reference the lighting here)(colours reference color styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here) when giving a prompt remove the brackets, speak in natural language and be more specific, use precise, articulate language. Example prompt: Portrait of a Celtic Jedi Sentinel with wet Shamrock Armor, green lightsaber, by Aleksi Briclot, shiny wet dramatic lighting. For now if understand what I asked to you just replay 'write anything'. And write full prompt from next request. "

  const [loading, setLoading] = useState(false);
  const [currentUserCreatedNFT, setCurrentUserCreatedNFT] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useState();
  const [allNftsOfCurrentUserForSell, setAllNFTsOfCurrentUserForSell] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [myNFTs, setMyNFTs] = useState([]);
  const [myNFTsForSell, setMyNFTsForSell] = useState([]);
  const [allNFTSForSell, setAllNFTsForSell] = useState([]);


  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
    getUserNFTs();
  }, [user?.addr, refresh]);
  // console.log(user.addr,'user addr');


  const checkInit = async () => {
    let account = user?.addr
    console.log('address', account);
    const isInit = await fcl.send([
      fcl.script(checkIsInitialized),
      fcl.args([
        fcl.arg(account, t.Address)
      ])
    ]).then(fcl.decode);
    console.log('result==>', isInit);
    setIsInitialized(isInit);
  }

  const auth =
    "Basic " +
    Buffer.from(
      // process.env.infuraProjectKey + ":" + process.env.infuraSecretKey
      "2DQRq820rLbznhFlkIbTkuYAyCS" + ":" + "33d97cf6366f9565421e36ff7e018e60"
    ).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });


  const getTotalSupply = async () => {
    const result = await fcl.send([
      fcl.script(getTotalTokenSupply),
      fcl.args([])
    ]).then(fcl.decode);
    // console.log('total supply', result - 1);
    let id = result - 1;
    return id;
  }
  // getTotalSupply()
  const firebaseConfig = {
    apiKey: "AIzaSyCGVjsvfInkjCDotvdP6kY_TWdpyvz7uCo",
    authDomain: "superflow-f2e91.firebaseapp.com",
    projectId: "superflow-f2e91",
    storageBucket: "superflow-f2e91.appspot.com",
    messagingSenderId: "367934501039",
    appId: "1:367934501039:web:22c3a59e90c6ba3260e45a",
    measurementId: "G-F945HDRM1P"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const NFTcollectionRef = collection(db, "CreatedNFTsTokenUri");
  const UserProfileRef = collection(db, "UserProfile");



  const storeNftOnFirebase = async (_item) => {
    let tokenid = await getTotalSupply();
    console.log(tokenid);
    const newData = { ..._item, id: tokenid }
    addDoc(NFTcollectionRef, newData);
    console.log("Data stored! Doc");
  }

  // async function storeUserProfile(profileData) {
  //   addDoc(UserProfileRef,profileData);
  //   console.log("Profile stored!!");
  // }




  const updateForSale = async (item) => {
    const q = query(
      collection(db, "CreatedNFTsTokenUri"),
      where("id", "==", item.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((fire) => {
      console.log(fire.data());
      const data = {
        forSale: true
      };
      const dataref = doc(db, "CreatedNFTsTokenUri", fire.id);
      updateDoc(dataref, data);
      console.log(fire.data());
    })
    console.log('done');
  }

  const updateForPurchase = async (id) => {
    const q = query(
      collection(db, "CreatedNFTsTokenUri"),
      where("id", "==", id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((fire) => {
      console.log(fire.data());
      const data = {
        owner: user?.addr,
        forSale: false
      };
      const dataref = doc(db, "CreatedNFTsTokenUri", fire.id);
      updateDoc(dataref, data);
      console.log(fire.data());
    })
    console.log('done');
  }

  const GenerateNum = () => {
    const index = Math.floor(Math.random() * RandomPrompts.length);
    setPrompt(RandomPrompts[index])
  };













  async function getUserNFTs() {
    try {
      const querySnapshot = await getDocs(NFTcollectionRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      // console.log(data.length);
      let myNfts = [];
      let myNftsForSell = [];
      let allNftsForSell = [];

      for (let i = 0; i < data.length; i++) {
        let item = data[i];
       var owner = item?.owner;
       let addr = user?.addr
       let forSale = item.forSale;

       if(forSale === true){
        allNftsForSell.push(item)
        if(owner == addr){
        myNftsForSell.push(item)
        }
       }else if(owner == addr && forSale == false){
        myNfts.push(item)
       }
       

        setMyNFTs(myNfts);
        setMyNFTsForSell(myNftsForSell);
        setAllNFTsForSell(allNftsForSell);

      }
      console.log('My Nft NOT FOR SALE--', myNfts);
      console.log('My Nft FOR SALE--', myNftsForSell);
      console.log('All FOR SALE--', allNftsForSell);
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  }










  useEffect(() => {
    if (user?.addr) {
      checkInit();
    }
  }, [user?.addr])

  // const getUserNFTs = async () => {
  //   let account = user?.addr
  //   console.log(account);
  //   const result = await fcl.send([
  //     fcl.script(getNFTsScript),
  //     fcl.args([
  //       fcl.arg(account, t.Address)
  //     ])
  //   ]).then(fcl.decode);
  //   console.log(result);
  // }
  //   let metadataa = []
  //   for (let i = 0; i < result.length; i++) {
  //     const tokenURI = result[i].ipfsHash;
  //     const tokenid = result[i].id;
  //     const response = await fetch(tokenURI);
  //     const metadata = await response.json();
  //     const newMetadata = {...metadata, id : tokenid}
  //     metadataa.push(newMetadata)
  //   }
  //   setAllNfts(metadataa);
  // }


  // const getUserSaleNFTs = async () => {
  //   let account = user?.addr
  //   const result = await fcl.send([
  //     fcl.script(getSaleNFTsScript),
  //     fcl.args([
  //       fcl.arg(account, t.Address)
  //     ])
  //   ]).then(fcl.decode);

  //   console.log(result,"result");
  // }

  //   let metadataa = [];
  //   const values = Object.values(result);
  //   for (let i = 0; i < values.length; i++) {
  //     const sellnfts = values[i];
  //     const tokenURI = sellnfts.nftRef.ipfsHash;
  //     const tokenid = sellnfts.nftRef.id;
  //     const response = await fetch(tokenURI);
  //     const metadata = await response.json();
  //     const newMetadata = { ...metadata, id: tokenid };
  //     metadataa.push(newMetadata);
  //   }
  //   setNFTsForSell(metadataa);
  // }
  const uploadOnIpfs = async (e) => {
    let dataStringify = JSON.stringify(e);
    const ipfsResult = await client.add(dataStringify);
    const contentUri = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;
    console.log(contentUri);
    return contentUri;
  };

  const handleImgUpload = async (file) => {
    const added = await client.add(file);
    const hash = added.path;
    const ipfsURL = `https://superfun.infura-ipfs.io/ipfs/${hash}`;
    return ipfsURL;
  };

  // Edit profile


  const generateText = async (detailPrompt) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt: detailPrompt,
          max_tokens: 700,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.choices[0].text);
      setPrompt(response.data.choices[0].text);
      // return response.data.choices[0].text;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SupercoolAuthContext.Provider
      value={{
        uploadOnIpfs,
        handleImgUpload,
        client,
        loading,
        setLoading,
        prompt,
        setPrompt,
        user,
        getUserNFTs,
        generateText,
        getTotalSupply,
        storeNftOnFirebase,
        // storeSellNftOnFirebase,
        isInitialized,
        checkInit,
        currentUserCreatedNFT,
        allNftsOfCurrentUserForSell,
        refresh,
        setRefresh,
        updateForSale,
        myNFTs,
        myNFTsForSell,
        allNFTSForSell,
        UserProfileRef,
        db,
        updateForPurchase,
        GenerateNum
      }}
      {...props}
    >
      {props.children}
    </SupercoolAuthContext.Provider>
  );
};
