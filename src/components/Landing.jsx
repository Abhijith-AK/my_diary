import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaLock, FaMapSigns, FaSmile } from 'react-icons/fa';

const Landing = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    })
      .to(descRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, "-=0.4")
      .to(buttonRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });

    gsap.to(cardsRef.current, {
      opacity: 1,
      y: 0,
      stagger: 0.3,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const features = [
    { icon: <FaLock size={50} className="text-black" />, title: 'Password Protection', description: 'Secure your diary entries with top-grade encryption and password protection.' },
    { icon: <FaMapSigns size={50} className="text-black" />, title: 'Easy Navigation', description: 'Easily navigate through your diary with an intuitive calendar view.' },
    { icon: <FaSmile size={50} className="text-gray-800" />, title: 'User-Friendly Design', description: 'Enjoy a beautifully crafted design for a seamless diary experience.' }
  ];

  return (
    <div style={{
      background: "url('https://media.istockphoto.com/id/1325366417/vector/continuous-one-line-drawing-opened-book-education-study-and-knowledge-library-concept-vector.jpg?s=612x612&w=0&k=20&c=Zw2N9J3PPkcTC4FSJTwkk4zgk3jEgq1xsZs3DVTB-cg=') center no-repeat",
      backgroundSize: 'fit'
    }} className="min-h-screen flex flex-col justify-center items-center text-center bg-[#f3f4f6] text-black px-8">
      <h1 ref={titleRef} className="text-3xl pt-32 md:pt-0 md:text-7xl font-bold mb-6 opacity-0 translate-y-[-50px] drop-shadow-md">
        Welcome to My Diary App
      </h1>
      <p ref={descRef} className="text-xl max-w-2xl mb-8 opacity-0 translate-y-[50px]">
        Record your thoughts, ideas, and memories with complete privacy and security.
      </p>
      <Link to="/auth">
        <button ref={buttonRef} className="px-10 py-5 text-xl bg-black hover:bg-gray-800 transition-all text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl hover:scale-110  duration-500 opacity-0 scale-0">
          Get Started
        </button>
      </Link>

      {/* Features Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div key={index} ref={el => cardsRef.current[index] = el} className="p-8 bg-white rounded-2xl shadow-xl border border-gray-300 text-center opacity-0 translate-y-[50px] transform hover:scale-105 transition duration-500">
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-700">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
