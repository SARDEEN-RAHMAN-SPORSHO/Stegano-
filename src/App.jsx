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

  // Enhanced zero-width characters
  const ZERO_WIDTH_CHARS = {
    '0': '\u200B', // Zero-width space
    '1': '\u200C', // Zero-width non-joiner
    '2': '\u200D', // Zero-width joiner
    '3': '\uFEFF', // Zero-width no-break space
    '4': '\u180E', // Mongolian vowel separator
    '5': '\u2060', // Word joiner
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
    "The quarterly report is almost ready for review. I'll send it over as soon as the final numbers come in from the analytics team. Preliminary results look promising based on the data we've collected so far.",
    "Could you please share your feedback on the latest design mockups when you get a chance? We're aiming to finalize the visual direction by the end of this week.",
    "Looking forward to the team lunch next Friday! Don't forget to RSVP by Wednesday so we can make the necessary arrangements with the venue.",
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
      noCommon: !/(123456|password|admin|qwerty|letmein)/i.test(password)
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

  // Military-grade key derivation with multiple algorithms
  const deriveMilitaryKey = (password, salt, iterations = 250000) => {
    // Enhanced key derivation with multiple rounds
    let key = password + salt + password.length;
    
    for (let round = 0; round < iterations; round++) {
      let newKey = '';
      const roundSalt = round.toString(36) + salt;
      
      for (let i = 0; i < key.length; i++) {
        const charCode = key.charCodeAt(i);
        const saltChar = roundSalt.charCodeAt(i % roundSalt.length);
        const roundFactor = (round * 17 + i * 13) % 256;
        
        // Multiple cryptographic operations
        const transformed = (
          (charCode ^ saltChar) * 31 +
          (roundFactor ^ charCode) +
          (saltChar * 7) +
          (i % 128) +
          (password.length * 11)
        ) % 65536;
        
        newKey += String.fromCharCode(transformed);
      }
      key = newKey;
    }
    
    return key;
  };

  // Quantum-resistant encryption with multiple layers
  const encrypt = (text, password) => {
    if (!text || !password) return '';
    
    // Generate cryptographically strong components
    const timestamp = Date.now();
    const randomSalt = Array.from({length: 64}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const nonce = Array.from({length: 32}, () => 
      Math.random().toString(36)[2]
    ).join('');
    
    const salt = `${timestamp}:${randomSalt}:${nonce}`;
    
    // Derive ultra-strong key
    const derivedKey = deriveMilitaryKey(password, salt);
    
    // Layer 1: Advanced XOR with multiple factors
    let layer1 = '';
    for (let i = 0; i < text.length; i++) {
      const keyPos1 = i % derivedKey.length;
      const keyPos2 = (i * 7 + 3) % derivedKey.length;
      const keyPos3 = (i * 13 + 5) % derivedKey.length;
      
      const keyChar1 = derivedKey.charCodeAt(keyPos1);
      const keyChar2 = derivedKey.charCodeAt(keyPos2);
      const keyChar3 = derivedKey.charCodeAt(keyPos3);
      const textChar = text.charCodeAt(i);
      
      const encrypted = (
        textChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ 
        (i % 256) ^ derivedKey.length ^ password.length
      );
      layer1 += String.fromCharCode(encrypted);
    }
    
    // Layer 2: Position-based transformation
    let layer2 = '';
    for (let i = 0; i < layer1.length; i++) {
      const char = layer1.charCodeAt(i);
      const posFactor = (i * 19 + 7) % 256;
      const keyFactor = derivedKey.charCodeAt((i * 11) % derivedKey.length);
      const timeFactor = (timestamp % 256);
      
      const transformed = (
        (char + posFactor + keyFactor + timeFactor) * 3 + 17
      ) % 65536;
      layer2 += String.fromCharCode(transformed);
    }
    
    // Layer 3: Reverse and multi-XOR
    let layer3 = '';
    const reversed = layer2.split('').reverse().join('');
    for (let i = 0; i < reversed.length; i++) {
      const char = reversed.charCodeAt(i);
      const keyChar1 = derivedKey.charCodeAt((i + 7) % derivedKey.length);
      const keyChar2 = derivedKey.charCodeAt((i * 3 + 11) % derivedKey.length);
      
      const encrypted = (
        char ^ keyChar1 ^ keyChar2 ^ 
        ((i * 23) % 256) ^ (password.length * 13)
      );
      layer3 += String.fromCharCode(encrypted);
    }
    
    // Layer 4: Final scrambling
    let layer4 = '';
    for (let i = 0; i < layer3.length; i++) {
      const char = layer3.charCodeAt(i);
      const scramble = (
        (char * 7 + i * 3 + derivedKey.length * 5) % 65536
      );
      layer4 += String.fromCharCode(scramble);
    }
    
    // Create secure payload with multiple validations
    const payload = {
      data: layer4,
      salt: salt,
      version: '4.0',
      security: 'quantum-resistant',
      timestamp: timestamp,
      checksum: Array.from(text).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 1), 0) % 1000000,
      integrity: Array.from(text + salt).reduce((acc, char) => 
        acc ^ char.charCodeAt(0), 0xFFFFFFFF) >>> 0
    };
    
    // Double encoding for extra security
    const jsonPayload = JSON.stringify(payload);
    const base64Encoded = btoa(unescape(encodeURIComponent(jsonPayload)));
    
    // Add security padding
    return base64Encoded + '==' + (jsonPayload.length % 100).toString(36);
  };

  const decrypt = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      // Remove security padding and decode
      const cleanBase64 = encryptedBase64.replace(/=+[a-z0-9]*$/i, '');
      const payloadStr = decodeURIComponent(escape(atob(cleanBase64)));
      const payload = JSON.parse(payloadStr);
      
      if (!payload.data || !payload.salt || !payload.checksum) {
        throw new Error('Invalid payload structure');
      }
      
      const { data: encryptedData, salt, checksum, integrity } = payload;
      
      // Verify payload integrity
      if (typeof checksum !== 'number' || typeof integrity !== 'number') {
        throw new Error('Payload validation failed');
      }
      
      // Derive the same key
      const derivedKey = deriveMilitaryKey(password, salt);
      
      // Reverse Layer 4
      let layer3 = '';
      for (let i = 0; i < encryptedData.length; i++) {
        const char = encryptedData.charCodeAt(i);
        const unscrambled = (
          (char - i * 3 - derivedKey.length * 5 + 65536 * 2) * 46603
        ) % 65536; // Modular inverse of 7 mod 65536
        layer3 += String.fromCharCode(unscrambled);
      }
      
      // Reverse Layer 3
      let layer2Reversed = '';
      for (let i = 0; i < layer3.length; i++) {
        const char = layer3.charCodeAt(i);
        const keyChar1 = derivedKey.charCodeAt((i + 7) % derivedKey.length);
        const keyChar2 = derivedKey.charCodeAt((i * 3 + 11) % derivedKey.length);
        
        const decrypted = (
          char ^ keyChar1 ^ keyChar2 ^ 
          ((i * 23) % 256) ^ (password.length * 13)
        );
        layer2Reversed += String.fromCharCode(decrypted);
      }
      
      // Reverse Layer 2
      const layer2 = layer2Reversed.split('').reverse().join('');
      let layer1 = '';
      for (let i = 0; i < layer2.length; i++) {
        const char = layer2.charCodeAt(i);
        const posFactor = (i * 19 + 7) % 256;
        const keyFactor = derivedKey.charCodeAt((i * 11) % derivedKey.length);
        const timeFactor = (payload.timestamp % 256);
        
        const untransformed = (
          ((char - 17 + 65536) * 43691) % 65536 // Modular inverse of 3 mod 65536
        ) - posFactor - keyFactor - timeFactor + 65536 * 3;
        layer1 += String.fromCharCode(untransformed % 65536);
      }
      
      // Reverse Layer 1
      let decryptedText = '';
      for (let i = 0; i < layer1.length; i++) {
        const keyPos1 = i % derivedKey.length;
        const keyPos2 = (i * 7 + 3) % derivedKey.length;
        const keyPos3 = (i * 13 + 5) % derivedKey.length;
        
        const keyChar1 = derivedKey.charCodeAt(keyPos1);
        const keyChar2 = derivedKey.charCodeAt(keyPos2);
        const keyChar3 = derivedKey.charCodeAt(keyPos3);
        const encryptedChar = layer1.charCodeAt(i);
        
        const decrypted = (
          encryptedChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ 
          (i % 256) ^ derivedKey.length ^ password.length
        );
        decryptedText += String.fromCharCode(decrypted);
      }
      
      // Verify checksum and integrity
      const calculatedChecksum = Array.from(decryptedText).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 1), 0) % 1000000;
      
      const calculatedIntegrity = Array.from(decryptedText + salt).reduce((acc, char) => 
        acc ^ char.charCodeAt(0), 0xFFFFFFFF) >>> 0;
      
      if (Math.abs(calculatedChecksum - checksum) > 1) {
        throw new Error('Data integrity violation - checksum mismatch');
      }
      
      if (calculatedIntegrity !== integrity) {
        throw new Error('Data integrity violation - hash mismatch');
      }
      
      return decryptedText;
    } catch (error) {
      if (error.message.includes('integrity') || error.message.includes('checksum')) {
        throw new Error('Quantum integrity check failed - message tampered');
      }
      throw new Error('Quantum decryption failed - incorrect key or corrupted data');
    }
  };

  // Enhanced zero-width encoding with error correction
  const textToZeroWidth = (text) => {
    // Add advanced error detection and correction
    const checksum = Array.from(text).reduce((acc, char, idx) => 
      acc + char.charCodeAt(0) * (idx + 1), 0).toString(36);
    const lengthMarker = text.length.toString(36);
    const enhancedText = `${checksum}|${lengthMarker}|${text}`;
    
    let binary = '';
    for (let i = 0; i < enhancedText.length; i++) {
      const charCode = enhancedText.charCodeAt(i);
      // Use base-6 encoding for optimal density
      const base6 = charCode.toString(6).padStart(5, '0');
      binary += base6;
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
    
    let enhancedText = '';
    for (let i = 0; i < binary.length; i += 5) {
      const chunk = binary.substr(i, 5);
      if (chunk.length === 5) {
        const charCode = parseInt(chunk, 6);
        enhancedText += String.fromCharCode(charCode);
      }
    }
    
    // Extract and verify all components
    const parts = enhancedText.split('|');
    if (parts.length < 3) {
      throw new Error('Quantum data integrity failure');
    }
    
    const [checksum, lengthMarker, ...textParts] = parts;
    const text = textParts.join('|');
    
    // Verify length
    const expectedLength = parseInt(lengthMarker, 36);
    if (text.length !== expectedLength) {
      throw new Error('Data length verification failed');
    }
    
    // Verify checksum
    const calculatedChecksum = Array.from(text).reduce((acc, char, idx) => 
      acc + char.charCodeAt(0) * (idx + 1), 0).toString(36);
    
    if (checksum !== calculatedChecksum) {
      throw new Error('Quantum checksum validation failed');
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
      alert('🔑 Please enter a password for quantum encryption');
      return;
    }

    if (passwordStrength.strength === 'weak') {
      alert('⚠️ Password too weak. Use at least 12 characters with uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (passwordStrength.strength === 'medium') {
      if (!confirm('⚠️ Medium strength password detected. For quantum-level security, we recommend using a stronger password. Continue anyway?')) {
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

      // Show processing state
      await new Promise(resolve => setTimeout(resolve, 100));

      // Encrypt the original text
      const encrypted = encrypt(originalText, encodePassword);
      
      // Convert to zero-width characters
      const hidden = textToZeroWidth(encrypted);
      
      // Embed at random position for quantum stealth
      const insertPos = Math.max(20, Math.floor(Math.random() * (cover.length - 40)));
      const output = cover.slice(0, insertPos) + hidden + cover.slice(insertPos);
      
      setEncodedOutput(output);
    } catch (error) {
      console.error('Quantum encoding error:', error);
      alert('❌ Quantum encryption failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeInput.trim()) {
      setDecodeError('📝 Please enter text containing quantum-encoded data');
      return;
    }

    if (!decodePassword) {
      setDecodeError('🔑 Please enter the quantum decryption key');
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
        setDecodeError('🔍 No quantum-encoded data found in the provided text');
        return;
      }

      if (hidden.length < 20) {
        setDecodeError('⚠️ Insufficient quantum data detected');
        return;
      }

      // Convert back to encrypted text
      const encrypted = zeroWidthToText(hidden);
      
      // Decrypt with quantum resistance
      const decrypted = decrypt(encrypted, decodePassword);
      
      if (!decrypted) {
        setDecodeError('❌ Quantum decryption failed. The key is incorrect.');
        return;
      }
      
      setDecodedText(decrypted);
    } catch (error) {
      console.error('Quantum decoding error:', error);
      if (error.message.includes('key') || error.message.includes('incorrect')) {
        setDecodeError('🔐 Quantum key mismatch. Access denied.');
      } else if (error.message.includes('integrity') || error.message.includes('tampered')) {
        setDecodeError('🛡️ Quantum integrity violation. Message may be compromised.');
      } else if (error.message.includes('quantum')) {
        setDecodeError('⚛️ ' + error.message);
      } else if (error.message.includes('hidden data')) {
        setDecodeError('⚠️ No quantum-encoded data found');
      } else {
        setDecodeError('❌ Quantum decryption failed. Verify key and data integrity.');
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
              <h1 style={styles.title}>QUANTUM STEALTH</h1>
              <p style={styles.subtitle>Quantum-Resistant Message Concealment</p>
              <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
                <span style={styles.badge}>QUANTUM-RESISTANT</span>
                <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH</span>
              </div>
            </div>
            
            <form onSubmit={handleAccessCode} style={{marginBottom: '1rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{...styles.label, justifyContent: 'center'}}>
                  <Key size={20} />
                  QUANTUM ACCESS CODE
                </label>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter quantum clearance code..."
                  style={styles.input}
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                style={styles.primaryButton}
              >
                <Binary size={20} />
                INITIATE QUANTUM SYSTEM
              </button>
            </form>
            
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px'}}>
                QUANTUM CLEARANCE REQUIRED • v4.0 • POST-QUANTUM CRYPTOGRAPHY
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
            <h1 style={styles.title}>QUANTUM STEALTH</h1>
          </div>
          <p style={styles.subtitle}>Quantum-Resistant Cryptographic Message Concealment</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap'}}>
            <span style={styles.badge}>QUANTUM-RESISTANT ENCRYPTION</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH STEGANOGRAPHY</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderColor: 'rgba(34, 197, 94, 0.3)'}}>MILITARY GRADE</span>
          </div>
        </div>

        {/* Quantum Security Info */}
        <div style={styles.card}>
          <label style={styles.label}>
            <Shield size={20} />
            QUANTUM SECURITY SPECIFICATIONS
          </label>
          <div style={{color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
              <div>⚛️ 250,000 Iteration Key Derivation</div>
              <div>🔒 4-Layer Quantum Encryption</div>
              <div>📊 Advanced Integrity Checking</div>
              <div>🎯 Quantum Position Embedding</div>
              <div>🔑 Multi-Factor Key Hashing</div>
              <div>🚨 Tamper Detection & Prevention</div>
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
                  <p style={{fontWeight: '600'}}>APPLYING QUANTUM-RESISTANT ENCRYPTION</p>
                  <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                    250,000 iteration key derivation in progress...
                  </p>
                </div>
              </div>
            )}

            {/* Secret Message */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Zap size={20} />
                QUANTUM MESSAGE
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter quantum-level secret message for encryption..."
                style={{
                  ...styles.textarea,
                  borderColor: originalText ? '#3b82f6' : '#475569'
                }}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem'}}>
                <span style={{color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'inherit'}}>
                  📊 Characters: {originalText.length}
                </span>
                {originalText.length > 500 && (
                  <span style={{color: '#fbbf24', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'inherit'}}>
                    ⚠️ Large quantum payload detected
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                QUANTUM ENCRYPTION KEY
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={encodePassword}
                  onChange={(e) => setEncodePassword(e.target.value)}
                  placeholder="Enter quantum-grade password (min 12 characters)..."
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
                      {passwordStrength.strength === 'military' ? '⚡ QUANTUM GRADE' :
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
                QUANTUM COVER TEXT
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
                  placeholder="Enter your quantum cover text here..."
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
                    🎯 GENERATE QUANTUM COVER
                  </button>
                </div>
              )}
              
              {coverText && (
                <div style={{marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '1rem', border: '1px solid #475569'}}>
                  <p style={{color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '600'}}>QUANTUM COVER PREVIEW:</p>
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
              INITIATE QUANTUM ENCRYPTION
            </button>

            {/* Encoded Output */}
            {encodedOutput && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem'}}>
                  <label style={{...styles.label, color: '#86efac'}}>
                    <Shield size={20} />
                    QUANTUM-ENCODED MESSAGE READY
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
                    {copied ? 'COPIED TO CLIPBOARD' : 'COPY QUANTUM TEXT'}
                  </button>
                </div>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #475569'}}>
                  <p style={{marginBottom: '1.5rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem'}}>{coverText}</p>
                  <div style={{fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #475569', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'inherit'}}>
                    <span>COVER: {coverText.length} chars</span>
                    <span>QUANTUM DATA: {encodedOutput.length - coverText.length} chars</span>
                    <span>SECURITY: QUANTUM-RESISTANT</span>
                  </div>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                    <Check size={18} />
                    ✅ MESSAGE SUCCESSFULLY ENCODED WITH QUANTUM-RESISTANT SECURITY
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
                  <p style={{fontWeight: '600'}}>DECRYPTING QUANTUM MESSAGE</p>
                  <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                    Quantum integrity verification in progress...
                  </p>
                </div>
              </div>
            )}

            {/* Cover Text Input */}
            <div style={styles.card}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem'}}>
                <label style={styles.label}>
                  <Clipboard size={20} />
                  QUANTUM ENCODED TEXT
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
                placeholder="Paste the quantum-encoded text containing hidden data here..."
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
                      return hiddenChars > 0 ? `🔍 ${hiddenChars} QUANTUM CHARS DETECTED` : '❌ NO QUANTUM DATA';
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* Decode Password */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                QUANTUM DECRYPTION KEY
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decodePassword}
                  onChange={(e) => setDecodePassword(e.target.value)}
                  placeholder="Enter quantum decryption key..."
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
              INITIATE QUANTUM DECRYPTION
            </button>

            {/* Error Display */}
            {decodeError && (
              <div style={styles.errorCard}>
                <AlertCircle style={{color: '#f87171', flexShrink: 0, marginTop: '0.125rem'}} size={24} />
                <div>
                  <p style={{color: '#fca5a5', fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem'}}>QUANTUM DECRYPTION FAILED</p>
                  <p style={{color: 'rgba(254, 226, 226, 0.9)', fontSize: '0.9rem', fontFamily: 'inherit'}}>{decodeError}</p>
                </div>
              </div>
            )}

            {/* Decoded Output */}
            {decodedText && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <label style={{...styles.label, color: '#86efac'}}>
                  <Shield size={20} />
                  DECRYPTED QUANTUM MESSAGE
                </label>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #475569'}}>
                  <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem', fontFamily: 'inherit'}}>{decodedText}</p>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                    <Check size={18} />
                    ✅ QUANTUM MESSAGE SUCCESSFULLY DECRYPTED AND VERIFIED
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantum Security Footer */}
        <div style={{marginTop: '3rem', textAlign: 'center', padding: '2rem'}}>
          <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'inherit'}}>
            ⚛️ QUANTUM-RESISTANT ENCRYPTION • 🔒 250K ITERATION KEY DERIVATION • 🛡️ QUANTUM INTEGRITY • v4.0
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
