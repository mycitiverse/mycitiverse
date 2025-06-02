import Button from "./ui/Button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            MyCitiverse
          </h1>
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold leading-tight" style={{color: 'yellow'}}>
            (Coming Soon)
          </h2>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            One App, Every Corner of Your City
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
              Explore Events
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
              Organize Yours
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}