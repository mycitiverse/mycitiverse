import { Calendar, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Discover Local Events",
      description: "Find concerts, workshops, and meetups happening near you with our curated event discovery."
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Book Instantly",
      description: "Secure your spot in seconds with our seamless booking system. No waiting, no hassle."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      description: "Create and manage your own events with our intuitive tools. Focus on your event, not the paperwork."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader className="items-center">
                <div className="p-3 bg-blue-50 rounded-full">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-center mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}