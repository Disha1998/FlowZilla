import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "tippy.js/dist/tippy.css";
// import { bidsData } from "../../data/bids_data";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import Tippy from "@tippyjs/react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { bidsModalShow } from "../../redux/counterSlice";
import Likes from "../likes";
import React, { useState, useContext, useEffect } from "react";

const BidsCarousel = () => {
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { user, allNFTSForSell } = superCoolContext;
  const [nfts, setNFTs] = useState([]);
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView="auto"
        // loop={true}
        breakpoints={{
          240: {
            slidesPerView: 1,
          },
          565: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: ".bids-swiper-button-next",
          prevEl: ".bids-swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {allNFTSForSell && allNFTSForSell.map((item) => {
          return (
            <SwiperSlide key={item.id} className="text-white" >
              <article>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                  <figure>
                    {/* <Link href={"/item/" + }> */}
                    <a>
                      <div className="w-full">
                        <Link href={`/item/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            // height={230}
                            // width={230}
                            layout="responsive"
                            // objectFit="cover"
                            // className="rounded-[0.625rem] w-full"
                            className="w-full h-[230px] rounded-[0.625rem] object-cover"
                            loading="lazy"
                          />
                        </Link>
                      </div>
                    </a>
                    {/* </Link> */}
                  </figure>
                  <div className="mt-4 flex items-center justify-between">
                    <a>
                      <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                        {item.title}
                      </span>
                    </a>
                    <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                      <Tippy content={<span>Flow</span>}>
                        <img
                          src="/images/flow-icon.png"
                          alt=""
                          className="w-3 h-3 mr-1"
                        />
                      </Tippy>

                      <span className="text-green text-sm font-medium tracking-tight">
                        {item.price} {" "}
                        FLOW
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="dark:text-jacarta-300 text-jacarta-500">
                      {item.description}
                    </span>
                    <span className="dark:text-jacarta-100 text-jacarta-700">
                    </span>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Link href={`/item/${item.id}`}>

                      <button
                        type="button"
                        className="text-accent font-display text-sm font-semibold"
                        style={{ border: "1px dotted white", padding: "5px", borderRadius: "5px" }}
                      >
                        Purchase
                      </button>
                    </Link>
                    <Likes
                      like="98"
                      classes="flex items-center space-x-1"
                    />
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default BidsCarousel;
