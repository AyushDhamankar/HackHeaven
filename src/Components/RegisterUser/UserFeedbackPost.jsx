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
import { web3 } from "@project-serum/anchor";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import emailjs from "@emailjs/browser";
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

function UserFeedbackPost({ state }) {
  const form = useRef();
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId;
  const [check_id, setCheck_id] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  // Function to fetch a post
  const getData = async () => {
    // event.preventDefault();
    try {
      const { keypair, program, baseAccount } = state;
      const post = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      const filteredPosts = data.governmentWorkerList.filter(
        (post) =>
          post.title == post.postList[userId].title
      );
      console.log(filteredPosts);
      console.log(post.governmentWorkerList[0].userAddress);
      // setData(post.governmentWorkerList[0].userAddress);
      setData(filteredPosts);
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

  useEffect(() => {
    getData();
  }, [state]);

  const feedback = async (event) => {
    event.preventDefault();
    try {
      if (
        rating !== 0
      ) {
        event.preventDefault();
        const { keypair, program, baseAccount } = state;

        // Get recent blockhash
        const recentBlockhash = await connection.getRecentBlockhash();
        console.log("Recent blockhash:", recentBlockhash);

        const Rating = new anchor.BN(rating);
        console.log(check_id.id ,Rating);

        // Construct transaction
        const transaction = new Transaction({ recentBlockhash }).add(
          await program.instruction.postFeedback(check_id.id ,Rating, {
            accounts: {
              clock: SYSVAR_CLOCK_PUBKEY,
              baseAccount: baseAccount.publicKey,
            },
          })
        );
        console.log(transaction);
        // Sign and send transaction
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair], // Signer accounts
          {
            commitment: "confirmed",
            preflightCommitment: "confirmed",
            feePayer: keypair.publicKey, // Specify the fee payer account
          }
        );
        console.log("Transaction signature:", signature);
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
          status: "Complaint Resolved",
        };
        emailjs
          .send("service_auk0swb", "template_h045ygh", params)
          .then(console.log("Yess"));

        navigate("/feedpost");
        toast.success(`Your Complaint is registered`, {
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
      toast.error("Check all field must need to be fill.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
    }
  };

  const feedbackwithmoney = async (event) => {
    event.preventDefault();
    try {
      if (
        rating !== 0
      ) {
        event.preventDefault();
        const { keypair, program, baseAccount } = state;

        // Get recent blockhash
        const recentBlockhash = await connection.getRecentBlockhash();
        console.log("Recent blockhash:", recentBlockhash);

        const Rating = new anchor.BN(rating);
        const value = new anchor.BN(rating * 100000);
        console.log(check_id.id ,Rating, value);

        // Construct transaction
        const transaction = new Transaction({ recentBlockhash }).add(
          await program.instruction.postFeedbackWithMoney(check_id.id ,Rating, value, {
            accounts: {
              clock: SYSVAR_CLOCK_PUBKEY,
              baseAccount: baseAccount.publicKey,
              from: keypair.publicKey,
              to: data,
              systemProgram: SystemProgram.programId,
            },
          })
        );
        console.log(transaction);
        // Sign and send transaction
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair], // Signer accounts
          {
            commitment: "confirmed",
            preflightCommitment: "confirmed",
            feePayer: keypair.publicKey, // Specify the fee payer account
          }
        );
        console.log("Transaction signature:", signature);
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
          status: "Complaint Resolved",
        };
        emailjs
          .send("service_auk0swb", "template_h045ygh", params)
          .then(console.log("Yess"));

        navigate("/feedpost");
        toast.success(`Your Complaint is registered`, {
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
      toast.error("Check all field must need to be fill.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
    }
  };

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

  const [rating, setRating] = useState(0); // State to hold the rating value

  // Function to handle star click and update the rating state
  const handleStarClick = (index) => {
    setRating(index + 1); // Ratings are 1-based
  };

  // Generate stars based on the current rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`w-6 h-6 cursor-pointer ${
        index < rating ? "text-yellow-500" : "text-gray-400"
      }`}
      onClick={() => handleStarClick(index)}
      xmlns="http://www.w3.org/2000/svg"
      fill={`${index < rating ? "yellow" : "none"}`}
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  ));
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

              <div
                class="p-2 w-full"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex items-center">{stars}</div>
              </div>

              <div class="p-2 w-full flex sm:flex-row flex-col justify-between items-center">
                <button
                  onClick={feedbackwithmoney}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  style={{ backgroundColor: "green" }}
                >
                  Work Done
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default UserFeedbackPost;
