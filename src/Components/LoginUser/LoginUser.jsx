import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

// Set Buffer globally
window.Buffer = Buffer;

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

function LoginUser({ state }) {
    const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [data, setData] = useState("");
  const getData = async () => {
    try {
      const { keypair, program, baseAccount } = state;

      const data = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      setData(data.userList);
      console.log(data);
      console.log(data.userList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    console.log("Start getData");
    getData();
    console.log("End getData");
  },[state])

  const register_user = async (event) => {
    try {
      if (
        email !== "" &&
        password !== ""
      ) {
        event.preventDefault();
        // Check if data is defined and not empty
        if (data && data.length > 0) {
            let ans = data.some(user => user.email === email && user.password === password);
            if (ans) {
                console.log("Yes");
                window.localStorage.setItem("email", email);
                navigate('/post');
            } else {
                console.log("No");
            }
        } else {
            console.log("Data is empty or undefined.");
        }
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

  const styles = {
    minHeight: "90vh",
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
              LOGIN USER
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
                    Password
                  </label>
                  <input
                    type="password"
                    id="email"
                    name="email_id"
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default LoginUser;