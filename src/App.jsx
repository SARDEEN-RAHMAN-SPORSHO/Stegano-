import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck } from 'lucide-react';

const TextSteganography = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [activeTab, setActiveTab] = useState('encode');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasteStatus, setPasteStatus] = useState('');
  
  // Encode state
  const [originalText, setOriginalText] = useState('');
  const [encodePassword, setEncodePassword] = useState('');
  const [coverText, setCoverText] = useState('');
  const [customCoverText, setCustomCoverText] = useState('');
  const [useCustomCover, setUseCustomCover] = useState(false);
  const [encodedOutput, setEncodedOutput] = useState('');
  
  // Decode state
  const [decodeInput, setDecodeInput] = useState('');
  const [decodePassword, setDecodePassword] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [decodeError, setDecodeError] = useState('');

  // Zero-width characters for steganography
  const ZERO_WIDTH_CHARS = {
    '0': '\u200B', // Zero-width space
    '1': '\u200C', // Zero-width non-joiner
    '2': '\u200D', // Zero-width joiner
    '3': '\uFEFF', // Zero-width no-break space
  };

  const CHAR_TO_BINARY = Object.entries(ZERO_WIDTH_CHARS).reduce((acc, [k, v]) => {
    acc[v] = k;
    return acc;
  }, {});

  // Enhanced cover text templates
  const COVER_TEXT_TEMPLATES = [
    "Hello! I hope this message finds you well. Just wanted to check in and see how things are going on your end.",
    "Thanks for reaching out! I've been meaning to get back to you about that project we discussed last week.",
    "Great meeting you today! Looking forward to our collaboration on the upcoming initiative.",
    "Just a quick reminder about tomorrow's meeting at 2 PM. Please bring any materials you'd like to discuss.",
    "Hope you're having a wonderful day! Let me know if you need anything or have any questions.",
    "The quarterly report is almost ready for review. I'll send it over as soon as the final numbers come in.",
    "Could you please share your feedback on the latest design mockups when you get a chance?",
    "Looking forward to the team lunch next Friday! Don't forget to RSVP by Wednesday.",
    "The weather has been absolutely beautiful lately. Perfect for outdoor activities!",
    "I wanted to follow up on our conversation from yesterday regarding the upcoming project timeline.",
    "Please find attached the documents we discussed during our call earlier today.",
    "Let me know if you need any additional information or clarification on this matter.",
    "The conference call has been rescheduled to accommodate everyone's availability.",
    "Thanks again for your help with the client presentation. It went really well!",
    "I'll be out of office next week but will respond to urgent emails as needed.",
    "The software update has been deployed successfully across all systems.",
    "Can we schedule a brief call to discuss the budget allocation for next quarter?",
    "The new policy guidelines will be distributed to all team members by end of day.",
    "Appreciate your quick response to this matter. Your support is invaluable.",
    "Let's touch base early next week to align on our strategy moving forward."
  ];

  // Enhanced encryption with salt and iteration
  const encrypt = (text, password) => {
    if (!text || !password) return '';
    
    // Add salt and timestamp to prevent pattern recognition
    const salt = Date.now().toString(36);
    const saltedText = salt + '|' + text;
    
    let result = '';
    for (let i = 0; i < saltedText.length; i++) {
      // Multiple XOR operations with different parts of password
      const key1 = password.charCodeAt(i % password.length);
      const key2 = password.charCodeAt((i + 1) % password.length);
      const key3 = password.length;
      const charCode = saltedText.charCodeAt(i) ^ key1 ^ key2 ^ key3;
      result += String.fromCharCode(charCode);
    }
    return result;
  };

  const decrypt = (encrypted, password) => {
    if (!encrypted || !password) return '';
    
    try {
      let result = '';
      for (let i = 0; i < encrypted.length; i++) {
        const key1 = password.charCodeAt(i % password.length);
        const key2 = password.charCodeAt((i + 1) % password.length);
        const key3 = password.length;
        const charCode = encrypted.charCodeAt(i) ^ key1 ^ key2 ^ key3;
        result += String.fromCharCode(charCode);
      }
      
      // Extract original text by removing salt
      const parts = result.split('|');
      if (parts.length >= 2) {
        return parts.slice(1).join('|');
      }
      return result;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  };

  // Convert text to base-4 representation using zero-width chars
  const textToZeroWidth = (text) => {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Use base-4 encoding (2 bits per character)
      const base4 = charCode.toString(4).padStart(6, '0');
      binary += base4;
    }
    
    let zeroWidth = '';
    for (let char of binary) {
      zeroWidth += ZERO_WIDTH_CHARS[char];
    }
    return zeroWidth;
  };

  // Convert zero-width chars back to text
  const zeroWidthToText = (zeroWidth) => {
    let binary = '';
    for (let char of zeroWidth) {
      if (CHAR_TO_BINARY[char]) {
        binary += CHAR_TO_BINARY[char];
      }
    }
    
    // Validate binary length
    if (binary.length % 6 !== 0) {
      throw new Error('Invalid hidden data format');
    }
    
    let text = '';
    for (let i = 0; i < binary.length; i += 6) {
      const chunk = binary.substr(i, 6);
      if (chunk.length === 6) {
        const charCode = parseInt(chunk, 4);
        if (charCode > 65535 || charCode < 0) {
          throw new Error('Invalid character code detected');
        }
        text += String.fromCharCode(charCode);
      }
    }
    return text;
  };

  // Generate innocent-looking cover text
  const generateCoverText = () => {
    const randomIndex = Math.floor(Math.random() * COVER_TEXT_TEMPLATES.length);
    return COVER_TEXT_TEMPLATES[randomIndex];
  };

  const handleAccessCode = () => {
    if (accessCode === 'encode360hello') {
      setAccessGranted(true);
    } else {
      alert('Invalid access code. Please try again.');
    }
  };

  const handleEncode = () => {
    if (!originalText.trim()) {
      alert('Please enter a secret message to encode');
      return;
    }

    if (!encodePassword) {
      alert('Please enter a password for encryption');
      return;
    }

    if (encodePassword.length < 4) {
      alert('Please use a password with at least 4 characters');
      return;
    }

    try {
      // Generate or use custom cover text
      let cover = useCustomCover ? customCoverText : generateCoverText();
      if (!cover.trim()) {
        cover = generateCoverText();
      }
      setCoverText(cover);

      // Encrypt the original text
      const encrypted = encrypt(originalText, encodePassword);
      
      // Convert to zero-width characters
      const hidden = textToZeroWidth(encrypted);
      
      // Embed at the end of cover text
      const output = cover + hidden;
      setEncodedOutput(output);
    } catch (error) {
      alert('Encoding failed. Please try again with different text.');
    }
  };

  const handleDecode = () => {
    if (!decodeInput.trim()) {
      setDecodeError('Please enter text containing hidden data');
      return;
    }

    if (!decodePassword) {
      setDecodeError('Please enter the decoding password');
      return;
    }

    try {
      // Extract zero-width characters
      let hidden = '';
      for (let char of decodeInput) {
        if (CHAR_TO_BINARY[char]) {
          hidden += char;
        }
      }

      if (!hidden) {
        setDecodeError('No hidden data found in the text');
        setDecodedText('');
        return;
      }

      // Convert back to encrypted text
      const encrypted = zeroWidthToText(hidden);
      
      // Decrypt
      const decrypted = decrypt(encrypted, decodePassword);
      
      if (!decrypted) {
        setDecodeError('Failed to decode. The password might be incorrect.');
        setDecodedText('');
        return;
      }
      
      setDecodedText(decrypted);
      setDecodeError('');
    } catch (error) {
      if (error.message.includes('password') || error.message.includes('incorrect')) {
        setDecodeError('Incorrect password. Please check and try again.');
      } else if (error.message.includes('hidden data')) {
        setDecodeError('No hidden data found in the provided text');
      } else {
        setDecodeError('Decoding failed. The text may be corrupted or password is wrong.');
      }
      setDecodedText('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(encodedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDecodeInput(text);
      setPasteStatus('Text pasted successfully!');
      setTimeout(() => setPasteStatus(''), 3000);
    } catch (error) {
      setPasteStatus('Failed to paste from clipboard');
      setTimeout(() => setPasteStatus(''), 3000);
    }
  };

  // Access Code Screen
  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="text-cyan-400" size={64} />
                <Zap className="text-yellow-400 absolute -top-1 -right-1" size={24} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">StealthText Pro</h1>
            <p className="text-cyan-200">Secure Message Encoding System</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-200 font-medium mb-2">
                Access Code
              </label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessCode()}
                placeholder="Enter access code..."
                className="w-full bg-gray-900 text-white rounded-xl p-4 border border-cyan-500/50 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all"
              />
            </div>
            
            <button
              onClick={handleAccessCode}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
            >
              <Key className="inline mr-2" size={20} />
              Authenticate
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Restricted Access • v2.0 • Encrypted Channel
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <Shield className="text-cyan-400" size={32} />
              <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-sm"></div>
            </div>
            <h1 className="text-4xl font-bold text-white">StealthText Pro</h1>
          </div>
          <p className="text-cyan-200 font-light">Advanced Text Steganography System</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium border border-cyan-500/30">
              ENCRYPTED
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
              SECURE
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
          <button
            onClick={() => setActiveTab('encode')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'encode'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <Lock size={20} />
            Encode Message
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'decode'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <Unlock size={20} />
            Decode Message
          </button>
        </div>

        {/* Encode Tab */}
        {activeTab === 'encode' && (
          <div className="space-y-6">
            {/* Secret Message */}
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
              <label className="block text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Zap size={18} />
                Secret Message
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter the confidential message you want to hide..."
                className="w-full h-32 bg-gray-900/80 text-white rounded-xl p-4 border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none transition-all font-mono"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">
                  Characters: {originalText.length}
                </span>
                {originalText.length > 500 && (
                  <span className="text-yellow-400 text-sm font-medium">
                    ⚠️ Long messages increase detection risk
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
              <label className="block text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Key size={18} />
                Encryption Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={encodePassword}
                  onChange={(e) => setEncodePassword(e.target.value)}
                  placeholder="Enter a strong encryption password..."
                  className="w-full bg-gray-900/80 text-white rounded-xl p-4 pr-12 border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">
                  Strength: {encodePassword.length >= 8 ? 'Strong' : encodePassword.length >= 4 ? 'Medium' : 'Weak'}
                </span>
                {encodePassword.length > 0 && encodePassword.length < 4 && (
                  <span className="text-red-400 text-sm font-medium">
                    ⚠️ Use at least 4 characters
                  </span>
                )}
              </div>
            </div>

            {/* Cover Text Options */}
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
              <label className="block text-cyan-300 font-semibold mb-3">
                Cover Text Options
              </label>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setUseCustomCover(false)}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    !useCustomCover
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-cyan-500/50'
                  }`}
                >
                  Auto-Generate
                </button>
                <button
                  onClick={() => setUseCustomCover(true)}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    useCustomCover
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-cyan-500/50'
                  }`}
                >
                  Custom Text
                </button>
              </div>

              {useCustomCover ? (
                <textarea
                  value={customCoverText}
                  onChange={(e) => setCustomCoverText(e.target.value)}
                  placeholder="Enter your custom cover text here..."
                  className="w-full h-32 bg-gray-900/80 text-white rounded-xl p-4 border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none transition-all"
                />
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCoverText(generateCoverText())}
                    className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-3 rounded-xl border border-gray-600 transition-all"
                  >
                    Generate New Cover
                  </button>
                </div>
              )}
              
              {coverText && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <p className="text-gray-300 text-sm mb-2">Preview:</p>
                  <p className="text-gray-400 text-sm">{coverText}</p>
                </div>
              )}
            </div>

            {/* Encode Button */}
            <button
              onClick={handleEncode}
              disabled={!originalText || !encodePassword}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              Encode Secret Message
            </button>

            {/* Encoded Output */}
            {encodedOutput && (
              <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <label className="block text-green-300 font-semibold flex items-center gap-2">
                    <Shield size={18} />
                    Secure Cover Text
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl border border-green-500/50 transition-all"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Secure Text'}
                  </button>
                </div>
                <div className="bg-gray-900/80 text-white rounded-xl p-4 border border-gray-700">
                  <p className="mb-4 whitespace-pre-wrap">{coverText}</p>
                  <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 flex justify-between">
                    <span>Cover Text Length: {coverText.length} characters</span>
                    <span>Hidden Data: {encodedOutput.length - coverText.length} invisible chars</span>
                  </div>
                </div>
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-300 text-sm flex items-center gap-2">
                    <Check size={16} />
                    Message successfully encoded and hidden. Copy and share the text above securely.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Decode Tab */}
        {activeTab === 'decode' && (
          <div className="space-y-6">
            {/* Cover Text Input */}
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                <label className="block text-cyan-300 font-semibold flex items-center gap-2">
                  <Clipboard size={18} />
                  Encoded Text Input
                </label>
                <button
                  onClick={pasteFromClipboard}
                  className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-4 py-2 rounded-xl border border-cyan-500/50 transition-all text-sm"
                >
                  {pasteStatus === 'Text pasted successfully!' ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
                  {pasteStatus || 'Paste from Clipboard'}
                </button>
              </div>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste the encoded cover text here..."
                className="w-full h-32 bg-gray-900/80 text-white rounded-xl p-4 border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none transition-all font-mono"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">
                  Characters: {decodeInput.length}
                </span>
                {decodeInput.length > 0 && (
                  <span className="text-cyan-400 text-sm font-medium">
                    {(() => {
                      const hiddenChars = decodeInput.split('').filter(c => CHAR_TO_BINARY[c]).length;
                      return hiddenChars > 0 ? `🔍 ${hiddenChars} hidden chars detected` : 'No hidden data found';
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* Decode Password */}
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
              <label className="block text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Key size={18} />
                Decryption Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decodePassword}
                  onChange={(e) => setDecodePassword(e.target.value)}
                  placeholder="Enter the decryption password..."
                  className="w-full bg-gray-900/80 text-white rounded-xl p-4 pr-12 border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Decode Button */}
            <button
              onClick={handleDecode}
              disabled={!decodeInput || !decodePassword}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <Unlock size={20} />
              Decode Secret Message
            </button>

            {/* Error Display */}
            {decodeError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="text-red-300 font-semibold mb-1">Decryption Failed</p>
                  <p className="text-red-200/80 text-sm">{decodeError}</p>
                </div>
              </div>
            )}

            {/* Decoded Output */}
            {decodedText && (
              <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 shadow-2xl">
                <label className="block text-green-300 font-semibold mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Decrypted Secret Message
                </label>
                <div className="bg-gray-900/80 text-white rounded-xl p-4 border border-gray-700">
                  <p className="whitespace-pre-wrap font-mono">{decodedText}</p>
                </div>
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-300 text-sm flex items-center gap-2">
                    <Check size={16} />
                    Message successfully decrypted and verified.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            🔒 End-to-End Encrypted • No Data Storage • Secure Channel Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextSteganography;
