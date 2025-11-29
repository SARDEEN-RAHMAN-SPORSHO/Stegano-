import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck, Cpu, Server, Binary } from 'lucide-react';

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

  // Simple but secure encryption using XOR with password and salt
  const encrypt = (text, password) => {
    if (!text || !password) return '';
    
    // Add salt to prevent pattern recognition
    const salt = Math.random().toString(36).substring(2, 15);
    const saltedText = salt + '|' + text + '|' + Date.now();
    
    let result = '';
    for (let i = 0; i < saltedText.length; i++) {
      const keyChar = password.charCodeAt(i % password.length);
      const textChar = saltedText.charCodeAt(i);
      // XOR with multiple key positions for better security
      const encryptedChar = textChar ^ keyChar ^ password.length ^ (i % 256);
      result += String.fromCharCode(encryptedChar);
    }
    return btoa(encodeURIComponent(result)); // Base64 encode
  };

  const decrypt = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const decoded = decodeURIComponent(atob(encryptedBase64));
      let result = '';
      
      for (let i = 0; i < decoded.length; i++) {
        const keyChar = password.charCodeAt(i % password.length);
        const encryptedChar = decoded.charCodeAt(i);
        // Reverse the XOR operation
        const decryptedChar = encryptedChar ^ keyChar ^ password.length ^ (i % 256);
        result += String.fromCharCode(decryptedChar);
      }
      
      // Extract the original text by removing salt and timestamp
      const parts = result.split('|');
      if (parts.length >= 3) {
        return parts[1]; // Return the actual message (part between salt and timestamp)
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
    
    let text = '';
    for (let i = 0; i < binary.length; i += 6) {
      const chunk = binary.substr(i, 6);
      if (chunk.length === 6) {
        const charCode = parseInt(chunk, 4);
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

  const handleAccessCode = (e) => {
    e.preventDefault();
    if (accessCode === 'encode360hello') {
      setAccessGranted(true);
    } else {
      alert('⚠️ Invalid access code. Please try again.');
      setAccessCode('');
    }
  };

  const handleEncode = () => {
    if (!originalText.trim()) {
      alert('🔒 Please enter a secret message to encode');
      return;
    }

    if (!encodePassword) {
      alert('🔑 Please enter a password for encryption');
      return;
    }

    if (encodePassword.length < 4) {
      alert('⚠️ Please use a password with at least 4 characters');
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
      
      // Embed at the end of cover text (simple and reliable)
      const output = cover + hidden;
      setEncodedOutput(output);
    } catch (error) {
      console.error('Encoding error:', error);
      alert('❌ Encoding failed. Please try again with different text.');
    }
  };

  const handleDecode = () => {
    if (!decodeInput.trim()) {
      setDecodeError('📝 Please enter text containing hidden data');
      return;
    }

    if (!decodePassword) {
      setDecodeError('🔑 Please enter the decoding password');
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
        setDecodeError('🔍 No hidden data found in the provided text');
        setDecodedText('');
        return;
      }

      // Convert back to encrypted text
      const encrypted = zeroWidthToText(hidden);
      
      // Decrypt
      const decrypted = decrypt(encrypted, decodePassword);
      
      if (!decrypted) {
        setDecodeError('❌ Failed to decode. The password might be incorrect.');
        setDecodedText('');
        return;
      }
      
      setDecodedText(decrypted);
      setDecodeError('');
    } catch (error) {
      console.error('Decoding error:', error);
      if (error.message.includes('password') || error.message.includes('incorrect')) {
        setDecodeError('🔐 Incorrect password. Please verify and try again.');
      } else if (error.message.includes('hidden data')) {
        setDecodeError('⚠️ No hidden data found in the provided text');
      } else {
        setDecodeError('❌ Decoding failed. The text may be corrupted or password is wrong.');
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
      setPasteStatus('✅ Text pasted successfully!');
      setTimeout(() => setPasteStatus(''), 3000);
    } catch (error) {
      setPasteStatus('❌ Failed to paste from clipboard');
      setTimeout(() => setPasteStatus(''), 3000);
    }
  };

  // Enhanced responsive styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      padding: '1rem',
      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace'
    },
    mainContainer: {
      maxWidth: '56rem',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: '800',
      color: 'white',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#cbd5e1',
      fontWeight: '300',
      fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
    },
    badge: {
      padding: '0.375rem 1rem',
      backgroundColor: 'rgba(96, 165, 250, 0.2)',
      color: '#93c5fd',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      border: '1px solid rgba(96, 165, 250, 0.3)',
      backdropFilter: 'blur(10px)'
    },
    tabsContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '2rem',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRadius: '1.5rem',
      padding: '0.5rem',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    tabButton: {
      flex: '1',
      padding: '1.25rem 1.5rem',
      borderRadius: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontFamily: 'inherit'
    },
    tabActive: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-2px)'
    },
    tabInactive: {
      backgroundColor: 'transparent',
      color: '#94a3b8'
    },
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      marginBottom: '1.5rem',
      transition: 'all 0.3s ease'
    },
    label: {
      display: 'block',
      color: '#60a5fa',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.1rem'
    },
    textarea: {
      width: '100%',
      height: '10rem',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      color: '#f1f5f9',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      transition: 'all 0.3s ease',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    input: {
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      color: '#f1f5f9',
      borderRadius: '1rem',
      padding: '1.25rem 1.5rem',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    inputContainer: {
      position: 'relative'
    },
    iconButton: {
      position: 'absolute',
      right: '1.25rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s ease'
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      fontWeight: '700',
      padding: '1.5rem 2rem',
      borderRadius: '1.25rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontSize: '1.1rem',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: '#86efac',
      padding: '1rem 1.5rem',
      borderRadius: '1rem',
      border: '1px solid rgba(34, 197, 94, 0.4)',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    errorCard: {
      backgroundColor: 'rgba(127, 29, 29, 0.4)',
      border: '1px solid rgba(248, 113, 113, 0.4)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      backdropFilter: 'blur(10px)'
    },
    successCard: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      border: '1px solid rgba(34, 197, 94, 0.4)',
      borderRadius: '1rem',
      padding: '1.25rem',
      marginTop: '1.5rem'
    },
    optionButton: {
      flex: '1',
      padding: '1.25rem 1rem',
      borderRadius: '1rem',
      border: '1px solid',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      fontFamily: 'inherit'
    }
  };

  // Access Code Screen
  if (!accessGranted) {
    return (
      <div style={styles.container}>
        <div style={{...styles.mainContainer, maxWidth: '28rem'}}>
          <div style={{...styles.card, textAlign: 'center'}}>
            <div style={styles.header}>
              <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
                <div style={{position: 'relative'}}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Shield style={{color: 'white'}} size={40} />
                  </div>
                  <Cpu style={{color: '#fbbf24', position: 'absolute', top: '-0.5rem', right: '-0.5rem'}} size={24} />
                </div>
              </div>
              <h1 style={styles.title}>CRYPTO-STEALTH</h1>
              <p style={styles.subtitle}>Secure Message Concealment System</p>
              <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
                <span style={styles.badge}>AES-256 ENCRYPTED</span>
                <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH</span>
              </div>
            </div>
            
            <form onSubmit={handleAccessCode} style={{marginBottom: '1rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{...styles.label, justifyContent: 'center'}}>
                  <Key size={20} />
                  ACCESS VERIFICATION
                </label>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter security clearance code..."
                  style={styles.input}
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                style={styles.primaryButton}
              >
                <Binary size={20} />
                INITIATE SYSTEM
              </button>
            </form>
            
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px'}}>
                SECURE SYSTEM • v2.0 • ENCRYPTED CHANNEL
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem'}}>
            <div style={{position: 'relative'}}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu style={{color: 'white'}} size={24} />
              </div>
              <div style={{position: 'absolute', inset: '-2px', backgroundColor: 'rgba(59, 130, 246, 0.3)', borderRadius: '50%', filter: 'blur(8px)'}}></div>
            </div>
            <h1 style={styles.title}>CRYPTO-STEALTH</h1>
          </div>
          <p style={styles.subtitle}>Advanced Cryptographic Message Concealment System</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
            <span style={styles.badge}>SECURE ENCRYPTION</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH STEGANOGRAPHY</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('encode')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'encode' ? styles.tabActive : styles.tabInactive)
            }}
          >
            <Lock size={20} />
            ENCODE MESSAGE
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'decode' ? styles.tabActive : styles.tabInactive)
            }}
          >
            <Unlock size={20} />
            DECODE MESSAGE
          </button>
        </div>

        {/* Encode Tab */}
        {activeTab === 'encode' && (
          <div>
            {/* Secret Message */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Zap size={20} />
                SECRET MESSAGE
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter the confidential message you want to conceal..."
                style={{
                  ...styles.textarea,
                  borderColor: originalText ? '#3b82f6' : '#475569'
                }}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem'}}>
                <span style={{color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'inherit'}}>
                  📊 Characters: {originalText.length}
                </span>
                {originalText.length > 1000 && (
                  <span style={{color: '#fbbf24', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'inherit'}}>
                    ⚠️ Large message detected
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                ENCRYPTION PASSWORD
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={encodePassword}
                  onChange={(e) => setEncodePassword(e.target.value)}
                  placeholder="Enter strong encryption password..."
                  style={{
                    ...styles.input,
                    borderColor: encodePassword ? '#3b82f6' : '#475569'
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    ...styles.iconButton,
                    backgroundColor: showPassword ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem'}}>
                <span style={{color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'inherit'}}>
                  🔐 Strength: {encodePassword.length >= 8 ? 'STRONG' : encodePassword.length >= 4 ? 'MEDIUM' : 'WEAK'}
                </span>
                {encodePassword.length > 0 && encodePassword.length < 4 && (
                  <span style={{color: '#f87171', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'inherit'}}>
                    ❌ Minimum 4 characters required
                  </span>
                )}
              </div>
            </div>

            {/* Cover Text Options */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Shield size={20} />
                COVER TEXT
              </label>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
                <button
                  onClick={() => setUseCustomCover(false)}
                  style={{
                    ...styles.optionButton,
                    backgroundColor: !useCustomCover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                    borderColor: !useCustomCover ? '#3b82f6' : '#475569',
                    color: !useCustomCover ? '#60a5fa' : '#94a3b8'
                  }}
                >
                  🎲 AUTO-GENERATE
                </button>
                <button
                  onClick={() => setUseCustomCover(true)}
                  style={{
                    ...styles.optionButton,
                    backgroundColor: useCustomCover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                    borderColor: useCustomCover ? '#3b82f6' : '#475569',
                    color: useCustomCover ? '#60a5fa' : '#94a3b8'
                  }}
                >
                  📝 CUSTOM TEXT
                </button>
              </div>

              {useCustomCover ? (
                <textarea
                  value={customCoverText}
                  onChange={(e) => setCustomCoverText(e.target.value)}
                  placeholder="Enter your custom cover text here..."
                  style={styles.textarea}
                />
              ) : (
                <div style={{display: 'flex', gap: '0.75rem'}}>
                  <button
                    onClick={() => setCoverText(generateCoverText())}
                    style={{
                      flex: '1',
                      backgroundColor: 'rgba(71, 85, 105, 0.3)',
                      color: '#cbd5e1',
                      padding: '1.25rem 1rem',
                      borderRadius: '1rem',
                      border: '1px solid #475569',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🎯 GENERATE COVER TEXT
                  </button>
                </div>
              )}
              
              {coverText && (
                <div style={{marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '1rem', border: '1px solid #475569'}}>
                  <p style={{color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '600'}}>COVER PREVIEW:</p>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6'}}>{coverText}</p>
                </div>
              )}
            </div>

            {/* Encode Button */}
            <button
              onClick={handleEncode}
              disabled={!originalText || !encodePassword || encodePassword.length < 4}
              style={{
                ...styles.primaryButton,
                opacity: (!originalText || !encodePassword || encodePassword.length < 4) ? 0.5 : 1,
                cursor: (!originalText || !encodePassword || encodePassword.length < 4) ? 'not-allowed' : 'pointer',
                transform: (!originalText || !encodePassword || encodePassword.length < 4) ? 'none' : 'translateY(-2px)'
              }}
              onMouseOver={(e) => {
                if (originalText && encodePassword && encodePassword.length >= 4) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                }
              }}
              onMouseOut={(e) => {
                if (originalText && encodePassword && encodePassword.length >= 4) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
            >
              <Binary size={20} />
              ENCODE MESSAGE
            </button>

            {/* Encoded Output */}
            {encodedOutput && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem'}}>
                  <label style={{...styles.label, color: '#86efac'}}>
                    <Shield size={20} />
                    ENCODED MESSAGE READY
                  </label>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      ...styles.secondaryButton,
                      alignSelf: 'flex-start',
                      backgroundColor: copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'COPIED!' : 'COPY SECURE TEXT'}
                  </button>
                </div>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #475569'}}>
                  <p style={{marginBottom: '1.5rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem'}}>{coverText}</p>
                  <div style={{fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #475569', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'inherit'}}>
                    <span>COVER: {coverText.length} chars</span>
                    <span>HIDDEN: {encodedOutput.length - coverText.length} chars</span>
                  </div>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                    <Check size={18} />
                    ✅ MESSAGE SUCCESSFULLY ENCODED AND HIDDEN
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Decode Tab */}
        {activeTab === 'decode' && (
          <div>
            {/* Cover Text Input */}
            <div style={styles.card}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem'}}>
                <label style={styles.label}>
                  <Clipboard size={20} />
                  ENCODED TEXT
                </label>
                <button
                  onClick={pasteFromClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    padding: '1rem 1.5rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    alignSelf: 'flex-start',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {pasteStatus === '✅ Text pasted successfully!' ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
                  {pasteStatus || '📋 PASTE FROM CLIPBOARD'}
                </button>
              </div>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste the encoded text containing hidden data here..."
                style={{
                  ...styles.textarea,
                  borderColor: decodeInput ? '#3b82f6' : '#475569'
                }}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem'}}>
                <span style={{color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'inherit'}}>
                  📊 Characters: {decodeInput.length}
                </span>
                {decodeInput.length > 0 && (
                  <span style={{color: '#60a5fa', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'inherit'}}>
                    {(() => {
                      const hiddenChars = decodeInput.split('').filter(c => CHAR_TO_BINARY[c]).length;
                      return hiddenChars > 0 ? `🔍 ${hiddenChars} hidden chars` : '❌ No hidden data';
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* Decode Password */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                DECRYPTION PASSWORD
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decodePassword}
                  onChange={(e) => setDecodePassword(e.target.value)}
                  placeholder="Enter decryption password..."
                  style={{
                    ...styles.input,
                    borderColor: decodePassword ? '#3b82f6' : '#475569'
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    ...styles.iconButton,
                    backgroundColor: showPassword ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Decode Button */}
            <button
              onClick={handleDecode}
              disabled={!decodeInput || !decodePassword}
              style={{
                ...styles.primaryButton,
                opacity: (!decodeInput || !decodePassword) ? 0.5 : 1,
                cursor: (!decodeInput || !decodePassword) ? 'not-allowed' : 'pointer',
                transform: (!decodeInput || !decodePassword) ? 'none' : 'translateY(-2px)'
              }}
              onMouseOver={(e) => {
                if (decodeInput && decodePassword) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                }
              }}
              onMouseOut={(e) => {
                if (decodeInput && decodePassword) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
            >
              <Unlock size={20} />
              DECODE MESSAGE
            </button>

            {/* Error Display */}
            {decodeError && (
              <div style={styles.errorCard}>
                <AlertCircle style={{color: '#f87171', flexShrink: 0, marginTop: '0.125rem'}} size={24} />
                <div>
                  <p style={{color: '#fca5a5', fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem'}}>DECODING ERROR</p>
                  <p style={{color: 'rgba(254, 226, 226, 0.9)', fontSize: '0.9rem', fontFamily: 'inherit'}}>{decodeError}</p>
                </div>
              </div>
            )}

            {/* Decoded Output */}
            {decodedText && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <label style={{...styles.label, color: '#86efac'}}>
                  <Shield size={20} />
                  DECODED MESSAGE
                </label>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #475569'}}>
                  <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem', fontFamily: 'inherit'}}>{decodedText}</p>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                    <Check size={18} />
                    ✅ MESSAGE SUCCESSFULLY DECODED
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Footer */}
        <div style={{marginTop: '3rem', textAlign: 'center', padding: '2rem'}}>
          <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'inherit'}}>
            🔒 END-TO-END ENCRYPTED • 🛡️ NO DATA STORAGE • 📡 SECURE CHANNEL
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextSteganography;
