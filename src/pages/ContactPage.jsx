export default function ContactPage() {
  return (
    <div className="min-h-screen px-4 py-12 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        
        <p className="text-lg mb-8 text-center">
          We'd love to hear from you! Whether you're a user, a venue partner, or someone with an idea to improve the city experience, feel free to reach out.
        </p>

        <form className="space-y-6 bg-gray-100 p-8 rounded-xl shadow-md">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" placeholder="Your name" className="w-full p-3 rounded border border-gray-300" />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full p-3 rounded border border-gray-300" />
          </div>

          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea placeholder="Type your message..." className="w-full p-3 h-32 rounded border border-gray-300"></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Email: mycitiverse@gmail.com</p>
          <p className="text-gray-600">Phone: +91-8970089077</p>
        </div>
      </div>
    </div>
  );
}
