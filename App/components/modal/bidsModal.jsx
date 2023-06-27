import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bidsModalHide } from "../../redux/counterSlice";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import { useRouter } from 'next/router';
import { ethers } from "ethers";
import { CircularProgress } from "@mui/material";
import { purchaseTx } from "../../../flow/cadence/transactions/purchase";
import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { setupUserTx } from "../../../flow/cadence/transactions/setup_user";
import { flowicon } from "../../public/images/flow-icon.png"

const BidsModal = () => {
  const { bidsModal } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { allNfts, user, isInitialized } = superCoolContext;
  const [buyLoading, setBuyLoading] = useState(false);

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
    return fcl.tx(transactionId).onceSealed();
  };

  const purchaseNft = async (_account, _id) => {

    if (!isInitialized) {
      console.log('is initializes val in create', isInitialized);
      await setupUser();
    }

    try {
      setBuyLoading(true);
      const transactionId = await fcl.send([
        fcl.transaction(purchaseTx),
        fcl.args([
          fcl.arg(_account, t.Address),
          fcl.arg(parseInt(_id), t.UInt64)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);

      console.log(transactionId);
      setBuyLoading(false);
      return fcl.tx(transactionId).onceSealed();

    } catch (error) {
      console.log(error);
      setBuyLoading(false);

    }

  }

  const router = useRouter();
  const pid = router.query.item;
  return (
    <div>
      {
        allNfts.filter((item) => item.id == pid)
          .map((item) => {
            console.log(item);
            return (
              <div key={item.id} className={bidsModal ? "modal fade show block" : "modal fade"}>
                <div className="modal-dialog max-w-2xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5
                        className="modal-title" id="placeBidLabel">
                        Purchase  {item.title}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => dispatch(bidsModalHide())}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                        </svg>
                      </button>
                    </div>

                    {/* <!-- Body --> */}
                    <div className="modal-body p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
                          Price
                        </span>
                      </div>

                      <div className="dark:border-jacarta-600 border-jacarta-100 relative mb-2 flex items-center overflow-hidden rounded-lg border">
                        <div className="border-jacarta-100 bg-jacarta-50 flex flex-1 items-center self-stretch border-r px-2">
                          <span>
                            <svg className="icon icon-ETH mr-1 h-5 w-5">
                              <use xlinkHref={flowicon}></use>
                            </svg>
                          </span>
                          <span className="font-display text-jacarta-700 text-sm">
                            FLOW
                          </span>
                        </div>

                        <input
                          type="number"
                          className="focus:ring-accent h-12 w-full flex-[3] border-0 focus:ring-inse dark:text-jacarta-700"
                          placeholder="Amount"
                          value={item.price}
                          readOnly
                        />

                        <div className="bg-jacarta-50 border-jacarta-100 flex flex-1 justify-end self-stretch border-l dark:text-jacarta-700">
                          {/* <span className="self-center px-2 text-sm">${item.maticToUSD.toFixed(3)}</span> */}
                        </div>
                      </div>

                    </div>
                    {/* <!-- end body --> */}

                    <div className="modal-footer">
                      <div className="flex items-center justify-center space-x-4">
                        {
                          buyLoading ?
                            <CircularProgress />
                            :
                            <button
                              onClick={() => purchaseNft(item.owner, item.id)}
                              type="button"
                              className="text-accent shadow-white-volume hover:bg-accent-dark hover:shadow-accent-volume w-36 rounded-full bg-white py-3 px-8 text-center font-semibold transition-all hover:text-white"
                            >
                              Purchase
                            </button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
      }
    </div>
  );
};

export default BidsModal;
