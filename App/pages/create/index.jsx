import React, { useEffect, useRef, useState } from "react";
import "tippy.js/dist/tippy.css"; // optional
import Meta from "../../components/Meta";
import { Configuration, OpenAIApi } from "openai";
import { SUPER_COOL_NFT_CONTRACT, abi } from "../../constant/constant";
import { ethers } from "ethers";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import { NFTStorage, File } from "nft.storage";
import axios from "axios";
import Options from "../filterCategory/category";
import CircularProgress from "@mui/material/CircularProgress";
import ImageModal from "../modal/modal";
import RendersellNft from "../renderSellNft/renderSellNft";
import { mintNFTFLow } from "../../../flow/cadence/transactions/mint_nft";
import { setupUserTx } from "../../../flow/cadence/transactions/setup_user";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"
import { toast, ToastContainer } from "react-toastify";

const Create = () => {
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const {
    isInitialized,
    uploadOnIpfs,
    loading,
    setLoading,
    GenerateNum,
    prompt,
    setPrompt,
    getUserNFTs,
    user,
    storeNftOnFirebase,
    checkInit
  } = superCoolContext;
  const [title, setTitle] = useState("default");
  const [category, setCategory] = useState("avatar" || category);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [chain, setChain] = useState("Flow" || chain);
  const [rendersellNFT, setrendersellNFT] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [result, setResult] = useState("");

  const imgRef = useRef();
  const [placeholder, setPlaceholder] = useState(
    "Search a lion with Paint Brushes painting the mona lisa painting..."
  );
  const [images, setImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (isMounted && imageUrl) {
      imgRef.current = imageUrl;
    }
  }, [imageUrl, isMounted]);

  const configuration = new Configuration({
    apiKey: process.env.apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const NFT_STORAGE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlkNTYwMUJiOWNFOTkyQjZkYjU4OWYzMGY1NDZGMmYxODJhM0RCOTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzM0NzIzNzMwNSwibmFtZSI6InRydXN0aWZpZWQtZnZtIn0.YDlyBmcRUT0lb2HmMzT0tS1AUY8pGNp1NHqN4xr8_fk";

  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const setupUser = async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(setupUserTx),
        fcl.args([]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);
    console.log(transactionId);
    await fcl.tx(transactionId).onceSealed();
  };


  const generateImage = async () => {
    setGenerateLoading(true);
    setPlaceholder(`Search ${prompt}..`);
    setLoading(true);

    try {
      const res = await openai.createImage({
        prompt: prompt,
        n: 3,
        size: "512x512",
      });
      setLoading(false);
      setResult(res.data.data[0].url);
      let arry = [];
      for (let i = 0; i < res.data.data.length; i++) {
        const img_url = res.data.data[i].url;
        const api = await axios.create({
          baseURL: "https://open-ai-enwn.onrender.com",
        });
        const obj = {
          url: img_url,
        };
        let response = await api
          .post("/image", obj)
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error, '----<>');
          });
        const arr = new Uint8Array(response.data.data);
        const blob = new Blob([arr], { type: "image/jpeg" });
        const imageFile = new File([blob], `data.png`, {
          type: "image/jpeg",
        });
        const metadata = await client.store({
          name: "data",
          description: "data",
          image: imageFile,
        });
        const imUrl = `https://ipfs.io/ipfs/${metadata.ipnft}/metadata.json`;

        const data = (await axios.get(imUrl)).data;
        const rep = data.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        arry.push(rep);
      }
      setImages(arry);
      setGenerateLoading(false);

    } catch (error) {
      console.error(`Error generating image: ${error}`);
      setGenerateLoading(false);
    }
  };

  const mintNft = async (_price, _metadataurl, _nftData) => {
    const ipfsHash = _metadataurl;
    const name = title;
    try {
      const transactionId = await fcl
        .send([
          fcl.transaction(mintNFTFLow),
          fcl.args([
            fcl.arg(ipfsHash, t.String),
            fcl.arg(name, t.String),
          ]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode);
      console.log(transactionId, "<=transactionId");
      const transactionStatus = await fcl.tx(transactionId).onceSealed();

      if (transactionStatus.status === 4) {
        console.log("Transaction succeeded!");
        await storeNftOnFirebase(_nftData);
        setMintLoading(false);
        alert("Yayyy..!!🎉🎉 Minted NFT successfully!!🎉 ")
        // toast("Yayyy..!!🎉🎉 Minted NFT successfully!!🎉 ")

        checkInit();
      } else {
        console.log("Transaction failed:", transactionStatus.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
      setMintLoading(false);
    }

    user && (await getUserNFTs());
    setLoading(!loading);
    setMintLoading(false);
    setImages([]);
    setTitle("");
    setDescription("");
    setPrice("");
    setrendersellNFT(false);
  };


  const nftData = {
    title: title,
    description: description,
    price: price,
    chain: chain,
    owner: user?.addr,
    image: selectedImage,
    // image: "https://bafkreidk4cumbpabaaeigybgh654zbuzxs57v3rgewmqkro6gttbmv5jpa.ipfs.nftstorage.link/",
    category: category,
    forSale: false
  };
  const createNft = async () => {
    setMintLoading(true);
    let metadataurl = await uploadOnIpfs(nftData);
    if (!isInitialized) {
      await setupUser();
    }
    mintNft(ethers.utils.parseUnits(price?.toString(), "ether"), metadataurl, nftData);
  };

  function handleSelectedImg(url) {
    setrendersellNFT(false);
    setSelectedImage(url);
    setModalOpen(true);
  }

  return (
    <>
      <div className="container">
        <div className="grid grid-cols-12 ">
          <div className="col-span-3">
            <div className="categories-scroll" style={{ marginTop: "160px" }}>
              <p className="dark:text-jacarta-300 text-4xs mb-3">
                Experiment and train modal as per your preference
              </p>
              <Options />
            </div>
          </div>
          <div className="col-span-9">
            <Meta title="SuperCool" />

            <section className="relative py-24 nft-sections fixed">
              <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                <img
                  src="/images/gradient_light.jpg"
                  alt="gradient"
                  className="h-full w-full"
                />
              </picture>

              <div className="container nft-sections">
                <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
                  Let your creativity shine and give us a clear picture with
                  your words
                </h1>

                <div className="mx-auto max-w-[48.125rem]">
                  <div className="mb-6">
                    <p className="dark:text-jacarta-300 text-4xs mb-3">
                      We're excited to bring your NFT to life, but we need your
                      input. Please provide us with a brief description of what
                      you want it to look like or
                      <span>
                        <a
                          className="hover:text-accent dark:hover:text-white text-jacarta-700 font-bold font-display mb-6 text-center text-md dark:text-white md:text-left lg:text-md xl:text-md animate-gradient"
                          style={{ cursor: "pointer" }}
                          onClick={GenerateNum}
                        >
                          {" "} generate random image.{" "}
                        </a>
                      </span>
                    </p>

                    <textarea
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={placeholder}
                      value={prompt}
                      id="item-description"
                      className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                      rows="6"
                      required
                    ></textarea>

                    <div className="generate-btn">
                      {generateLoading ? (
                        <CircularProgress />
                      ) : (
                        <button
                          className="bg-accent-lighter rounded-full py-3 px-8 text-center font-semibold text-white transition-all  "
                          style={{ marginBottom: "15px" }}
                          onClick={generateImage}
                        >
                          Generate
                        </button>

                      )}
                    </div>
                    <br />

                    {images.length > 0 ? (
                      <>
                        <div className="row main-row">
                          {images &&
                            images.map((url) => (
                              <div
                                className="col-lg-4 mb-4 mb-lg-0"
                                onClick={() => handleSelectedImg(url)}
                              >
                                <div
                                  className="bg-image hover-overlay ripple shadow-1-strong rounded col-4"
                                  data-ripple-color="light"
                                >
                                  <div className="img-nft">
                                    <img src={url} alt="nft-images" />
                                  </div>
                                  <div className="radio-img">
                                    <input
                                      type="radio"
                                      id="huey"
                                      name="drone"
                                      value="huey"
                                      checked={url == selectedImage}
                                      className="mt-3"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div>
                          <p
                            style={{ textAlign: "center" }}
                            className="dark:text-jacarta-300 text-4xs mb-3"
                          >
                            Select the image you wish to mint.
                          </p>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  {modalOpen && (
                    <div className="img-overlay">
                      <ImageModal
                        setModalOpen={setModalOpen}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        createNft={createNft}
                        setrendersellNFT={setrendersellNFT}
                      />
                    </div>
                  )}
                </div>
                <RendersellNft
                  rendersellNFT={rendersellNFT}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  setPrice={setPrice}
                  createNft={createNft}
                  mintLoading={mintLoading}
                  category={category}
                  setCategory={setCategory}
                  chain={chain}
                  setChain={setChain}
                />
                {/* <ToastContainer /> */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
