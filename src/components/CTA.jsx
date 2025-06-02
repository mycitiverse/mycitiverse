import Button from "./ui/Button"

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to explore your city?
          </h2>
          
          {/* Supporting text */}
          <p className="text-lg text-blue-100">
            Join thousands discovering the best events and experiences in their area.
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              className="text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}