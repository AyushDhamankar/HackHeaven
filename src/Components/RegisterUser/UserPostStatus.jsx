import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as anchor from "@project-serum/anchor";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import moment from 'moment';

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function UserPostStatus({ state }) {
  const params = useParams();
  const userId = params.userId;

  const [data, setData] = useState("");
  const getData = async () => {
    try {
      const { keypair, program, baseAccount } = state;
      const data = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log(data.postList[userId].status);
      setData(data.postList[userId].status);
    } catch (error) {
      console.log(error);
    }
  };

  function convertTimestampToHumanReadable(timestamp) {
    // Convert Unix timestamp to milliseconds by multiplying by 1000
    const milliseconds = timestamp * 1000;
    // Use moment to format the date
    const humanReadableTime = moment(milliseconds).format('MMMM Do YYYY, h:mm:ss a');
    return humanReadableTime;
}

  useEffect(() => {
    getData();
  }, [state]);
  return (
    <>
      <section class="text-gray-400 bg-gray-900 body-font" style={{ minHeight: "90vh" }}>
        <div class="container px-5 py-24 mx-auto flex flex-wrap">
        {data !== "" &&
              data.map((data, index) => {
                if (data.status != "") {
                  console.log(data);
                  return (
                    <>
          <div class="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-800 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">
            </div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-gray-800 text-indigo-400 rounded-full inline-flex items-center justify-center">
                <h1 style={{ fontSize: 'xx-large' }}>{index + 1}</h1>
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-white mb-1 text-xl">
                  {data.status}
                </h2>
                <p class="leading-relaxed">
                {convertTimestampToHumanReadable(data.timestamp.toString())}
                </p>
              </div>
            </div>
          </div>
          </>
                  );
                }
              })}
        </div>
      </section>
    </>
  );
}
export default UserPostStatus;
