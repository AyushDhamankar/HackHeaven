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
import * as anchor from "@project-serum/anchor";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function UserPost({ state }) {
  console.log(state);

  const [data, setData] = useState("");
  const [connect, setConnect] = useState("");
  const getData = async () => {
    try {
      const { keypair, program, baseAccount } = state;
      const data = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log(data);
      const email = window.localStorage.getItem("email");
      console.log(email);
      // const filteredPosts = data.postList.filter(
      //   (post) =>
      //     post.email == email &&
      //     post.solutionposts.length === 0 &&
      //     !post.status[1].status.includes("Rejected")
      // );
      const filteredPosts = data.postList.filter(
        (post) =>
          post.email == email
      );
      setData(filteredPosts);
      console.log(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [state]);

  return (
    <>
      <section class="text-gray-400 bg-gray-900 body-font">
        <div class="container px-5 py-24 mx-auto" style={{ minHeight: "90vh" }}>
          <div
            class="flex flex-wrap -m-4"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {data !== "" &&
              data.map((data) => {
                if (data.title != "") {
                  console.log(data);
                  return (
                    <>
                      <div class="p-4 md:w-1/3">
                        <div class="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                          <img
                            class="lg:h-48 md:h-36 w-full object-cover object-center"
                            src={data.img[0]}
                            alt="blog"
                          />
                          <div class="p-6">
                            <h2 class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                              Title
                            </h2>
                            <h1 class="title-font text-lg font-medium text-white mb-3">
                              {data.title}
                            </h1>
                            <p
                              class="leading-relaxed mb-3"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <svg
                                fill="#6b7280"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ height: "20px" }}
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M21,7H3V4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1ZM3,20V9H21V20a1,1,0,0,1-1,1H4A1,1,0,0,1,3,20Zm3-6H18V12H6Zm0,4h6V16H6Z"></path>
                                </g>
                              </svg>
                              {data.description}
                            </p>
                            <p
                              class="leading-relaxed mb-3"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ height: "20px" }}
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  {" "}
                                  <path
                                    d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                                    stroke="#6b7280"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>{" "}
                                  <path
                                    d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
                                    stroke="#6b7280"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>{" "}
                                </g>
                              </svg>
                              {data.location}
                            </p>
                            <div class="flex items-center flex-wrap ">
                              <Link
                                to={`/status/${data.id}`}
                                class="text-indigo-400 inline-flex items-center md:mb-2 lg:mb-0"
                              >
                                Check Status Now
                                <svg
                                  class="w-4 h-4 ml-2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M5 12h14"></path>
                                  <path d="M12 5l7 7-7 7"></path>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
              })}
          </div>
        </div>
      </section>
    </>
  );
}
export default UserPost;
