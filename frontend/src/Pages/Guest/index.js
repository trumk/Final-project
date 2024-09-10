import Footer from "../../Components/Footer";
import Hero from "../../Components/Hero/Hero";
import Navbar from "../../Components/Navbar/index"
import MainContent from "../../Components/MainContent/Content"

function Homepage() {
    return (
      <div>
      <Navbar/>
      <Hero/>
      <MainContent/>
      <Footer/>
    </div>
    );
  }
  
  export default Homepage;