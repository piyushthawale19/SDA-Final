import React from "react";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { cn } from "../../lib/utils";

const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    price: 29,
    description: "Perfect for individual developers and small projects.",
    features: [
      "AI Code Assistant",
      "5 Projects",
      "Basic Analytics",
      "Community Support",
      "5GB Storage",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    id: 2,
    name: "Pro",
    price: 79,
    description: "Great for growing teams and advanced projects.",
    features: [
      "Advanced AI Features",
      "Unlimited Projects",
      "Team Collaboration",
      "Priority Support",
      "100GB Storage",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: 3,
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations with specific requirements.",
    features: [
      "Everything in Pro",
      "Custom AI Models",
      "Dedicated Support",
      "SLA Guarantee",
      "Unlimited Storage",
    ],
    cta: "Contact Sales",
    highlighted: true,
  },
];

export const Pricing = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
    id="pricing"
      ref={ref}
      className={cn(
        "py-24 px-4 transition-all duration-700 bg-gray-900",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          {/* <span className="text-gray-400 text-lg font-medium">03</span> */}
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Choose your <span className="text-purple-500">perfect plan</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
            Scale with confidence. From solo developers to enterprise teams, we have the right plan for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "rounded-2xl border transition-all duration-700 overflow-hidden",
                plan.highlighted
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/50 shadow-xl shadow-purple-500/20 relative"
                  : "bg-gray-800/40 backdrop-blur-sm border-purple-500/20",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  {typeof plan.price === "number" ? (
                    <>
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </>
                  ) : (
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-8 min-h-[48px]">{plan.description}</p>

                <Button
                  className={cn(
                    "w-full",
                    plan.highlighted
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50 animate-glow-pulse"
                      : "bg-purple-600 hover:bg-purple-700"
                  )}
                >
                  {plan.cta}
                </Button>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={cn(
                        "flex items-start gap-3 transition-all duration-500",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      )}
                      style={{ transitionDelay: `${index * 150 + idx * 100}ms` }}
                    >
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
