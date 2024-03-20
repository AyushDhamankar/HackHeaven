import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function WorkPost({ state1 }) {
  console.log(state1);

  const [data, setData] = useState("");
  const [connect, setConnect] = useState("");
  const getData = async () => {
    try {
      const { provider, program, baseAccount } = state1;
      const data = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      const key = await checkIfWalletIsConnected();
      const governmentWorkerList = data.governmentWorkerList;
      const filteredWorkers = governmentWorkerList.filter(
        (worker) => worker.userAddress.toString() == key
      );
      console.log(filteredWorkers);
      const postarray = filteredWorkers[0].complaintPost;
      console.log("postarray", postarray);
      const postList = data.postList;
      console.log("postList", postList);
      // Filter postList based on the condition
      const filteredPosts = filterPosts(postarray, postList);
      setData(filteredPosts);
      console.log("filteredPosts: ", filteredPosts);
      console.log(filteredWorkers);
      console.log(filteredWorkers[0].complaintPost);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to check if any word in postarray words matches with the id of postList
  const filterPosts = (postarray, postList) => {
    return postList.filter((post) =>
      postarray.some((item) => post.id.toString() == item.toString())
    );
  };

  // Function to check if a wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          console.log(response.publicKey.toString());
          return response.publicKey.toString();
        }
      } else {
        alert("Solana object not found!, Get a Phantom Wallet");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [state1]);

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
                if (data.solutionposts.length === 0) {
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
              <Link to={`/solve/${data.id}`} class="text-indigo-400 inline-flex items-center md:mb-2 lg:mb-0">Status Update
                <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
export default WorkPost;
