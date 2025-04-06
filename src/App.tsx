import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import ImageGenerate from './components/ImageGenerate'

function App() {
  const [currentPage, setCurrentPage] = useState('generate');

  useEffect(() => {
    setCurrentPage('generate');
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '80px' }}>
      <Header />
      <h1 className="text-4xl font-bold text-pink-500 text-center mb-12">
        Dark Forest MUD Invitation
      </h1>
      {/* <div className="flex justify-center mb-16">
        <div className="flex space-x-4">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentPage === 'process'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
              }`}
            onClick={() => setCurrentPage('process')}
          >
            Image Process
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentPage === 'generate'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
              }`}
            onClick={() => setCurrentPage('generate')}
          >
            Image Generate
          </button>
        </div>
      </div> */}
      <div className="container mx-auto px-6 mb-24">
        <div className="min-h-[500px] bg-gray-50 rounded-lg p-8">
          {currentPage === 'process' ? (
            <div className="text-center text-gray-600">
              Image Processing Content
            </div>
          ) : (
            <ImageGenerate />
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default App
