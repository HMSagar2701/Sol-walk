export default function TestimonialsSection() {
    return (
      <section id="testimonials" className="py-20 md:py-32 relative">
        {/* Decorative Background Blur */}
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-[100px] pointer-events-none z-0" />
  
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands who have transformed their fitness habits with Sol-Walk.
            </p>
          </div>
  
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                initials: "JD",
                name: "Jake D.",
                note: "Lost 15 lbs in 3 months",
                quote:
                  "Putting my SOL on the line was the motivation I needed. I've never stuck with a fitness program this long before!",
              },
              {
                initials: "SM",
                name: "Sarah M.",
                note: "Walks 10k steps daily",
                quote:
                  "The group challenges keep me accountable. Plus, I've earned enough SOL to pay for my gym membership!",
              },
              {
                initials: "RT",
                name: "Ryan T.",
                note: "Completed 12 challenges",
                quote:
                  "I love the NFT badges I've earned. They're like digital trophies that prove my commitment to fitness.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.note}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }  