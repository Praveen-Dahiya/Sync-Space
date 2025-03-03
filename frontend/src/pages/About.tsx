import { Code, Heart, Cpu, Github, Linkedin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Sync Space
          </h1>
          <p className="text-xl text-gray-700">
            A real-time collaborative drawing platform that enables teams 
            to create, share, and collaborate on digital canvases.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Mission Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-red-100 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in making creative collaboration accessible to everyone. Our
              platform combines powerful drawing tools with real-time collaboration
              features to help teams work better together no matter where they are located.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Sync Space was built to bridge the gap between design thinking and team collaboration,
              enabling faster ideation and more efficient creative workflows.
            </p>
          </div>

          {/* Technology Stack */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-blue-100 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Cpu className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="bg-blue-100 p-1 rounded-full mr-2">
                  <Code className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">React with TypeScript for a robust frontend</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-100 p-1 rounded-full mr-2">
                  <Code className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Node.js and Express for the backend</span>
              </li>
              <li className="flex items-center">
                <div className="bg-yellow-100 p-1 rounded-full mr-2">
                  <Code className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-gray-700">MongoDB for data persistence</span>
              </li>
              <li className="flex items-center">
                <div className="bg-purple-100 p-1 rounded-full mr-2">
                  <Code className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Socket.IO for real-time collaboration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-8xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Developer</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 mb-4 md:mb-0 md:mr-8 overflow-hidden border-4 border-blue-100">
              <img 
                src="https://avatars.githubusercontent.com/u/59509985?v=4&size=1024" 
                alt="Praveen Dahiya"
                className="w-full h-full object-cover object-center" 
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Praveen Dahiya</h3>
              <p className="text-gray-700 mb-4">
                Full-stack developer passionate about creating intuitive, collaborative tools 
                that enhance creativity and productivity. Sync Space is built with a focus on 
                real-time performance and seamless user experience.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.linkedin.com/in/praveendahiya/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn Profile
                </a>
                <a 
                  href="https://github.com/Praveen-Dahiya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;