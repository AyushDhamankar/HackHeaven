import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import emailjs from "@emailjs/browser";

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function CreateComplaint({ state }) {
  const [id, setId] = useState("");
  const [img, setImg] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  const form = useRef();

  const register_complaint = async (event) => {
    event.preventDefault();
    console.log(title, description, location);
    try {
      if (title !== "" && description !== "" && location !== "") {
        const { keypair, program, baseAccount } = state;

        // Get recent blockhash
        const recentBlockhash = await connection.getRecentBlockhash();
        console.log("Recent blockhash:", recentBlockhash);

        const email = window.localStorage.getItem("email");
        console.log(img, title, description, location, "5", email);

        // Construct transaction
        const transaction = new Transaction({ recentBlockhash }).add(
          await program.instruction.createPost(
            img,
            title,
            description,
            location,
            "5",
            email,
            {
              accounts: {
                clock: SYSVAR_CLOCK_PUBKEY,
                baseAccount: baseAccount.publicKey,
              },
            }
          )
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
          status: "Under Review"
        }
        emailjs.send("service_auk0swb","template_h045ygh",params).then(console.log("Yess"))

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

  useEffect(() => {
    const emailid = window.localStorage.getItem("email");
    console.log(emailid);
    setEmail(emailid);
  }, [email]);

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
            CREATE COMPLAINT
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              Submit grievance by filling out all the fields below. Please fill
              the form correctly as the details entered will be used for further
              processing of your grievance.
            </p>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              <input
                type="file"
                name=""
                id=""
                placeholder="Image"
                className="w-full border rounded-xl  py-4 px-4 outline-none"
                style={{ marginBottom: "10px" }}
                multiple
                onChange={handleFileChange}
              />

              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select an option
              </label>
              <select
                id="countries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                class="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                style={bgcolor}
              >
                <option> </option>
                <option> Health and Sanitation Issues </option>
                <option> Infrastructure and Utilities </option>
                <option> Quality of Life Issues </option>
              </select>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="message" class="leading-7 text-sm text-gray-400">
                    Description
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    onChange={(e) => setDescription(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="message" class="leading-7 text-sm text-gray-400">
                    Location
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    onChange={(e) => setLocation(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Email
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    name="name"
                    value={email}
                    readOnly
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <button
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={register_complaint}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default CreateComplaint;
