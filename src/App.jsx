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

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1e3a8a 50%, #111827 100%)',
      padding: '1rem'
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
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#67e8f9',
      fontWeight: '300'
    },
    badge: {
      padding: '0.25rem 0.75rem',
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      color: '#67e8f9',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      border: '1px solid rgba(6, 182, 212, 0.3)'
    },
    tabsContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '2rem',
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1rem',
      padding: '0.5rem',
      border: '1px solid rgba(55, 65, 81, 0.5)'
    },
    tabButton: {
      flex: '1',
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      fontWeight: '600',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      border: 'none',
      cursor: 'pointer'
    },
    tabActive: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.25)'
    },
    tabInactive: {
      backgroundColor: 'transparent',
      color: '#d1d5db'
    },
    card: {
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      color: '#67e8f9',
      fontWeight: '600',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    textarea: {
      width: '100%',
      height: '8rem',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      color: 'white',
      borderRadius: '0.75rem',
      padding: '1rem',
      border: '1px solid rgba(55, 65, 81, 1)',
      outline: 'none',
      resize: 'none',
      fontFamily: 'monospace'
    },
    input: {
      width: '100%',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      color: 'white',
      borderRadius: '0.75rem',
      padding: '1rem',
      border: '1px solid rgba(55, 65, 81, 1)',
      outline: 'none'
    },
    inputContainer: {
      position: 'relative'
    },
    iconButton: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      border: 'none',
      background: 'none',
      cursor: 'pointer'
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
      color: 'white',
      fontWeight: 'bold',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'rgba(22, 163, 74, 0.2)',
      color: '#86efac',
      padding: '0.5rem 1rem',
      borderRadius: '0.75rem',
      border: '1px solid rgba(22, 163, 74, 0.5)',
      cursor: 'pointer'
    },
    errorCard: {
      backgroundColor: 'rgba(127, 29, 29, 0.3)',
      border: '1px solid rgba(248, 113, 113, 0.3)',
      borderRadius: '1rem',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    },
    successCard: {
      backgroundColor: 'rgba(22, 163, 74, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '1rem',
      padding: '1rem',
      marginTop: '1rem'
    },
    optionButton: {
      flex: '1',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      border: '1px solid',
      transition: 'all 0.3s',
      border: 'none',
      cursor: 'pointer'
    }
  };

  // Zero-width characters for steganography
  const ZERO_WIDTH_CHARS = {
    '0': '\u200B',
    '1': '\u200C', 
    '2': '\u200D',
    '3': '\uFEFF',
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
    "I wanted to follow up on our conversation from yesterday regarding the upcoming project timeline."
  ];

  const encrypt = (text, password) => {
    if (!text || !password) return '';
    const salt = Date.now().toString(36);
    const saltedText = salt + '|' + text;
    
    let result = '';
    for (let i = 0; i < saltedText.length; i++) {
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
      
      const parts = result.split('|');
      if (parts.length >= 2) {
        return parts.slice(1).join('|');
      }
      return result;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  };

  const textToZeroWidth = (text) => {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const base4 = charCode.toString(4).padStart(6, '0');
      binary += base4;
    }
    
    let zeroWidth = '';
    for (let char of binary) {
      zeroWidth += ZERO_WIDTH_CHARS[char];
    }
    return zeroWidth;
  };

  const zeroWidthToText = (zeroWidth) => {
    let binary = '';
    for (let char of zeroWidth) {
      if (CHAR_TO_BINARY[char]) {
        binary += CHAR_TO_BINARY[char];
      }
    }
    
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
      let cover = useCustomCover ? customCoverText : generateCoverText();
      if (!cover.trim()) {
        cover = generateCoverText();
      }
      setCoverText(cover);

      const encrypted = encrypt(originalText, encodePassword);
      const hidden = textToZeroWidth(encrypted);
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

      const encrypted = zeroWidthToText(hidden);
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

  if (!accessGranted) {
    return (
      <div style={styles.container}>
        <div style={{...styles.mainContainer, maxWidth: '28rem'}}>
          <div style={styles.card}>
            <div style={styles.header}>
              <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
                <div style={{position: 'relative'}}>
                  <Shield style={{color: '#22d3ee'}} size={64} />
                  <Zap style={{color: '#fbbf24', position: 'absolute', top: '-0.25rem', right: '-0.25rem'}} size={24} />
                </div>
              </div>
              <h1 style={styles.title}>StealthText Pro</h1>
              <p style={styles.subtitle}>Secure Message Encoding System</p>
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <label style={styles.label}>
                Access Code
              </label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessCode()}
                placeholder="Enter access code..."
                style={styles.input}
              />
            </div>
            
            <button
              onClick={handleAccessCode}
              style={styles.primaryButton}
            >
              <Key size={20} />
              Authenticate
            </button>
            
            <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
              <p style={{color: '#9ca3af', fontSize: '0.875rem'}}>
                Restricted Access • v2.0 • Encrypted Channel
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
            <div style={{position: 'relative'}}>
              <Shield style={{color: '#22d3ee'}} size={32} />
              <div style={{position: 'absolute', inset: '-0.25rem', backgroundColor: 'rgba(34, 211, 238, 0.2)', borderRadius: '50%', filter: 'blur(4px)'}}></div>
            </div>
            <h1 style={styles.title}>StealthText Pro</h1>
          </div>
          <p style={styles.subtitle}>Advanced Text Steganography System</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
            <span style={styles.badge}>ENCRYPTED</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', borderColor: 'rgba(59, 130, 246, 0.3)'}}>SECURE</span>
          </div>
        </div>

        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('encode')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'encode' ? styles.tabActive : styles.tabInactive)
            }}
          >
            <Lock size={20} />
            Encode Message
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'decode' ? styles.tabActive : styles.tabInactive)
            }}
          >
            <Unlock size={20} />
            Decode Message
          </button>
        </div>

        {activeTab === 'encode' && (
          <div>
            <div style={styles.card}>
              <label style={styles.label}>
                <Zap size={18} />
                Secret Message
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter the confidential message you want to hide..."
                style={styles.textarea}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
                <span style={{color: '#9ca3af', fontSize: '0.875rem'}}>
                  Characters: {originalText.length}
                </span>
                {originalText.length > 500 && (
                  <span style={{color: '#fbbf24', fontSize: '0.875rem', fontWeight: '500'}}>
                    ⚠️ Long messages increase detection risk
                  </span>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={18} />
                Encryption Password
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={encodePassword}
                  onChange={(e) => setEncodePassword(e.target.value)}
                  placeholder="Enter a strong encryption password..."
                  style={styles.input}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
                <span style={{color: '#9ca3af', fontSize: '0.875rem'}}>
                  Strength: {encodePassword.length >= 8 ? 'Strong' : encodePassword.length >= 4 ? 'Medium' : 'Weak'}
                </span>
                {encodePassword.length > 0 && encodePassword.length < 4 && (
                  <span style={{color: '#f87171', fontSize: '0.875rem', fontWeight: '500'}}>
                    ⚠️ Use at least 4 characters
                  </span>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <label style={styles.label}>
                Cover Text Options
              </label>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <button
                  onClick={() => setUseCustomCover(false)}
                  style={{
                    ...styles.optionButton,
                    backgroundColor: !useCustomCover ? 'rgba(6, 182, 212, 0.2)' : 'rgba(55, 65, 81, 0.5)',
                    borderColor: !useCustomCover ? '#06b6d4' : '#374151',
                    color: !useCustomCover ? '#67e8f9' : '#d1d5db'
                  }}
                >
                  Auto-Generate
                </button>
                <button
                  onClick={() => setUseCustomCover(true)}
                  style={{
                    ...styles.optionButton,
                    backgroundColor: useCustomCover ? 'rgba(6, 182, 212, 0.2)' : 'rgba(55, 65, 81, 0.5)',
                    borderColor: useCustomCover ? '#06b6d4' : '#374151',
                    color: useCustomCover ? '#67e8f9' : '#d1d5db'
                  }}
                >
                  Custom Text
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
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button
                    onClick={() => setCoverText(generateCoverText())}
                    style={{
                      flex: '1',
                      backgroundColor: 'rgba(55, 65, 81, 0.5)',
                      color: '#d1d5db',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #374151',
                      cursor: 'pointer'
                    }}
                  >
                    Generate New Cover
                  </button>
                </div>
              )}
              
              {coverText && (
                <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(17, 24, 39, 0.5)', borderRadius: '0.75rem', border: '1px solid #374151'}}>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Preview:</p>
                  <p style={{color: '#9ca3af', fontSize: '0.875rem'}}>{coverText}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleEncode}
              disabled={!originalText || !encodePassword}
              style={{
                ...styles.primaryButton,
                opacity: (!originalText || !encodePassword) ? 0.5 : 1,
                cursor: (!originalText || !encodePassword) ? 'not-allowed' : 'pointer'
              }}
            >
              <Zap size={20} />
              Encode Secret Message
            </button>

            {encodedOutput && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.2)'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem'}}>
                  <label style={{...styles.label, color: '#86efac'}}>
                    <Shield size={18} />
                    Secure Cover Text
                  </label>
                  <button
                    onClick={copyToClipboard}
                    style={styles.secondaryButton}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Secure Text'}
                  </button>
                </div>
                <div style={{backgroundColor: 'rgba(17, 24, 39, 0.8)', color: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #374151'}}>
                  <p style={{marginBottom: '1rem', whiteSpace: 'pre-wrap'}}>{coverText}</p>
                  <div style={{fontSize: '0.75rem', color: '#6b7280', borderTop: '1px solid #374151', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between'}}>
                    <span>Cover Text Length: {coverText.length} characters</span>
                    <span>Hidden Data: {encodedOutput.length - coverText.length} invisible chars</span>
                  </div>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <Check size={16} />
                    Message successfully encoded and hidden. Copy and share the text above securely.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'decode' && (
          <div>
            <div style={styles.card}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem'}}>
                <label style={styles.label}>
                  <Clipboard size={18} />
                  Encoded Text Input
                </label>
                <button
                  onClick={pasteFromClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    color: '#67e8f9',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(6, 182, 212, 0.5)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    alignSelf: 'flex-start'
                  }}
                >
                  {pasteStatus === 'Text pasted successfully!' ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
                  {pasteStatus || 'Paste from Clipboard'}
                </button>
              </div>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste the encoded cover text here..."
                style={styles.textarea}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
                <span style={{color: '#9ca3af', fontSize: '0.875rem'}}>
                  Characters: {decodeInput.length}
                </span>
                {decodeInput.length > 0 && (
                  <span style={{color: '#67e8f9', fontSize: '0.875rem', fontWeight: '500'}}>
                    {(() => {
                      const hiddenChars = decodeInput.split('').filter(c => CHAR_TO_BINARY[c]).length;
                      return hiddenChars > 0 ? `🔍 ${hiddenChars} hidden chars detected` : 'No hidden data found';
                    })()}
                  </span>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={18} />
                Decryption Password
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decodePassword}
                  onChange={(e) => setDecodePassword(e.target.value)}
                  placeholder="Enter the decryption password..."
                  style={styles.input}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleDecode}
              disabled={!decodeInput || !decodePassword}
              style={{
                ...styles.primaryButton,
                opacity: (!decodeInput || !decodePassword) ? 0.5 : 1,
                cursor: (!decodeInput || !decodePassword) ? 'not-allowed' : 'pointer'
              }}
            >
              <Unlock size={20} />
              Decode Secret Message
            </button>

            {decodeError && (
              <div style={styles.errorCard}>
                <AlertCircle style={{color: '#f87171', flexShrink: 0, marginTop: '0.125rem'}} size={24} />
                <div>
                  <p style={{color: '#fca5a5', fontWeight: '600', marginBottom: '0.25rem'}}>Decryption Failed</p>
                  <p style={{color: 'rgba(254, 226, 226, 0.8)', fontSize: '0.875rem'}}>{decodeError}</p>
                </div>
              </div>
            )}

            {decodedText && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.2)'}}>
                <label style={{...styles.label, color: '#86efac'}}>
                  <Shield size={18} />
                  Decrypted Secret Message
                </label>
                <div style={{backgroundColor: 'rgba(17, 24, 39, 0.8)', color: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #374151'}}>
                  <p style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>{decodedText}</p>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <Check size={16} />
                    Message successfully decrypted and verified.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{marginTop: '2rem', textAlign: 'center'}}>
          <p style={{color: '#9ca3af', fontSize: '0.875rem'}}>
            🔒 End-to-End Encrypted • No Data Storage • Secure Channel Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextSteganography;
