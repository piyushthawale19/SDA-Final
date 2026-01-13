import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { cn } from "../../lib/utils";

const testimonials = [
  {
    id: 1,
    quote:
      "Smart Developer Assistant transformed our development workflow completely. The AI-powered tools helped us ship features 3x faster, and the deployment automation saved us countless hours every week.",
    name: "Piyush Thawale",
    role: "Project Developer",
    company: "Smart Developer Assistant",
    rating: 5,
    // Use local avatar from public folder (served at root). File: public/Auther/piyush.JPG
    avatar: "/Auther/piyush.JPG",
  },
  {
    id: 2,
    quote:
      "The best development platform we've used. It's intuitive, powerful, and has completely changed how our team collaborates on projects. Real-time collaboration is a game changer!",
    name: "Chirag Yadav",
    role: "Innovation Analyst/Manager",
    company: "Smart Developer Assistant",
    rating: 4,
    avatar: "/Auther/chirag.jpg",
  },
  {
    id: 3,
    quote:
      "Outstanding experience from start to finish. The AI features are game-changing and the support team is incredibly responsive. Highly recommend for any development team!",
    name: "Rajesh Singare",
    role: "Research Project Manager",
    company: "Smart Developer Assistant",
    rating: 3,
    avatar: "/Auther/Rajesh.jpg",
  },
  {
    id: 4,
    quote:
      "The AI code generation and real-time collaboration features have revolutionized how we work. Our productivity has increased dramatically and code quality has never been better!",
    name: "Rohan Pawar",
    role: "Documentation Manager",
    company: "Smart Developer Assistant",
    rating: 3,
    avatar:
      // "https://ui-avatars.com/api/?name=Emily+Johnson&background=ec4899&color=fff&size=200",
      "/Auther/rohan.jpg",
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isVisible } = useScrollAnimation(0.2);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      ref={ref}
      className={cn(
        "py-24 px-4 transition-all duration-700 bg-gray-900",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          {/* <span className="text-gray-400 text-lg font-medium">02</span> */}
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Trusted by <span className="text-purple-500">leading teams</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            See how forward-thinking companies use Smart Developer Assistant to
            accelerate their product development.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-purple-500/20 shadow-lg">
          <div className="grid md:grid-cols-[300px,1fr] gap-8 items-center">
            {/* Avatar */}
            <div
              className={cn(
                "transition-all duration-500",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <img
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                className="w-full aspect-[3/4] object-cover rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentTestimonial.name
                  )}&background=9333ea&color=fff&size=200`;
                }}
              />
            </div>

            {/* Content */}
            <div
              className={cn(
                "transition-all duration-500",
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <p className="text-gray-500 text-sm mb-4">0{currentIndex + 1}</p>
              <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-gray-200">
                "{currentTestimonial.quote}"
              </blockquote>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-gray-400">{currentTestimonial.role}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-purple-400">
                    {currentTestimonial.company}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: currentTestimonial.rating }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-purple-500 text-purple-500"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 mt-8">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-purple-500/30 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-purple-500/30 hover:bg-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* All Testimonial Cards Preview */}
          <div
            className={cn(
              "mt-12 transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 rounded-xl p-4 border",
                    index === currentIndex
                      ? "bg-purple-600/20 border-purple-500/50 scale-105"
                      : "bg-gray-800/30 border-purple-500/20 hover:border-purple-500/40 hover:scale-102"
                  )}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-lg object-cover border border-purple-500/30"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          testimonial.name
                        )}&background=9333ea&color=fff&size=100`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-white truncate">
                        {testimonial.name}
                      </h5>
                      <p className="text-xs text-gray-400 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-purple-500 text-purple-500"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {testimonial.quote}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-purple-500 w-8"
                      : "bg-gray-600 w-2 hover:bg-gray-500"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
