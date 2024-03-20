import { useEffect, useState } from "react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "../Smart Contract/idl.json";
import kp from "../Smart Contract/keypair.json";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";

// Destructuring web3 objects
const { SystemProgram } = web3;

// Set Buffer globally
window.Buffer = Buffer;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// Initialize program ID
const programID = new PublicKey(idl.metadata.address);

// Initialize endpoint
const endpoint =
  "https://solana-devnet.g.alchemy.com/v2/5_Mpt8xd4uhahETZ0i38gMBjrmS9WAwX";

// Initialize connection to Solana blockchain
const connection = new Connection(endpoint, {
  commitment: "confirmed",
});

// Options for establishing connection
const opts = {
  preflightCommitment: "confirmed",
};

function NavbarwithoutWallet({ saveStateforUser }) {
  const navigate = useNavigate();
  // Function to create a keypair from a private key
  const createKeypairFromPrivateKey = () => {
    // Your private key
    const privateKeyBytes = bs58.decode(
      "3MFs4bdBtPdQNyn1RqcbUchLEGB8hp8vm9TjYFshxSsokoZ1YWP4QAGTMPiYoGP1qpcmvMX12NoBJaVeLDZJ56Yi"
    );
    // Create a Keypair from the private key
    const keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyBytes));
    console.log(keypair);
    return keypair;
  };

  // Function to get Anchor provider
  const getProvider = () => {
    const keypair = createKeypairFromPrivateKey();
    const provider = new AnchorProvider(
      connection,
      keypair,
      opts.preflightCommitment
    );
    console.log(provider);
    return provider;
  };

  const setsaveState = () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const keypair = createKeypairFromPrivateKey();
    saveStateforUser({
      keypair: keypair,
      program: program,
      baseAccount: baseAccount,
    });
    console.log("saveStateforUser", keypair, program, baseAccount);
  };

  useEffect(() => {
    setsaveState();
    const email = window.localStorage.getItem("email");
    setEmail(email);
  }, []);

  const [emailcheck, setEmail] = useState("");

  const handleLogout = () => {
    setEmail("");
    window.localStorage.removeItem("email");
  };

  const styles = {
    minHeight: "10vh",
  };

  return (
    <header class="text-gray-400 bg-gray-900 body-font">
      <div
        class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
        style={styles}
      >
        <Link
          to="/"
          class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#6366f1"
            style={{ height: "35px" }}
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M21.15,5.89A11,11,0,1,0,23,12,11,11,0,0,0,21.15,5.89ZM19.48,17A9,9,0,1,1,21,12,9,9,0,0,1,19.48,17ZM15,11V9A3,3,0,0,0,9,9v2a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V12a1,1,0,0,0-1-1Zm-1.5,0h-3V9a1.5,1.5,0,0,1,3,0Z"></path>
              <path
                d="M19.29,15.06a.93.93,0,0,0,.18-.26.78.78,0,0,0,.07-.31.78.78,0,0,0-.07-.3.93.93,0,0,0-.18-.26.76.76,0,0,0-.28-.15.8.8,0,0,0-.31,0,.7.7,0,0,0-.37.11.77.77,0,0,0-.26.28H16v.7h2.05a.69.69,0,0,0,.27.29.73.73,0,0,0,.38.11.8.8,0,0,0,.31,0A.76.76,0,0,0,19.29,15.06ZM19,14.49a.27.27,0,0,1-.28.28.22.22,0,0,1-.11,0,.28.28,0,0,1-.15-.15.22.22,0,0,1,0-.11.27.27,0,0,1,.28-.28.2.2,0,0,1,.11,0,.21.21,0,0,1,.1.06.18.18,0,0,1,.06.09.2.2,0,0,1,0,.11Zm.26-3.94,1.32-1.32q.12.39.21.78l-1.25,1.24H17.79V12h-.7v-1.4ZM9.8,19h.69v1.14l-.55.56c-.26-.06-.52-.13-.77-.21l.63-.63Zm2.56-.61V17h-.7v1.43a.8.8,0,0,0-.29.26.7.7,0,0,0-.11.37.75.75,0,0,0,.75.75.87.87,0,0,0,.28,0,.82.82,0,0,0,.25-.16.78.78,0,0,0,.16-.24.67.67,0,0,0,.06-.28.74.74,0,0,0-.4-.65Zm-.15.83a.28.28,0,0,1-.48-.2.27.27,0,0,1,.28-.28.28.28,0,0,1,.2.48ZM21,12a1.49,1.49,0,0,1,0,.21l-1,1H16v-.7h3.7L21,11.25C21,11.5,21,11.75,21,12ZM14.84,8.09l3-3a5.8,5.8,0,0,1,.52.47L15,8.93A2.65,2.65,0,0,0,14.84,8.09ZM5.3,13.75a.82.82,0,0,0-.31,0,.76.76,0,0,0-.28.15.93.93,0,0,0-.18.26.78.78,0,0,0-.07.3.78.78,0,0,0,.07.31.93.93,0,0,0,.18.26.76.76,0,0,0,.28.15.82.82,0,0,0,.31,0,.74.74,0,0,0,.65-.4H8v-.7H6a.76.76,0,0,0-.3-.29A.79.79,0,0,0,5.3,13.75Zm.18.92a.27.27,0,0,1-.19.08l-.1,0a.21.21,0,0,1-.1-.06A.18.18,0,0,1,5,14.58a.2.2,0,0,1,0-.11.43.43,0,0,1,0-.11l.06-.09.09-.06.11,0a.28.28,0,0,1,.2.48Zm11.61,1.76L18.69,18c-.16.17-.33.32-.5.48l-1.38-1.37H15.65v1.54l1,1c-.21.12-.43.22-.65.33L15,19V17.13H14v1.44h-.7V17H15a.92.92,0,0,0,.89-.57ZM12,4.1a.75.75,0,0,0-.53.22.71.71,0,0,0-.22.52.81.81,0,0,0,.12.38.78.78,0,0,0,.29.28V6L12,6a2.2,2.2,0,0,1,.36,0V5.5a.78.78,0,0,0,.29-.28.7.7,0,0,0,.11-.38.79.79,0,0,0-.24-.52A.82.82,0,0,0,12,4.1Zm.23.9a.29.29,0,0,1-.12.1.22.22,0,0,1-.16,0,.24.24,0,0,1-.22-.22.22.22,0,0,1,0-.16.29.29,0,0,1,.1-.12A.3.3,0,0,1,12,4.56l.11,0,.09.06.06.09a.43.43,0,0,1,0,.11A.3.3,0,0,1,12.23,5ZM9,17h.05v1.94L8,20c-.22-.11-.42-.23-.63-.35l1-1V17.52l-.81.82H5.93v.28a3.58,3.58,0,0,1-.29-.26c-.15-.14-.27-.31-.41-.47v-.25h2l1-1a.56.56,0,0,0,0,.08A1,1,0,0,0,9,17ZM4.18,13.21,3,12.05c0-.33,0-.65,0-1l1.44,1.43H8v.7Zm1-4.8a.73.73,0,0,0,.2.35.72.72,0,0,0,1,0,.75.75,0,0,0,0-1,.75.75,0,0,0-.72-.19l-.9-.93c-.14.18-.27.36-.39.55L5.23,8A.71.71,0,0,0,5.22,8.41ZM5.74,8a.29.29,0,0,1,.38,0,.28.28,0,0,1,.08.2.27.27,0,0,1-.08.19.29.29,0,0,1-.38,0,.35.35,0,0,1-.06-.19A.36.36,0,0,1,5.74,8Zm2.35,8.41H4.43l-.16.16c-.12-.21-.24-.41-.34-.63l.23-.23H8V16A1.16,1.16,0,0,0,8.09,16.41ZM14,19.25,15,20.3v.15c-.23.08-.46.17-.7.23V20.6l-.86-.86ZM17.67,8a.68.68,0,0,0-.35.17.75.75,0,0,0,0,1,.75.75,0,0,0,1,0,.79.79,0,0,0,.18-.72l1.15-1.15c-.12-.19-.24-.38-.37-.56L18.05,8A.7.7,0,0,0,17.67,8Zm.46.68a.22.22,0,0,1,0,.11.41.41,0,0,1-.05.09.24.24,0,0,1-.09.06.31.31,0,0,1-.22,0,.24.24,0,0,1-.09-.06.29.29,0,0,1,0-.38.32.32,0,0,1,.19-.07.31.31,0,0,1,.18.07.27.27,0,0,1,.07.08A.38.38,0,0,1,18.13,8.66Zm1.36,7.17.42.42c-.12.21-.23.43-.36.63L19,16.32ZM4.72,11,3.33,9.63c.07-.24.15-.49.24-.73L5,10.32H6.44V9.67h.7V11Zm9.62-6.71h-.7V3.16c.24,0,.47.1.7.16Zm.56,1.51a.53.53,0,0,0,.28.07.72.72,0,0,0,.32-.08.67.67,0,0,0,.26-.21.73.73,0,0,0,.14-.31.74.74,0,0,0,0-.33l.7-.7-.65-.35-.54.54a.74.74,0,0,0-.39,0,.63.63,0,0,0-.33.2.75.75,0,0,0,0,1A.58.58,0,0,0,14.9,5.82ZM15,5a.29.29,0,0,1,.38,0,.24.24,0,0,1,.06.09.31.31,0,0,1,0,.22.24.24,0,0,1-.06.09.29.29,0,0,1-.38,0A.29.29,0,0,1,15,5ZM9.36,3.4l1.46,1.47V6.25a3,3,0,0,0-.7.43V5.15L8.65,3.67A7.46,7.46,0,0,1,9.36,3.4ZM8.12,5.51l-1-1c.2-.13.41-.24.63-.36l.9.9ZM6.19,5.15l3,3A3.36,3.36,0,0,0,9,9L5.68,5.62C5.84,5.46,6,5.3,6.19,5.15Z"
                opacity="0.5"
              ></path>
              <rect width="24" height="24" fill="none"></rect>
            </g>
          </svg>
          <span class="ml-1 text-xl">CryptoJustice</span>
        </Link>
        <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link to="/create" class="mr-5 hover:text-white">
            Create
          </Link>
          <Link to="/post" class="mr-5 hover:text-white">
            My Post
          </Link>
          <Link to="/feedpost" class="mr-5 hover:text-white">
            Feedback
          </Link>
        </nav>
        {emailcheck != "" && emailcheck != undefined ? (
          <button
            class="inline-flex items-center bg-indigo-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <Link
            class="inline-flex items-center bg-indigo-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
            to="/login"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
}

export default NavbarwithoutWallet;
