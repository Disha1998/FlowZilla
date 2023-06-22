import React, { useState, createContext, useEffect, useRef } from "react";
import { BigNumber, providers } from "ethers";
import { SUPER_COOL_NFT_CONTRACT, abi } from "../constant/constant";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { RandomPrompts } from "../components/RandomImgs";
import localforage from "localforage";
import axios from "axios";
import * as fcl from "@onflow/fcl";
import { getNFTs, getNFTsScript } from "../../flow/cadence/scripts/get_nfts";
import * as types from "@onflow/types";
import * as t from "@onflow/types";
import { getSaleNFTsScript } from "../../flow/cadence/scripts/get_sale_nfts";

export const SupercoolAuthContext = createContext(undefined);

export const SupercoolAuthContextProvider = (props) => {
  const web3ModalRef = useRef();
  // let defPrompt = "I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called Midjourney. I will provide you with short content ideas and your job is to elaborate these into full, explicit, coherent prompts. Prompts involve describing the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. Your focus needs to be on nouns and adjectives. I will give you some example prompts for your reference. Please define the exact camera that should be used Here is a formula for you to use(content insert nouns here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting, reference the lighting here)(colours reference color styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here) when giving a prompt remove the brackets, speak in natural language and be more specific, use precise, articulate language. Example prompt: Portrait of a Celtic Jedi Sentinel with wet Shamrock Armor, green lightsaber, by Aleksi Briclot, shiny wet dramatic lighting. For now if understand what I asked to you just replay 'write anything'. And write full prompt from next request. "

  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allNfts, setAllNfts] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [userAdd, setUserAdd] = useState();
  const [genRanImgLoding, setGenRanImgLoding] = useState(false);
  const [user, setUser] = useState();
  const [nfts, setNFTs] = useState([]);
  const [nftsForSell, setNFTsForSell] = useState([]);

  // const [provider, setProvider] = useState(null);
  // const [signer, setSigner] = useState(null);
  let provider;
  let signer;
  if (typeof window !== "undefined" && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    console.log("No wallet connected or logged out");
  }

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);
  // console.log(user.addr,'user');



  const auth =
    "Basic " +
    Buffer.from(
      process.env.infuraProjectKey + ":" + process.env.infuraSecretKey
    ).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const contract = new ethers.Contract(SUPER_COOL_NFT_CONTRACT, abi, signer);

  const GenerateNum = async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    // console.log(accounts);
    setGenRanImgLoding(true);
    const tx = await contract.getRandomNumber();
    await tx.wait();
    const num = await contract.ranNum();
    setPrompt(RandomPrompts[num]);
    setGenRanImgLoding(false);
  };
  // console.log(process.env.apiKey);
  const getProfileData = async (add) => {
    console.log("use add--", add);
    if (add !== undefined) {
      const dataurl = await contract.getUserProfile(add);
      console.log(dataurl);
      const response = await axios.get(dataurl);
      // console.log(response.data);
      return response;
    }
  };

  useEffect(() => {
    if (user?.addr !== undefined) {
      getUserNFTs();
      getUserSaleNFTs();
    }
  }, [user?.addr])

  const getUserNFTs = async () => {
    let account = user?.addr
    const result = await fcl.send([
      fcl.script(getNFTsScript),
      fcl.args([
        fcl.arg(account, t.Address)
      ])
    ]).then(fcl.decode);

    let metadataa = []
    for (let i = 0; i < result.length; i++) {
      const tokenURI = result[i].ipfsHash;
      const tokenid = result[i].id;
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      const newMetadata = {...metadata, id : tokenid}
      metadataa.push(newMetadata)
    }
    setAllNfts(metadataa);
  }


  const getUserSaleNFTs = async () => {
    let account = user?.addr
    const result = await fcl.send([
      fcl.script(getSaleNFTsScript),
      fcl.args([
        fcl.arg(account, t.Address)
      ])
    ]).then(fcl.decode);

    console.log(result);


    let metadataa = [];
    const values = Object.values(result);
    for (let i = 0; i < values.length; i++) {
      const sellnfts = values[i];
      const tokenURI = sellnfts.nftRef.ipfsHash;
      const tokenid = sellnfts.nftRef.id;
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      const newMetadata = { ...metadata, id: tokenid };
      metadataa.push(newMetadata);
    }
    setNFTsForSell(metadataa);
  }
  const uploadOnIpfs = async (e) => {
    let dataStringify = JSON.stringify(e);
    const ipfsResult = await client.add(dataStringify);
    const contentUri = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;

    return contentUri;
  };

  const handleImgUpload = async (file) => {
    const added = await client.add(file);
    const hash = added.path;
    const ipfsURL = `https://superfun.infura-ipfs.io/ipfs/${hash}`;
    return ipfsURL;
  };

  // Edit profile

  const uploadDatainIpfs = async (e) => {
    let dataStringify = JSON.stringify(e);
    const ipfsResult = await client.add(dataStringify);
    const contentUri = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;
    console.log("contentUri", contentUri);
    return contentUri;
  };

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
        nftsForSell,
        uploadOnIpfs,
        allNfts,
        handleImgUpload,
        client,
        loading,
        setLoading,
        contract,
        GenerateNum,
        prompt,
        setPrompt,
        genRanImgLoding,
        userAdd,
        user,
        uploadDatainIpfs,
        // getAllNfts,
        getUserNFTs,
        getProfileData,
        generateText,
      }}
      {...props}
    >
      {props.children}
    </SupercoolAuthContext.Provider>
  );
};
