import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as anchor from "@project-serum/anchor";
import "react-toastify/dist/ReactToastify.css";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils } from "@project-serum/anchor";
import emailjs from "@emailjs/browser";

// Destructuring web3 objects
const { SystemProgram, Keypair } = web3;

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function Verify({ state1 }) {
  const form = useRef();
  const [check_id, setCheck_id] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("");
  // Function to fetch a post
  const getData = async (event) => {
    event.preventDefault();
    try {
      const { provider, program, baseAccount } = state1;
      const post = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log(post.postList);
      const filterdata = filterPostList(post.postList);
      console.log(filterdata);
      console.log("Check: ", filterdata[0]);
      if (filterdata[0] != undefined) {
        setCheck_id(filterdata[0]);
        setImageUrls(filterdata[0].img);
        setEmail(filterdata[0].email);
        setTitle(filterdata[0].title);
        setDescription(filterdata[0].description);
        setLocation(filterdata[0].location);
      } else {
        setCheck_id("");
        setImageUrls("");
        setEmail("");
        setTitle("");
        setDescription("");
        setImageUrls(["https://dummyimage.com/720x400"]);
        setLocation("");
        toast.success("There are no more complaints.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      setData(post.governmentWorkerList);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  function findIdOfQualityOfLifeIssue(governmentWorkerList, title) {
    const worker = governmentWorkerList.find(
      (worker) => worker.department == title
    );
    if (worker) {
      return worker.id;
    } else {
      return null; // Return null if no matching department is found
    }
  }

  const approve = async (event) => {
    event.preventDefault();
    try {
      const workerid = findIdOfQualityOfLifeIssue(data, check_id.title);
      const worker_id = new anchor.BN(workerid);
      const { provider, program, baseAccount } = state1;
      const tx = await program.rpc.addStatusToGovernment(
        check_id.id,
        worker_id,
        {
          accounts: {
            clock: SYSVAR_CLOCK_PUBKEY,
            baseAccount: baseAccount.publicKey,
            signer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      getData(event);
      (function () {
        emailjs.init({
          publicKey: "VxzrfiEPVAfWyyswR",
        });
      })();

      let params = {
        title: title,
        description: description,
        location: location,
        email: email,
        status: "Assigned",
      };
      emailjs
        .send("service_auk0swb", "template_h045ygh", params)
        .then(console.log("Yess"));
      console.log(tx);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const reject = async (event) => {
    event.preventDefault();
    try {
      const { provider, program, baseAccount } = state1;
      console.log(check_id.id.toString(), `Rejected (${status})`);
      const tx = await program.rpc.addStatus(
        check_id.id,
        `Rejected (${status})`,
        {
          accounts: {
            clock: SYSVAR_CLOCK_PUBKEY,
            baseAccount: baseAccount.publicKey,
            signer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      setShowModal(false);
      getData(event);
      (function () {
        emailjs.init({
          publicKey: "VxzrfiEPVAfWyyswR",
        });
      })();

      let params = {
        title: title,
        description: description,
        location: location,
        email: email,
        status: status,
      };
      emailjs
        .send("service_auk0swb", "template_h045ygh", params)
        .then(console.log("Yess"));
      console.log(tx);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  function filterPostList(postList) {
    // Filter posts where status length equals 1
    const filteredPosts = postList.filter((post) => post.status.length === 1);
    // Sort filtered posts by priority in descending order
    filteredPosts.sort((a, b) => b.priority - a.priority);
    return filteredPosts;
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  // Array of image URLs
  const [imageUrls, setImageUrls] = useState([
    "https://dummyimage.com/720x400",
  ]);
  const nextSlide = (event) => {
    event.preventDefault();
    setCurrentSlide((prevSlide) => (prevSlide + 1) % imageUrls.length);
  };
  const prevSlide = (event) => {
    event.preventDefault();
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + imageUrls.length) % imageUrls.length
    );
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = (event) => {
    event.preventDefault();
    setShowModal(!showModal);
  };

  const closeModal = (event) => {
    event.preventDefault();
    setShowModal(false);
  };

  const styles = {
    minHeight: "90vh",
  };
  const bgcolor = {
    backgroundColor: "#161e2d",
  };
  return (
    <>
      <ToastContainer />
      <section class="text-gray-400 bg-gray-900 body-font relative">
        <form
          class="container px-5 py-24 mx-auto"
          style={styles}
          ref={form}
          autocomplete="off"
        >
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              CHECK GRIEVANCE
            </h1>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Next Pending Complain ID
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    value={check_id != "" ? check_id.id.toString() : ""}
                    readOnly
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div class="p-2 w-full flex sm:flex-row flex-col justify-between items-center">
                <button
                  class="flex mb-0 flex items-center mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={getData}
                >
                  Get Pending FIR ID
                </button>

                {/* <button
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={getdata}
                >
                  Get FIR Details
                </button> */}
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    ID
                  </label>
                  <input
                    type="number"
                    autocomplete="off"
                    id="name"
                    name="id"
                    readOnly
                    value={check_id != "" ? Number(check_id.id.toString()) : ""}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <label for="name" class="leading-7 text-sm text-gray-400">
                  Image
                </label>
                <img
                  class="lg:h-48 md:h-36 w-full object-contain object-center aspect-ratio-square"
                  src={imageUrls[currentSlide]}
                  alt="blog"
                  style={{ height: "400px" }}
                ></img>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <button onClick={prevSlide}>Previous</button>
                  <h1>
                    {currentSlide + 1} / {imageUrls.length}
                  </h1>
                  <button onClick={nextSlide}>Next</button>
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Title
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    name="user_address"
                    readOnly
                    value={check_id != "" ? check_id.title : ""}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Department
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    name="name"
                    readOnly
                    value={check_id != "" ? check_id.description : ""}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Location
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    name="name"
                    readOnly
                    value={check_id != "" ? check_id.location : ""}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full flex sm:flex-row flex-col justify-between items-center">
                <button
                  class="flex mb-0 flex items-center mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  style={{ backgroundColor: "green" }}
                  onClick={approve}
                >
                  Approve
                </button>

                {/* <button
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  style={{ backgroundColor: "red" }}
                  onClick={reject}
                >
                  Reject
                </button> */}

                <button
                  onClick={toggleModal}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  style={{ backgroundColor: "red" }}
                >
                  Reject
                </button>

                {/* {showModal && (
        <div
          id="authentication-modal"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Sign in to our platform
                </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={closeModal}>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div class="flex justify-between">
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                            </div>
                            <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                        <a href="#" class="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div>
                    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <a href="#" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                    </div>
                </form>
            </div>
        </div>
          </div>
        </div>
      )} */}

                {showModal && (
                  <div
                    id="authentication-modal"
                    className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center z-50 bg-black bg-opacity-30"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="relative p-4 w-full max-w-md">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex flex-col items-stretch">
                          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              Complaint Reject Form
                            </h3>
                            <button
                              type="button"
                              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                              data-modal-hide="authentication-modal"
                              onClick={closeModal}
                            >
                              <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span className="sr-only">Close modal</span>
                            </button>
                          </div>
                          <div className="p-4 md:p-5">
                            <form class="space-y-4" action="#">
                              <div>
                                <label
                                  for="email"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Title
                                </label>
                                <input
                                  type="text"
                                  name="email"
                                  id="email"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  value={check_id.title}
                                  readOnly
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  for="password"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Reason
                                </label>
                                <input
                                  type="text"
                                  name="password"
                                  id="password"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  onChange={(e) => {
                                    setStatus(e.target.value);
                                  }}
                                  required
                                />
                              </div>
                              <button
                                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={reject}
                              >
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default Verify;
