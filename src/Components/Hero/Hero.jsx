import { Link } from "react-router-dom";
function Hero() {
  const styles = {
    minHeight: "90vh",
  };
  return (
    <section class="text-gray-400 bg-gray-900 body-font">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center" style={ styles }>
    <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 class="title-font lg:text-5xl sm:text-4xl text-3xl mb-4 font-medium text-white">Trustworthy and Credible {' '} 
        <br class="hidden lg:inline-block" />Platform
      </h1>
      <p class="mb-8 lg:text-2xl leading-relaxed">Embrace the future of secure and transparent complaint management with our blockchain-based system, guaranteeing the utmost integrity, authenticity, and immutability of your complaint records.</p>
      <div class="flex md:flex-row flex-col justify-center items-center">
        <button class="inline-flex lg:mb-0 mb-8 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"><Link to="/register" class="hover:text-white">Register FIR Now</Link></button>
        <button class="lg:ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"><Link to="/check" class="hover:text-white">View Status</Link></button>
      </div>
    </div>
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <img class="object-cover object-center rounded" alt="hero" src="https://res.cloudinary.com/darrqmepw/image/upload/v1687359876/20945597-PhotoRoom.png-PhotoRoom_vhqqdd.png" />
    </div>
  </div>
</section>
  );
}

export default Hero;