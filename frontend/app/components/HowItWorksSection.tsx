export default function HowItWorksSection() {
    return (
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Sol-Walk
            </span>{" "}
            Works
          </h2>
  
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 h-full">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 text-xl font-bold text-purple-400">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Join Challenge</h3>
                <p className="text-gray-300">
                  Choose a challenge type and stake your SOL tokens. Set your personal goal and timeframe.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
            </div>
  
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 h-full">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-xl font-bold text-blue-400">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Sync Steps</h3>
                <p className="text-gray-300">
                  Connect your fitness tracker or manually log your activity. Our smart contracts verify your progress.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>
  
            {/* Step 3 */}
            <div>
              <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 h-full">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-xl font-bold text-green-400">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Earn or Forfeit</h3>
                <p className="text-gray-300">
                  Complete your goal to earn back your stake plus rewards, or forfeit your stake to the community pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  