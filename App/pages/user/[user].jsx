import React, { useEffect, useState } from "react";
import User_items from "../../components/user/User_items";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SupercoolAuthContext } from "../../context/supercoolContext";


const User = () => {

  const [address, setAddress] = useState();
  const [coverePhoto, setCoverePhoto] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState();
  const [copied, setCopied] = useState(false);
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { allNfts, getProfileData } = superCoolContext;


  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);


  return (
    <>
      <div className="pt-[5.5rem] lg:pt-24" >
        {/* <!-- Banner --> */}
        <div className="relative h-[18.75rem]">
          <img
            src={coverePhoto}
            alt="banner"
            layout="fill"
            className="h-[18.75rem] w-full object-cover"

          />
        </div>
        {/* <!-- end banner --> */}
        <section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
          {/* <!-- Avatar --> */}
          <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white">
              <img
                src={profilePhoto}
                alt={username}
                layout="fill"
                objectFit="contain"
                className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
              />
           
            </figure>
          </div>

          <div className="container">
            <div className="text-center">
              <h4 className="font-display text-jacarta-700 mb-2 text-2xl font-medium dark:text-white">
                {username ? username : "user"}
              </h4>
              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
                <Tippy content="ETH">
                  <svg className="icon h-4 w-4 mr-1">
                    <use xlinkHref="/icons.svg#icon-ETH"></use>
                  </svg>
                </Tippy>

                <Tippy
                  hideOnClick={false}
                  content={
                    copied ? <span>copied</span> : <span>copy</span>
                  }
                >
                  <button className="js-copy-clipboard dark:text-jacarta-200 max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap">
                    <CopyToClipboard
                      text={address}
                      onCopy={() => setCopied(true)}
                    >
                      <span>{address}</span>
                    </CopyToClipboard>
                  </button>
                </Tippy>
              </div>

              <p className="dark:text-jacarta-300 mx-auto mb-2 max-w-xl text-lg">
                {bio}
              </p>
              <span className="text-jacarta-400">
                Joined May 2023
              </span>
            </div>
          </div>
        </section>
        {/* <!-- end profile --> */}
        <User_items data={allNfts} />
      </div>
    </>
  );
};

export default User;
