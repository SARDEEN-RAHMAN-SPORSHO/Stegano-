import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Key, FileText, Shield, Zap } from 'lucide-react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');
  const [activeTab, setActiveTab] = useState('encode');
  const [showPassword, setShowPassword] = useState(false);
  
  // Encode state
  const [originalText, setOriginalText] = useState('');
  const [password, setPassword] = useState('');
  const [customCoverText, setCustomCoverText] = useState('');
  const [useCustomCover, setUseCustomCover] = useState(false);
  const [encodedResult, setEncodedResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [encodeError, setEncodeError] = useState('');
  
  // Decode state
  const [coverTextInput, setCoverTextInput] = useState('');
  const [decodePassword, setDecodePassword] = useState('');
  const [decodedResult, setDecodedResult] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [showDecodePassword, setShowDecodePassword] = useState(false);

  const CORRECT_ACCESS_CODE = 'encode360hello';

  const coverTextTemplates = [
    "Hi there! Just wanted to check in and see how you're doing. Hope everything is going well on your end. Let me know if you need anything!",
    "Thanks for the update. I'll review the documents and get back to you by tomorrow afternoon. Looking forward to our next meeting.",
    "Great work on the presentation! The team really appreciated your insights. Keep up the excellent effort!",
    "Reminder: Don't forget about the event scheduled for next week. Please confirm your attendance when you get a chance.",
    "I hope this message finds you well. I wanted to reach out regarding our previous conversation. Please let me know your thoughts.",
    "Everything looks good from my end. I've completed the review and everything checks out perfectly. Moving forward as planned.",
    "Quick update: The project is on track and we're meeting all our deadlines. Will send a detailed report by end of day.",
    "Thank you for your patience. I've looked into the matter and have some updates to share with you soon.",
    "Just a friendly reminder about the upcoming deadline. Let me know if you need any assistance or have questions.",
    "I appreciate your feedback on this. It's been very helpful in moving things forward. Talk to you soon!"
  ];

  // Strong encryption using AES-256-GCM with PBKDF2
  const encryptText = async (text, password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );

    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...result));
  };

  const decryptText = async (encryptedData, password) => {
    try {
      // Validate inputs
      if (!encryptedData || !password) {
        throw new Error('Missing encrypted data or password');
      }

      const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Check if data has minimum required length
      if (data.length < 28) { // 16 (salt) + 12 (iv) = 28
        throw new Error('Invalid encrypted data format');
      }
      
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const encrypted = data.slice(28);

      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error details:', error);
      throw new Error('Decryption failed. Wrong password or corrupted data.');
    }
  };

  // Zero-width steganography
  const ZERO_WIDTH_CHARS = {
    '0': '\u200B',
    '1': '\u200C',
    '2': '\u200D',
    '3': '\uFEFF'
  };

  const embedData = (coverText, data) => {
    const binaryData = data.split('').map(char => {
      const binary = char.charCodeAt(0).toString(2).padStart(16, '0');
      return binary.split('').map(bit => {
        if (bit === '0') return ZERO_WIDTH_CHARS['0'];
        return ZERO_WIDTH_CHARS['1'];
      }).join('');
    }).join(ZERO_WIDTH_CHARS['2']);

    const marker = ZERO_WIDTH_CHARS['3'] + ZERO_WIDTH_CHARS['3'];
    const words = coverText.split(' ');
    const midPoint = Math.floor(words.length / 2);
    
    words.splice(midPoint, 0, marker + binaryData + marker);
    return words.join(' ');
  };

  const extractData = (text) => {
    const marker = ZERO_WIDTH_CHARS['3'] + ZERO_WIDTH_CHARS['3'];
    const markerRegex = new RegExp(marker, 'g');
    const matches = text.match(markerRegex);
    
    if (!matches || matches.length < 2) {
      throw new Error('No embedded data found in the text.');
    }

    const firstMarker = text.indexOf(marker);
    const lastMarker = text.lastIndexOf(marker);
    const hiddenData = text.substring(firstMarker + marker.length, lastMarker);

    let binaryString = '';
    for (let char of hiddenData) {
      if (char === ZERO_WIDTH_CHARS['0']) binaryString += '0';
      else if (char === ZERO_WIDTH_CHARS['1']) binaryString += '1';
      else if (char === ZERO_WIDTH_CHARS['2']) {
        if (binaryString.length === 16) {
          binaryString += '|';
        }
      }
    }

    const characters = binaryString.split('|').filter(b => b.length === 16);
    return characters.map(binary => String.fromCharCode(parseInt(binary, 2))).join('');
  };

  const handleAccessSubmit = () => {
    if (accessCode === CORRECT_ACCESS_CODE) {
      setIsAuthenticated(true);
      setAccessError('');
    } else {
      setAccessError('Invalid access code. Please try again.');
    }
  };

  const handleEncode = async () => {
    setEncodeError('');
    setEncodedResult('');
    setCopied(false);

    if (!originalText.trim()) {
      setEncodeError('Please enter the original text to encode.');
      return;
    }

    if (!password.trim()) {
      setEncodeError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setEncodeError('Password must be at least 6 characters long.');
      return;
    }

    if (useCustomCover && !customCoverText.trim()) {
      setEncodeError('Please enter a custom cover text or use a template.');
      return;
    }

    try {
      // Trim and ensure consistent password handling
      const trimmedPassword = password.trim();
      const encrypted = await encryptText(originalText, trimmedPassword);
      const coverText = useCustomCover ? customCoverText : coverTextTemplates[Math.floor(Math.random() * coverTextTemplates.length)];
      const result = embedData(coverText, encrypted);
      setEncodedResult(result);
    } catch (error) {
      console.error('Encoding error:', error);
      setEncodeError('Encoding failed. Please try again.');
    }
  };

  const handleDecode = async () => {
    setDecodeError('');
    setDecodedResult('');

    if (!coverTextInput.trim()) {
      setDecodeError('Please enter the cover text to decode.');
      return;
    }

    if (!decodePassword.trim()) {
      setDecodeError('Please enter the password.');
      return;
    }

    try {
      const extractedData = extractData(coverTextInput);
      
      // Trim and ensure consistent password handling
      const trimmedPassword = decodePassword.trim();
      const decrypted = await decryptText(extractedData, trimmedPassword);
      setDecodedResult(decrypted);
    } catch (error) {
      console.error('Decoding error:', error);
      if (error.message.includes('No embedded data')) {
        setDecodeError('No hidden data found. The text may not contain embedded metadata.');
      } else if (error.message.includes('Decryption failed')) {
        setDecodeError('Wrong password or corrupted data. Please check your password and try again.');
      } else {
        setDecodeError('Decoding failed. The text may be corrupted or invalid.');
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(encodedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setEncodeError('Failed to copy to clipboard.');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCoverTextInput(text);
      setDecodeError('');
    } catch (error) {
      setDecodeError('Failed to paste from clipboard. Please paste manually.');
    }
  };

  const handleAccessKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAccessSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2djhoOHYtOGgtOHptMCAxNnY4aDh2LThoLTh6bS0xNiAwdjhoOHYtOGgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/30">
                <Shield className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Secure Access
            </h1>
            <p className="text-slate-400 text-center mb-8 text-sm">
              Enter access code to continue
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Access Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setAccessError('');
                    }}
                    onKeyPress={handleAccessKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                    placeholder="Enter access code"
                  />
                </div>
                {accessError && (
                  <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{accessError}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleAccessSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Access System
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Lock className="w-4 h-4" />
                <span>Encrypted • Secure • Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2djhoOHYtOGgtOHptMCAxNnY4aDh2LThoLTh6bS0xNiAwdjhoOHYtOGgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-500/10 p-3 rounded-full border border-purple-500/30">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              SteganoLock
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Military-grade text steganography with AES-256 encryption
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => {
                setActiveTab('encode');
                setEncodeError('');
                setDecodeError('');
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'encode'
                  ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                <span>Encode</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('decode');
                setEncodeError('');
                setDecodeError('');
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'decode'
                  ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Unlock className="w-5 h-5" />
                <span>Decode</span>
              </div>
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'encode' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Secret Message
                  </label>
                  <textarea
                    value={originalText}
                    onChange={(e) => {
                      setOriginalText(e.target.value);
                      setEncodeError('');
                    }}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500 resize-none"
                    rows="4"
                    placeholder="Enter the text you want to hide..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Encryption Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setEncodeError('');
                      }}
                      className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                      placeholder="Enter a strong password..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Minimum 6 characters required</p>
                </div>

                <div className="border-t border-slate-700/50 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="customCover"
                      checked={useCustomCover}
                      onChange={(e) => setUseCustomCover(e.target.checked)}
                      className="w-4 h-4 bg-slate-900/50 border-slate-700 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="customCover" className="text-sm font-medium text-slate-300 cursor-pointer">
                      Use custom cover text
                    </label>
                  </div>

                  {useCustomCover ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Custom Cover Text
                      </label>
                      <textarea
                        value={customCoverText}
                        onChange={(e) => {
                          setCustomCoverText(e.target.value);
                          setEncodeError('');
                        }}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500 resize-none"
                        rows="3"
                        placeholder="Enter innocent-looking cover text..."
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                        <Zap className="w-4 h-4" />
                        <span>Random template will be selected</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Your message will be hidden in a randomly chosen innocent-looking text
                      </p>
                    </div>
                  )}
                </div>

                {encodeError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{encodeError}</span>
                  </div>
                )}

                <button
                  onClick={handleEncode}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Encode & Embed</span>
                </button>

                {encodedResult && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-green-400 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Cover Text (with hidden data)
                      </label>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-colors text-sm"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <p className="text-white text-sm break-words">{encodedResult}</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      This text contains your encrypted message embedded as invisible metadata
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cover Text (with embedded data)
                  </label>
                  <div className="relative">
                    <textarea
                      value={coverTextInput}
                      onChange={(e) => {
                        setCoverTextInput(e.target.value);
                        setDecodeError('');
                      }}
                      className="w-full px-4 py-3 pb-12 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500 resize-none"
                      rows="4"
                      placeholder="Paste the cover text here..."
                    />
                    <button
                      onClick={handlePaste}
                      className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-md transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Paste</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Decryption Password
                  </label>
                  <div className="relative">
                    <input
                      type={showDecodePassword ? 'text' : 'password'}
                      value={decodePassword}
                      onChange={(e) => {
                        setDecodePassword(e.target.value);
                        setDecodeError('');
                      }}
                      className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                      placeholder="Enter the password used during encoding..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowDecodePassword(!showDecodePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showDecodePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {decodeError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{decodeError}</span>
                  </div>
                )}

                <button
                  onClick={handleDecode}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Unlock className="w-5 h-5" />
                  <span>Extract & Decode</span>
                </button>

                {decodedResult && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <label className="text-sm font-medium text-green-400 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Decoded Secret Message
                    </label>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <p className="text-white text-sm break-words whitespace-pre-wrap">{decodedResult}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 text-xs">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>AES-256-GCM</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Zero-Width Steganography</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Key className="w-3 h-3" />
              <span>PBKDF2 (100k iterations)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
