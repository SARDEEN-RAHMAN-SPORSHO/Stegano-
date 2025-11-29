import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck, Cpu, Server, Binary, Settings, ArrowLeft, Mail, MailOpen } from 'lucide-react';

const TextSteganography = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [operationMode, setOperationMode] = useState(null);
  const [encryptionLevel, setEncryptionLevel] = useState(null);
  const [accessCode, setAccessCode] = useState('');
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
    '0': '\u200B',
    '1': '\u200C', 
    '2': '\u200D',
    '3': '\uFEFF',
  };

  const CHAR_TO_BINARY = {
    '\u200B': '0',
    '\u200C': '1',
    '\u200D': '2',
    '\uFEFF': '3'
  };

  // Enhanced cover text templates
  const COVER_TEXT_TEMPLATES = [
    "Hello! I hope this message finds you well. Just wanted to check in and see how things are going on your end.",
    "Thanks for reaching out! I've been meaning to get back to you about that project we discussed last week.",
    "Great meeting you today! Looking forward to our collaboration on the upcoming initiative.",
    "Just a quick reminder about tomorrow's meeting at 2 PM. Please bring any materials you'd like to discuss.",
    "Hope you're having a wonderful day! Let me know if you need anything.",
  ];

  // Basic XOR encryption
  const encryptBasic = (text, password) => {
    if (!text || !password) return '';
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  };

  const decryptBasic = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const decoded = atob(encryptedBase64);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  };

  // Convert text to zero-width characters
  const textToZeroWidth = (text) => {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const binaryChar = charCode.toString(2).padStart(16, '0');
      binary += binaryChar;
    }
    
    let zeroWidth = '';
    for (let i = 0; i < binary.length; i += 2) {
      const twoBits = binary.substr(i, 2);
      if (twoBits.length === 2) {
        const base4Digit = parseInt(twoBits, 2).toString();
        zeroWidth += ZERO_WIDTH_CHARS[base4Digit];
      }
    }
    return zeroWidth;
  };

  // Convert zero-width chars back to text
  const zeroWidthToText = (zeroWidth) => {
    let binary = '';
    for (let char of zeroWidth) {
      if (CHAR_TO_BINARY[char] !== undefined) {
        const base4Digit = CHAR_TO_BINARY[char];
        const twoBits = parseInt(base4Digit, 10).toString(2).padStart(2, '0');
        binary += twoBits;
      }
    }
    
    let text = '';
    for (let i = 0; i < binary.length; i += 16) {
      const chunk = binary.substr(i, 16);
      if (chunk.length === 16) {
        const charCode = parseInt(chunk, 2);
        if (charCode >= 0 && charCode <= 65535) {
          text += String.fromCharCode(charCode);
        }
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
      alert('Invalid access code');
      setAccessCode('');
    }
  };

  const handleEncode = async () => {
    if (!originalText.trim()) {
      alert('Please enter a secret message to encode');
      return;
    }

    if (!encodePassword) {
      alert('Please enter a password for encryption');
      return;
    }

    setProcessing(true);
    try {
      let cover = useCustomCover ? customCoverText : generateCoverText();
      if (!cover.trim()) {
        cover = generateCoverText();
      }
      setCoverText(cover);

      await new Promise(resolve => setTimeout(resolve, 100));

      const encrypted = encryptBasic(originalText, encodePassword);
      const hidden = textToZeroWidth(encrypted);
      const output = cover + hidden;
      setEncodedOutput(output);
    } catch (error) {
      console.error('Encoding error:', error);
      alert('Encoding failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeInput.trim()) {
      setDecodeError('Please enter text containing hidden data');
      return;
    }

    if (!decodePassword) {
      setDecodeError('Please enter the decryption password');
      return;
    }

    setProcessing(true);
    try {
      setDecodedText('');
      setDecodeError('');

      let hidden = '';
      for (let char of decodeInput) {
        if (CHAR_TO_BINARY[char] !== undefined) {
          hidden += char;
        }
      }

      if (!hidden) {
        setDecodeError('No hidden data found');
        return;
      }

      const encrypted = zeroWidthToText(hidden);
      
      if (!encrypted) {
        setDecodeError('Failed to extract encrypted data');
        return;
      }
      
      const decrypted = decryptBasic(encrypted, decodePassword);
      
      if (!decrypted) {
        setDecodeError('Failed to decode - incorrect password');
        return;
      }
      
      setDecodedText(decrypted);
      setDecodeError('Successfully decoded with BASIC encryption');
    } catch (error) {
      console.error('Decoding error:', error);
      setDecodeError('Decoding failed - incorrect password or corrupted data');
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
      setPasteStatus('Text pasted successfully!');
      setTimeout(() => setPasteStatus(''), 3000);
    } catch (error) {
      setPasteStatus('Failed to paste from clipboard');
      setTimeout(() => setPasteStatus(''), 3000);
    }
  };

  // Basic styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif'
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
      fontSize: '2rem',
      fontWeight: '800',
      color: 'white',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#cbd5e1',
      fontWeight: '300',
      fontSize: '1.125rem'
    },
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#60a5fa',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    textarea: {
      width: '100%',
      height: '10rem',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      color: '#f1f5f9',
      borderRadius: '0.5rem',
      padding: '1rem',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      outline: 'none',
      resize: 'vertical',
      fontSize: '0.95rem',
    },
    input: {
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      color: '#f1f5f9',
      borderRadius: '0.5rem',
      padding: '1rem',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      outline: 'none',
      fontSize: '1rem',
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      fontWeight: '700',
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
    },
  };

  // Access Code Screen
  if (!accessGranted) {
    return (
      <div style={styles.container}>
        <div style={{...styles.mainContainer, maxWidth: '28rem'}}>
          <div style={{...styles.card, textAlign: 'center'}}>
            <div style={styles.header}>
              <h1 style={styles.title}>QUANTUM STEALTH</h1>
              <p style={styles.subtitle}>Secure Message System</p>
            </div>
            
            <form onSubmit={handleAccessCode} style={{marginBottom: '1rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{...styles.label, justifyContent: 'center'}}>
                  <Key size={20} />
                  SYSTEM ACCESS CODE
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
                INITIATE SECURE SYSTEM
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Operation Mode Selection
  if (!operationMode) {
    return (
      <div style={styles.container}>
        <div style={styles.mainContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>SELECT OPERATION</h1>
            <p style={styles.subtitle}>Choose what you want to do</p>
          </div>

          <div 
            style={{
              ...styles.card,
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onClick={() => setOperationMode('encode')}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <Mail style={{color: '#60a5fa'}} size={28} />
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>ENCODE</h3>
                <p style={{color: '#93c5fd', margin: 0}}>Hide secret message in text</p>
              </div>
            </div>
          </div>

          <div 
            style={{
              ...styles.card,
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onClick={() => setOperationMode('decode')}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <MailOpen style={{color: '#a78bfa'}} size={28} />
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>DECODE</h3>
                <p style={{color: '#a78bfa', margin: 0}}>Extract hidden message from text</p>
              </div>
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
          <button
            onClick={() => {
              if (operationMode === 'encode') {
                setEncryptionLevel(null);
              } else {
                setOperationMode(null);
              }
            }}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 style={styles.title}>
            {operationMode === 'decode' ? 'DECODE MODE' : 'ENCODE MODE'}
          </h1>
          <p style={styles.subtitle}>
            {operationMode === 'decode' ? 'Extract hidden messages' : 'Hide messages in plain text'}
          </p>
        </div>

        {operationMode === 'decode' ? (
          <div style={{position: 'relative'}}>
            {processing && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1rem',
                zIndex: 10
              }}>
                <div style={{textAlign: 'center', color: '#60a5fa'}}>
                  <p style={{fontWeight: '600'}}>DECODING...</p>
                </div>
              </div>
            )}

            <div style={styles.card}>
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
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                <Clipboard size={18} />
                PASTE FROM CLIPBOARD
              </button>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste the encoded text here..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                DECRYPTION PASSWORD
              </label>
              <div style={{position: 'relative'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decodePassword}
                  onChange={(e) => setDecodePassword(e.target.value)}
                  placeholder="Enter decryption password..."
                  style={styles.input}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleDecode}
              disabled={!decodeInput || !decodePassword || processing}
              style={{
                ...styles.primaryButton,
                opacity: (!decodeInput || !decodePassword || processing) ? 0.5 : 1,
                cursor: (!decodeInput || !decodePassword || processing) ? 'not-allowed' : 'pointer',
              }}
            >
              DECODE MESSAGE
            </button>

            {decodeError && (
              <div style={{
                ...styles.card,
                backgroundColor: 'rgba(127, 29, 29, 0.4)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <AlertCircle style={{color: '#f87171', flexShrink: 0}} size={24} />
                <div>
                  <p style={{color: '#fca5a5', fontWeight: '700', marginBottom: '0.5rem'}}>DECODING RESULT</p>
                  <p style={{color: 'rgba(254, 226, 226, 0.9)'}}>{decodeError}</p>
                </div>
              </div>
            )}

            {decodedText && (
              <div style={styles.card}>
                <label style={{...styles.label, color: '#86efac'}}>
                  <Shield size={20} />
                  DECODED MESSAGE
                </label>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '0.5rem', padding: '1rem'}}>
                  <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{decodedText}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{position: 'relative'}}>
            {processing && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1rem',
                zIndex: 10
              }}>
                <div style={{textAlign: 'center', color: '#60a5fa'}}>
                  <p style={{fontWeight: '600'}}>ENCODING...</p>
                </div>
              </div>
            )}

            <div style={styles.card}>
              <label style={styles.label}>
                <Zap size={20} />
                SECRET MESSAGE
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter your confidential message to hide..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                ENCRYPTION PASSWORD
              </label>
              <div style={{position: 'relative'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={encodePassword}
                  onChange={(e) => setEncodePassword(e.target.value)}
                  placeholder="Enter encryption password..."
                  style={styles.input}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={styles.card}>
              <label style={styles.label}>
                <Shield size={20} />
                COVER TEXT
              </label>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <button
                  onClick={() => setUseCustomCover(false)}
                  style={{
                    flex: '1',
                    backgroundColor: !useCustomCover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                    color: !useCustomCover ? '#60a5fa' : '#94a3b8',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  AUTO-GENERATE
                </button>
                <button
                  onClick={() => setUseCustomCover(true)}
                  style={{
                    flex: '1',
                    backgroundColor: useCustomCover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                    color: useCustomCover ? '#60a5fa' : '#94a3b8',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  CUSTOM TEXT
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
                <button
                  onClick={() => setCoverText(generateCoverText())}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(71, 85, 105, 0.3)',
                    color: '#cbd5e1',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  GENERATE COVER TEXT
                </button>
              )}
            </div>

            <button
              onClick={handleEncode}
              disabled={!originalText || !encodePassword || processing}
              style={{
                ...styles.primaryButton,
                opacity: (!originalText || !encodePassword || processing) ? 0.5 : 1,
                cursor: (!originalText || !encodePassword || processing) ? 'not-allowed' : 'pointer',
              }}
            >
              ENCODE MESSAGE
            </button>

            {encodedOutput && (
              <div style={styles.card}>
                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{...styles.label, color: '#86efac'}}>
                    <Shield size={20} />
                    ENCODED MESSAGE READY
                  </label>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
                      color: '#86efac',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'COPIED!' : 'COPY SECURE TEXT'}
                  </button>
                </div>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '0.5rem', padding: '1rem'}}>
                  <p style={{marginBottom: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{coverText}</p>
                </div>
                <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', borderRadius: '0.5rem'}}>
                  <p style={{color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <Check size={18} />
                    MESSAGE SUCCESSFULLY ENCODED
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSteganography;
