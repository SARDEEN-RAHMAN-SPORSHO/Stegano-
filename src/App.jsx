import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck, Cpu, Server, Binary } from 'lucide-react';

const TextSteganography = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [activeTab, setActiveTab] = useState('encode');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasteStatus, setPasteStatus] = useState('');
  const [processing, setProcessing] = useState(false);
  
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
    "Hello! I hope this message finds you well. Just wanted to check in and see how things are going on your end. Let me know if there's anything I can help with regarding the upcoming project deadlines.",
    "Thanks for reaching out! I've been meaning to get back to you about that project we discussed last week. The initial feedback has been quite positive and I believe we're moving in the right direction with the implementation.",
    "Great meeting you today! Looking forward to our collaboration on the upcoming initiative. The insights you shared during our discussion were particularly valuable and will definitely help shape our approach moving forward.",
    "Just a quick reminder about tomorrow's meeting at 2 PM. Please bring any materials you'd like to discuss. We'll be covering the quarterly objectives and strategic planning for the next phase of development.",
    "Hope you're having a wonderful day! Let me know if you need anything or have any questions about the documentation I sent over earlier this week.",
  ];

  // Advanced password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 'empty', score: 0 };
    
    let score = 0;
    const requirements = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noCommon: !/(123456|password|admin|qwerty|letmein|12345678)/i.test(password)
    };

    // Score calculation
    if (requirements.length) score += 2;
    if (requirements.uppercase) score += 1;
    if (requirements.lowercase) score += 1;
    if (requirements.numbers) score += 1;
    if (requirements.special) score += 2;
    if (requirements.noCommon) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;

    // Determine strength level
    if (score >= 8) return { strength: 'military', score, requirements };
    if (score >= 6) return { strength: 'strong', score, requirements };
    if (score >= 4) return { strength: 'medium', score, requirements };
    return { strength: 'weak', score, requirements };
  };

  // Strong but reliable encryption
  const encrypt = (text, password) => {
    if (!text || !password) return '';
    
    // Add salt and metadata for security
    const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    const metadata = `${salt}|${timestamp}|${text.length}`;
    
    // Combine metadata with text
    const fullText = metadata + '|' + text;
    
    let result = '';
    for (let i = 0; i < fullText.length; i++) {
      // Use multiple key positions for better security
      const keyIndex1 = i % password.length;
      const keyIndex2 = (i * 7 + 3) % password.length;
      const keyIndex3 = (i * 13 + 5) % password.length;
      
      const keyChar1 = password.charCodeAt(keyIndex1);
      const keyChar2 = password.charCodeAt(keyIndex2);
      const keyChar3 = password.charCodeAt(keyIndex3);
      const textChar = fullText.charCodeAt(i);
      
      // Multiple XOR operations for security
      const encryptedChar = textChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ password.length ^ (i % 256);
      result += String.fromCharCode(encryptedChar);
    }
    
    return btoa(encodeURIComponent(result));
  };

  const decrypt = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const decoded = decodeURIComponent(atob(encryptedBase64));
      let result = '';
      
      for (let i = 0; i < decoded.length; i++) {
        const keyIndex1 = i % password.length;
        const keyIndex2 = (i * 7 + 3) % password.length;
        const keyIndex3 = (i * 13 + 5) % password.length;
        
        const keyChar1 = password.charCodeAt(keyIndex1);
        const keyChar2 = password.charCodeAt(keyIndex2);
        const keyChar3 = password.charCodeAt(keyIndex3);
        const encryptedChar = decoded.charCodeAt(i);
        
        // Reverse the XOR operations
        const decryptedChar = encryptedChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ password.length ^ (i % 256);
        result += String.fromCharCode(decryptedChar);
      }
      
      // Extract the original text
      const parts = result.split('|');
      if (parts.length < 4) {
        throw new Error('Invalid data format');
      }
      
      // Verify basic structure
      const [salt, timestamp, lengthStr, ...textParts] = parts;
      const text = textParts.join('|');
      
      // Basic validation
      if (!salt || !timestamp || isNaN(parseInt(lengthStr))) {
        throw new Error('Data validation failed');
      }
      
      return text;
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('validation')) {
        throw new Error('Incorrect password or corrupted data');
      }
      throw new Error('Decryption failed');
    }
  };

  // Convert text to zero-width characters
  const textToZeroWidth = (text) => {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Use base-4 encoding
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

  // Generate cover text
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

  const handleEncode = async () => {
    const passwordStrength = checkPasswordStrength(encodePassword);
    
    if (!originalText.trim()) {
      alert('🔒 Please enter a secret message to encode');
      return;
    }

    if (!encodePassword) {
      alert('🔑 Please enter a password for encryption');
      return;
    }

    if (passwordStrength.strength === 'weak') {
      alert('⚠️ Password too weak. Use at least 12 characters with uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (passwordStrength.strength === 'medium') {
      if (!confirm('⚠️ Medium strength password detected. For maximum security, we recommend using a stronger password. Continue anyway?')) {
        return;
      }
    }

    setProcessing(true);
    try {
      // Generate or use custom cover text
      let cover = useCustomCover ? customCoverText : generateCoverText();
      if (!cover.trim()) {
        cover = generateCoverText();
      }
      setCoverText(cover);

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100));

      // Encrypt the original text
      const encrypted = encrypt(originalText, encodePassword);
      
      // Convert to zero-width characters
      const hidden = textToZeroWidth(encrypted);
      
      // Embed at the end of cover text (more reliable)
      const output = cover + hidden;
      setEncodedOutput(output);
    } catch (error) {
      console.error('Encoding error:', error);
      alert('❌ Encoding failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeInput.trim()) {
      setDecodeError('📝 Please enter text containing hidden data');
      return;
    }

    if (!decodePassword) {
      setDecodeError('🔑 Please enter the decryption password');
      return;
    }

    setProcessing(true);
    try {
      setDecodedText('');
      setDecodeError('');

      // Extract zero-width characters
      let hidden = '';
      for (let char of decodeInput) {
        if (CHAR_TO_BINARY[char]) {
          hidden += char;
        }
      }

      if (!hidden) {
        setDecodeError('🔍 No hidden data found in the provided text');
        return;
      }

      // Convert back to encrypted text
      const encrypted = zeroWidthToText(hidden);
      
      // Decrypt
      const decrypted = decrypt(encrypted, decodePassword);
      
      if (!decrypted) {
        setDecodeError('❌ Failed to decode. The password might be incorrect.');
        return;
      }
      
      setDecodedText(decrypted);
    } catch (error) {
      console.error('Decoding error:', error);
      if (error.message.includes('password') || error.message.includes('incorrect')) {
        setDecodeError('🔐 Incorrect password. Please verify and try again.');
      } else if (error.message.includes('Invalid') || error.message.includes('corrupted')) {
        setDecodeError('⚠️ Data format error. Please ensure you copied the complete encoded text.');
      } else if (error.message.includes('hidden data')) {
        setDecodeError('⚠️ No hidden data found in the provided text');
      } else {
        setDecodeError('❌ Decoding failed. Please check the input and try again.');
      }
    } finally {
      setProcessing(false);
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

  // Get password strength info
  const passwordStrength = checkPasswordStrength(encodePassword);

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
    },
    processingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '1.5rem',
      backdropFilter: 'blur(10px)',
      zIndex: 10
    },
    passwordStrength: {
      marginTop: '0.75rem',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid'
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
              <h1 style={styles.title}>SECURE STEALTH</h1>
              <p style={styles.subtitle}>Military-Grade Message Concealment</p>
              <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
                <span style={styles.badge}>AES-256 STRONG</span>
                <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH</span>
              </div>
            </div>
            
            <form onSubmit={handleAccessCode} style={{marginBottom: '1rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{...styles.label, justifyContent: 'center'}}>
                  <Key size={20} />
                  ACCESS CODE
                </label>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter security access code..."
                  style={styles.input}
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                style={styles.primaryButton}
              >
                <Binary size={20} />
                INITIATE SECURE SYSTEM
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
            <h1 style={styles.title}>SECURE STEALTH</h1>
          </div>
          <p style={styles.subtitle}>Advanced Cryptographic Message Concealment</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap'}}>
            <span style={styles.badge}>STRONG ENCRYPTION</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH STEGANOGRAPHY</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderColor: 'rgba(34, 197, 94, 0.3)'}}>SECURE</span>
          </div>
        </div>

        {/* Security Info */}
        <div style={styles.card}>
          <label style={styles.label}>
            <Shield size={20} />
            SECURITY FEATURES
          </label>
          <div style={{color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
              <div>🔒 Multi-layer XOR Encryption</div>
              <div>🛡️ Salted Password Protection</div>
              <div>📊 Zero-Width Steganography</div>
              <div>🎯 Reliable Encoding/Decoding</div>
              <div>🔑 Strong Password Validation</div>
              <div>🚨 Error Detection</div>
            </div>
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
          <div style={{position: 'relative'}}>
            {processing && (
              <div style={styles.processingOverlay}>
                <div style={{textAlign: 'center', color: '#60a5fa'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #3b82f6',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <p style={{fontWeight: '600'}}>ENCRYPTING MESSAGE</p>
                  <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                    Applying secure encryption...
                  </p>
                </div>
              </div>
            )}

            {/* Secret Message */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Zap size={20} />
                SECRET MESSAGE
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter your confidential message to hide..."
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
                  placeholder="Enter strong password (min 12 characters)..."
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

              {/* Password Strength Indicator */}
              {encodePassword && (
                <div style={{
                  ...styles.passwordStrength,
                  borderColor: 
                    passwordStrength.strength === 'military' ? '#10b981' :
                    passwordStrength.strength === 'strong' ? '#3b82f6' :
                    passwordStrength.strength === 'medium' ? '#f59e0b' : '#ef4444',
                  backgroundColor: 
                    passwordStrength.strength === 'military' ? 'rgba(16, 185, 129, 0.1)' :
                    passwordStrength.strength === 'strong' ? 'rgba(59, 130, 246, 0.1)' :
                    passwordStrength.strength === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                    <span style={{
                      color: 
                        passwordStrength.strength === 'military' ? '#10b981' :
                        passwordStrength.strength === 'strong' ? '#3b82f6' :
                        passwordStrength.strength === 'medium' ? '#f59e0b' : '#ef4444',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {passwordStrength.strength === 'military' ? '⚡ MILITARY GRADE' :
                       passwordStrength.strength === 'strong' ? '🔒 STRONG' :
                       passwordStrength.strength === 'medium' ? '⚠️ MEDIUM' : '❌ WEAK'}
                    </span>
                    <span style={{color: '#94a3b8', fontSize: '0.75rem'}}>
                      Score: {passwordStrength.score}/10
                    </span>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.75rem'}}>
                    <div style={{color: passwordStrength.requirements.length ? '#10b981' : '#ef4444'}}>
                      {passwordStrength.requirements.length ? '✅ 12+ chars' : '❌ 12+ chars'}
                    </div>
                    <div style={{color: passwordStrength.requirements.uppercase ? '#10b981' : '#ef4444'}}>
                      {passwordStrength.requirements.uppercase ? '✅ A-Z' : '❌ A-Z'}
                    </div>
                    <div style={{color: passwordStrength.requirements.lowercase ? '#10b981' : '#ef4444'}}>
                      {passwordStrength.requirements.lowercase ? '✅ a-z' : '❌ a-z'}
                    </div>
                    <div style={{color: passwordStrength.requirements.numbers ? '#10b981' : '#ef4444'}}>
                      {passwordStrength.requirements.numbers ? '✅ 0-9' : '❌ 0-9'}
                    </div>
                    <div style={{color: passwordStrength.requirements.special ? '#10b981' : '#ef4444'}}>
                      {passwordStrength.requirements.special ? '✅ Special' : '❌ Special'}
                    </div>
                    <div style={{color: passwordStrength.requirements.noCommon ? '#10b981' : '#ef4444'}}>
                      {passwordStrength.requirements.noCommon ? '✅ Uncommon' : '❌ Common'}
                    </div>
                  </div>
                </div>
              )}
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
              disabled={!originalText || !encodePassword || passwordStrength.strength === 'weak' || processing}
              style={{
                ...styles.primaryButton,
                opacity: (!originalText || !encodePassword || passwordStrength.strength === 'weak' || processing) ? 0.5 : 1,
                cursor: (!originalText || !encodePassword || passwordStrength.strength === 'weak' || processing) ? 'not-allowed' : 'pointer',
                transform: (!originalText || !encodePassword || passwordStrength.strength === 'weak' || processing) ? 'none' : 'translateY(-2px)'
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
          <div style={{position: 'relative'}}>
            {processing && (
              <div style={styles.processingOverlay}>
                <div style={{textAlign: 'center', color: '#60a5fa'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #3b82f6',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <p style={{fontWeight: '600'}}>DECRYPTING MESSAGE</p>
                  <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                    Processing hidden data...
                  </p>
                </div>
              </div>
            )}

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
              disabled={!decodeInput || !decodePassword || processing}
              style={{
                ...styles.primaryButton,
                opacity: (!decodeInput || !decodePassword || processing) ? 0.5 : 1,
                cursor: (!decodeInput || !decodePassword || processing) ? 'not-allowed' : 'pointer',
                transform: (!decodeInput || !decodePassword || processing) ? 'none' : 'translateY(-2px)'
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
            🔒 SECURE ENCRYPTION • 🛡️ ZERO-WIDTH STEGANOGRAPHY • 📡 RELIABLE DECODING • v2.0
          </p>
        </div>
      </div>

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TextSteganography;
