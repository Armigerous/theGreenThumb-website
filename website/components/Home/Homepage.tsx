import Hero from "./Hero/Hero";
import Parallax from "./Parallax";
import ProductFeatures from "./ProductFeatures/ProductFeatures";

const Homepage = () => {
  return (
    <>
      <section id="Home" className=" w-full">
        <Hero />
      </section>

      <section>
        <Parallax type={"product"} />
      </section>

      <section id="ProductFeatures">
        <ProductFeatures />
      </section>
      <section>
        <Parallax type={"app"} />
      </section>
    </>
  );
};

export default Homepage;
