import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Lottie from 'lottie-react';
import animationData from '../assets/welcome.json';

export default function LaunchCelebrationModal({ onClose }) {
  const [showMainModal, setShowMainModal] = useState(false);
  const [showFlashPopup, setShowFlashPopup] = useState(false);

  useEffect(() => {
    const alreadyShown = localStorage.getItem('launchCelebrationShown');

    if (!alreadyShown) {
      setShowMainModal(true);
      setShowFlashPopup(true);
      localStorage.setItem('launchCelebrationShown', 'true');

      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, []);

  if (!showMainModal && !showFlashPopup) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 overflow-y-auto">
      {/* Main Modal */}
      {showMainModal && (
        <div className="min-h-screen flex flex-col text-white animate-fadeIn relative">

          {/* Launch Banner */}
          <div className="w-full bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 text-center py-4 text-xl md:text-2xl font-extrabold shadow-md z-40">
            Welcome to MyCitiverse – One App, Every Corner of Your City!
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col items-center px-6 pb-10">
            <div className="max-w-md w-full mx-auto">
              <Lottie animationData={animationData} loop />
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                We’re Officially <span className="text-red-600">Live!</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200">
                Thank you for joining us! We sincerely appreciate your support.
              </p>
              <button
                onClick={() => setShowMainModal(false)}
                className="mt-6 bg-white text-yellow-400 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition"
              >
                🌟 Start Exploring
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-yellow-400 text-white text-center py-4 text-sm">
            ❤️ Thank you for supporting us. Let’s build something amazing together!
          </div>
        </div>
      )}

      {/* Flash Popup */}
      {showFlashPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-60">
          <div className="relative bg-white text-gray-900 px-8 py-6 rounded-xl text-center shadow-2xl animate-fadeIn border border-gray-200 max-w-lg w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowFlashPopup(false)}
              className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-red-500 transition"
              aria-label="Close flash popup"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-2">
              <span className="text-yellow-400">MyCitiverse</span> is <span className="text-red-600">Live</span>
            </h2>
            <p className="text-lg text-black">
              MyCitiverse is in its early development stage.
            </p>
            <p className="text-lg text-black">
              We’re actively working to bring more features and content.
            </p>
            <p className="text-lg text-black mt-2">
              Thank you for showing your support! ❤️
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
