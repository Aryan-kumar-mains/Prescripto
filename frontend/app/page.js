import CategorySearch from "./_components/2home/CategorySearch";
import FeaturedDoctor from "./_components/2home/FeaturedDoctor";
import FeedbackCarousel from "./_components/2home/FeedbackCarousel";
import Hero from "./_components/2home/Hero";


export default function Home() {
  
  return (
    <div>
      <Hero/>
      <CategorySearch/>
      <FeaturedDoctor/>
      <FeedbackCarousel/>
    </div>
  );
}
