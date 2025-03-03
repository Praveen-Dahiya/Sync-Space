import { ArrowRight, Users, Zap, Palette } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Sync Space
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            Create, collaborate, and bring your ideas to life in real-time
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center mx-auto mb-16">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-blue-100 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Real-time Collaboration</h3>
            <p className="text-gray-600">Draw and create together with team members in real-time, no matter where they are located.</p>
          </div>
          
          <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-purple-100 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Powerful Tools</h3>
            <p className="text-gray-600">Access a variety of drawing tools and features designed to bring your creative vision to life.</p>
          </div>
          
          <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-green-100 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Easy to Use</h3>
            <p className="text-gray-600">Intuitive interface for seamless creativity, designed to help you focus on what matters most.</p>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mt-24 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg italic text-gray-700">
              "Sync Space has transformed how our team collaborates on design projects. The real-time features are game-changing!"
              <p className="mt-4 font-semibold text-gray-900 not-italic">- Sarah T., Design Director</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg italic text-gray-700">
              "The most intuitive collaboration tool I've ever used. Our productivity has increased dramatically since we started using Sync Space."
              <p className="mt-4 font-semibold text-gray-900 not-italic">- Michael R., Product Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;