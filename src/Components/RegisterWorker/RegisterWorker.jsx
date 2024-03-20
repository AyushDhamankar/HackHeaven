import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function RegisterWorker({ state1 }) {
  const [fullname, setFullname] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [mob, setMob] = useState("");
  const [location, setLocation] = useState("");
  const [empid, setEmpid] = useState("");
  console.log(state1);

  const register_user = async (event) => {
    event.preventDefault();
    try {
      if (
        empid !== "" &&
        fullname !== "" &&
        email !== "" &&
        department !== "" &&
        location !== "" &&
        mob !== ""
      ) {
        const { provider, program, baseAccount } = state1;
        console.log(fullname,
          department,
          email,
          mob,
          location,
          empid,);
          console.log(provider.wallet.publicKey);
        const tx = await program.rpc.registerGovernmentUser(
          fullname,
          department,
          email,
          mob,
          location,
          empid,
          {
            accounts: {
              baseAccount: baseAccount.publicKey,
              signer: provider.wallet.publicKey,
            },
          }
        );
        console.log(tx);
        toast.success(`You are now registered as government worker`, {
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

  // Change Owner Function
  const owner = async (event) => {
    event.preventDefault();
    const { provider, program, baseAccount } = state1;
    const tx = await program.rpc.owner({
        accounts: {
          baseAccount: baseAccount.publicKey,
          signer: provider.wallet.publicKey,
        },
      }
    );
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
          autocomplete="off"
        >
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              REGISTER GOVERNMENT WORKER
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              Submit grievance by filling out all the fields below. Please fill
              the form correctly as the details entered will be used for further
              processing of your grievance.
            </p>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Government Employee ID
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    name="name"
                    onChange={(e) => setEmpid(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    autocomplete="off"
                    id="name"
                    name="name"
                    onChange={(e) => setFullname(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select an Department
              </label>
              <select
                id="countries"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                class="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                style={bgcolor}
              >
                <option> Health and Sanitation Issues </option>
                <option> Infrastructure and Utilities </option>
                <option> Quality of Life Issues </option>
              </select>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="email" class="leading-7 text-sm text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email_id"
                    onChange={(e) => setEmail(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="email" class="leading-7 text-sm text-gray-400">
                    Mobile No
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email_id"
                    onChange={(e) => setMob(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <div class="relative">
                  <label for="email" class="leading-7 text-sm text-gray-400">
                    Location
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email_id"
                    onChange={(e) => setLocation(e.target.value)}
                    class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="p-2 w-full">
                <button
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={register_user}
                >
                  Submit
                </button>

                {/* Change Owner Button */}
                {/* <button
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={owner}
                >
                  Change Owner
                </button> */}
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default RegisterWorker;
