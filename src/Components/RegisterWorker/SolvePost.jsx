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
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

function SolvePost({ state1 }) {
  const form = useRef();
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId;
  const [check_id, setCheck_id] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  // Function to fetch a post
  const getData = async () => {
    // event.preventDefault();
    try {
      const { provider, program, baseAccount } = state1;
      const post = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log(post.postList[userId]);
      const filterdata = post.postList[userId];
      if (filterdata != undefined) {
        setCheck_id(filterdata);
        setImageUrls(filterdata.img);
        setEmail(filterdata.email);
        setTitle(filterdata.title);
        setDescription(filterdata.description);
        setLocation(filterdata.location);
      } else {
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
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(()=>{
    getData();
  }, [state1])

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

  const reject = async (event) => {
    event.preventDefault();
    try {
      const { provider, program, baseAccount } = state1;
      console.log(check_id.id.toString(), img, check_id.title, status);
      const tx = await program.rpc.solutionPost(
        check_id.id,
        img,
        check_id.title,
        status,
        {
          accounts: {
            clock: SYSVAR_CLOCK_PUBKEY,
            baseAccount: baseAccount.publicKey,
            signer: provider.wallet.publicKey,
          },
        }
      );
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

      navigate("/worker");
      setShowModal(false);
      getData(event);
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

  const [img, setImg] = useState([]);
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      try {
        const formDataArray = Array.from(files).map((file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "event_nft");
          data.append("cloud_name", "darrqmepw");
          return data;
        });

        const promises = formDataArray.map((formData) =>
          fetch("https://api.cloudinary.com/v1_1/darrqmepw/image/upload", {
            method: "POST",
            body: formData,
          }).then((response) => response.json())
        );

        const responses = await Promise.all(promises);

        const secureUrls = responses.map((response) => response.secure_url);
        setImg(secureUrls);
        console.log(secureUrls);
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      }
    }
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
              CHECK COMPLAINT
            </h1>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
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
                  onClick={toggleModal}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  style={{ backgroundColor: "green" }}
                >
                  Work Done
                </button>

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
                                  for="image"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Images
                                </label>
                                <input
                                  type="file"
                                  name="image"
                                  id="image"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  multiple
                                  onChange={handleFileChange}
                                  required
                                />
                              </div>
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

export default SolvePost;
