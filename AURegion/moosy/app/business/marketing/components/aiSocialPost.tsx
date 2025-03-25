'use client'
import { useState, useRef } from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaUpload, FaRobot, FaCopy } from 'react-icons/fa';
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected: boolean;
}

export default function AiSocialPost({ close }: { close: () => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    { id: 'instagram', name: 'Instagram', icon: <FaInstagram size={24} />, selected: false },
    { id: 'twitter', name: 'Twitter', icon: <FaTwitter size={24} />, selected: false },
    { id: 'facebook', name: 'Facebook', icon: <FaFacebook size={24} />, selected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin size={24} />, selected: false },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map(platform => 
      platform.id === id ? { ...platform, selected: !platform.selected } : platform
    ));
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      const selectedPlatformsNames = platforms
        .filter(p => p.selected)
        .map(p => p.name)
        .join(', ');
      
      setGeneratedContent(
        `✨ Check out our latest product! ✨\n\n${description}\n\n` +
        `#innovation #business #growth ${selectedPlatformsNames.toLowerCase().split(' ').join('')}`
      );
      
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  return (
      <div className="min-h-screen bg-white text-black">
        <div className="max-w-6xl mx-auto p-6">
          <button 
            onClick={close}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg 
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 className="text-3xl font-bold mb-8 border-b pb-4">AI Social Post Creator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Upload and Description */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {image ? (
                  <div className="relative">
                    <img 
                      src={image} 
                      alt="Uploaded preview" 
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button 
                      onClick={triggerFileInput}
                      className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileInput}
                    className="cursor-pointer py-12"
                  >
                    <FaUpload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">Click to upload an image</p>
                    <p className="text-gray-400 text-sm mt-2">JPG, PNG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={5}
                  placeholder="Describe your post or product..."
                />
              </div>
              
              {/* Social Platforms */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Platforms
                </label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                        platform.selected 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      } transition-colors`}
                    >
                      {platform.icon}
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Generated Content */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Generated Content</h2>
                  <button
                    onClick={generateContent}
                    disabled={isGenerating || !description || platforms.filter(p => p.selected).length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      isGenerating || !description || platforms.filter(p => p.selected).length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    } transition`}
                  >
                    <FaRobot />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                
                {isGenerating ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-center">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 whitespace-pre-line p-4 bg-white border border-gray-200 rounded-md">
                      {generatedContent}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition"
                      >
                        <FaCopy />
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
                    <div>
                      <p>Your AI-generated content will appear here</p>
                      <p className="text-sm mt-2">Fill in the description and select platforms, then click Generate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
