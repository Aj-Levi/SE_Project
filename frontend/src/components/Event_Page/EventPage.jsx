import React, { useState, useEffect } from "react";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dummy historical event data
  const historicalEvent = {
    title: "The Fall of the Berlin Wall",
    description:
      "On November 9, 1989, the Berlin Wall fell, marking the beginning of the end of the Cold War. For 28 years, the wall had divided East and West Berlin, separating families and symbolizing the ideological divide between communist Eastern Europe and the democratic West.",
    images: ["./img1.jpeg", "./img2.jpeg", "./img3.webp"],
  };

  // Carousel effect with changing opacity
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % historicalEvent.images.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [historicalEvent.images.length]);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left section with text content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-400">
              {historicalEvent.title}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              {historicalEvent.description}
            </p>
            <div className="flex flex-row gap-4 pt-4">
              <button className="bg-amber-600 hover:bg-amber-700 text-gray-900 font-semibold py-3 px-6 rounded-md transition duration-300">
                Visual Experience
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-amber-400 font-semibold py-3 px-6 rounded-md transition duration-300 border border-amber-400">
                Textual Experience
              </button>
            </div>
          </div>

          {/* Right section with image carousel */}
          <div className="flex-1 relative h-[400px] w-full overflow-hidden rounded-xl shadow-2xl border border-gray-700">
            {historicalEvent.images.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden={index !== currentImageIndex}
              >
                {/* Fallback text if image doesn't load */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/1 text-amber-400">
                  {/* Optional fallback content */}
                </div>
              </div>
            ))}

            {/* Image navigation dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {historicalEvent.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-amber-400 scale-125"
                      : "bg-gray-600"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
