"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, Star } from "lucide-react";

import KanbaskWhite from "~/kanbask-white.svg";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AuroraText } from "@/components/magicui/aurora-text";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { featureCards, stats, testimonials, quotes, subQuotes } from "@/data/landing-page-data";

export default function LandingPage() {
  // Add state for selected quotes
  const [selectedQuote, setSelectedQuote] = useState("");
  const [selectedSubQuote, setSelectedSubQuote] = useState("");

  // Select quotes on client-side only
  useEffect(() => {
    // Select random quotes
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomSubQuote = subQuotes[Math.floor(Math.random() * subQuotes.length)];

    // Update state
    setSelectedQuote(randomQuote);
    setSelectedSubQuote(randomSubQuote);
  }, []);

  return (
    <>
      {/* Fixed background */}
      <FlickeringGrid
        className="fixed top-0 left-0 h-full w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100"
        color="#219ebc"
      />

      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-20">
        <Card className="w-[101%] p-4 rounded-none shadow-lg backdrop-blur-md bg-prussian-blue text-white -m-0.5">
          <CardContent className="w-full flex items-center justify-between p-0">
            <Image src={KanbaskWhite} alt="Kanbask Logo" width={160} priority />
            <div className="flex items-center gap-2 px-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="rounded-full font-semibold text-black bg-mustard hover:bg-mustard/70"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="rounded-full ml-2 font-semibold text-black bg-mustard hover:bg-mustard/70"
                >
                  Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="relative z-10 pt-24 w-full min-h-full overflow-y-auto">
        {/* Hero section */}
        <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 md:px-8">
          <div className="w-4xl text-center space-y-6 md:space-y-8">
            <Badge className="px-4 py-2 text-sm mb-4">Task Management Reimagined</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight h-[120px]">
              <WordRotate words={quotes} duration={4000}>
                <TextAnimate className="">{selectedQuote}</TextAnimate>
              </WordRotate>
            </h1>
            <WordRotate words={subQuotes} duration={4000}>
              <TextAnimate className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto">
                {selectedSubQuote || subQuotes[0]}
              </TextAnimate>
            </WordRotate>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/login">
                <InteractiveHoverButton className="rounded-full text-lg bg-mustard">
                  Get Started
                </InteractiveHoverButton>
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <NumberTicker className="text-3xl font-bold" value={stat.value} />
                  <span className="text-gray-600">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Spotlight Feature Section with BoxReveal animation */}
        <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-white to-ghost-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Left side: Image with shadow effect */}
              <div className="flex-1 w-full relative">
                <div className="absolute -inset-4 bg-sky-blue/30 rounded-2xl blur-xl"></div>
                <div className="relative">
                  <Image
                    src="/images/feature-image.jpg"
                    alt="Kanbask Performance Dashboard"
                    width={800}
                    height={700}
                    className="rounded-xl shadow-2xl object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Right side: Content with BoxReveal animations */}
              <div className="flex-1 space-y-6">
                <BoxReveal boxColor="#023047">
                  <Badge className="px-4 py-2 text-sm mb-4">Lightning Fast</Badge>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.1}>
                  <h2 className="text-4xl md:text-5xl font-bold pb-2">
                    Performance Without&nbsp;
                    <AuroraText>Compromise</AuroraText>
                  </h2>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.2}>
                  <p className="text-lg text-gray-600 mt-4">
                    Kanbask is engineered for speed at every level. From initial load to complex
                    operations, our optimized architecture ensures your team stays productive
                    without waiting.
                  </p>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.3}>
                  <ul className="space-y-3 mt-6">
                    {[
                      "Instant updates with React Server Components",
                      "Optimized database queries for large projects",
                      "Edge-optimized global infrastructure"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.4}>
                  <Link href="/auth/login">
                    <InteractiveHoverButton className="mt-8 rounded-full text-lg px-6 py-3 bg-mustard hover:bg-mustard/80">
                      Explore Performance Features
                    </InteractiveHoverButton>
                  </Link>
                </BoxReveal>
              </div>
            </div>
          </div>
        </section>

        {/* AI Search Spotlight Section */}
        <section className="py-24 px-4 md:px-8 bg-gradient-to-b mt-8 from-ghost-white to-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              {/* Right side: Image with shadow effect */}
              <div className="flex-1 w-full relative">
                <div className="absolute -inset-4 bg-sky-blue/30 rounded-2xl blur-xl"></div>
                <div className="relative">
                  <Image
                    src="/images/search-image.jpg"
                    alt="Kanbask AI-Powered Search"
                    width={800}
                    height={700}
                    className="rounded-xl shadow-2xl object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Left side: Content with BoxReveal animations */}
              <div className="flex-1 space-y-6">
                <BoxReveal boxColor="#023047">
                  <Badge className="px-4 py-2 text-sm mb-4">AI-Powered</Badge>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.1}>
                  <h2 className="text-4xl md:text-5xl font-bold pb-2">
                    Find Anything in&nbsp;
                    <AuroraText>Seconds</AuroraText>
                  </h2>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.2}>
                  <p className="text-lg text-gray-600 mt-4">
                    Our intelligent search understands what you need before you finish typing.
                    Natural language processing helps you locate tasks, comments, and files across
                    your entire workspace.
                  </p>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.3}>
                  <ul className="space-y-3 mt-6">
                    {[
                      "Natural language understanding for contextual results",
                      "Find content across all projects with a single query",
                      "Personalized results based on your work patterns"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </BoxReveal>

                <BoxReveal boxColor="#023047" delay={0.4}>
                  <Link href="/auth/login">
                    <InteractiveHoverButton className="mt-8 rounded-full text-lg px-6 py-3 bg-mustard hover:bg-mustard/80">
                      Try Smart Search
                    </InteractiveHoverButton>
                  </Link>
                </BoxReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="flex flex-col items-center justify-center py-16 mt-12 px-4 md:px-8 bg-gradient-to-r from-sky-blue/50 to-sky-blue/80">
          <Badge className="px-4 py-2 text-sm mb-4 relative z-10">Powerful Features</Badge>
          <TextAnimate className="text-4xl font-bold mb-4 text-center relative z-10">
            Everything You Need
          </TextAnimate>
          <TextAnimate className="text-lg text-gray-700 max-w-2xl text-center mb-10 relative z-10">
            Streamline your workflow with our intuitive tools designed for maximum productivity
          </TextAnimate>

          <BentoGrid className="max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {featureCards.map((feature, index) => (
              <BentoCard key={index} {...feature} />
            ))}
          </BentoGrid>
          <Link href="/auth/login">
            <InteractiveHoverButton
              variant="outline"
              className="mt-12 rounded-full bg-mustard hover:bg-mustard/80 relative z-10 shadow-lg"
            >
              Explore All Features
            </InteractiveHoverButton>
          </Link>
        </div>
        {/* Testimonials section */}
        <div className="flex flex-col items-center justify-center py-16 mt-12 px-4 md:px-8 bg-ghost-white">
          <Badge className="px-4 py-2 text-sm mb-4">Testimonials</Badge>
          <TextAnimate className="text-4xl font-bold mb-4 text-center">
            What Our Users Say
          </TextAnimate>
          <TextAnimate className="text-lg text-gray-600 max-w-2xl text-center mb-10">
            Join thousands of teams who have transformed their workflow with Kanbask
          </TextAnimate>

          <Marquee className="py-4 max-w-7xl" pauseOnHover={true} speed={40}>
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="mx-4 p-6 w-[350px] bg-white shadow-lg rounded-xl border border-gray-100"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">{`"${testimonial.quote}"`}</p>
                </CardContent>
                <CardFooter className="flex items-center pt-2 border-t border-gray-100">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} className="object-cover"/>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </Marquee>
          <Link href="/auth/login">
            <InteractiveHoverButton
              size="lg"
              className="mt-10 rounded-full bg-mustard  hover:bg-mustard/80"
            >
              Read More Reviews
            </InteractiveHoverButton>
          </Link>
        </div>
        {/* footer */}
        <footer className="flex flex-col items-center justify-center py-8 mt-8 px-4 md:px-8 bg-gray-50">
          <div className="flex space-x-4">
            <a href="/privacy-policy" className="text-gray-600 hover:text-gray-800">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-600 hover:text-gray-800">
              Terms of Service
            </a>
            <a href="/about-us" className="text-gray-600 hover:text-gray-800">
              About Us
            </a>
          </div>
          <div className="mt-4 text-gray-600">
            <p>&copy; {new Date().getFullYear()} Kanbask. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
