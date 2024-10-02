import Footer from "../../Components/Footer";
import Hero from "../../Components/Hero/Hero";
import Navbar from "../../Components/Navbar/index"
import MainContent from "../../Components/MainContent/Content"
import AIChat from "../../Components/AiChat";

function Homepage() {
    return (
      <div>
      <Navbar/>
      <Hero/>
      <MainContent/>
      <AIChat/>
      <Footer/>
    </div>
    );
  }
  
  export default Homepage;