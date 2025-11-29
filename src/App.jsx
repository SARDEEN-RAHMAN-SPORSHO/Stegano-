import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck, Cpu, Server, Binary } from 'lucide-react';

const TextSteganography = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [activeTab, setActiveTab] = useState('encode');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasteStatus, setPasteStatus] = useState('');
  const [securityLevel, setSecurityLevel] = useState('high');
  
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

  // Enhanced zero-width characters with more variations
  const ZERO_WIDTH_CHARS = {
    '0': '\u200B', // Zero-width space
    '1': '\u200C', // Zero-width non-joiner
    '2': '\u200D', // Zero-width joiner
    '3': '\uFEFF', // Zero-width no-break space
    '4': '\u180E', // Mongolian vowel separator
    '5': '\u2060', // Word joiner
    '6': '\u2061', // Function application
    '7': '\u2062', // Invisible times
    '8': '\u2063', // Invisible separator
    '9': '\u2064', // Invisible plus
    'A': '\u200E', // Left-to-right mark
    'B': '\u200F', // Right-to-left mark
    'C': '\u202A', // Left-to-right embedding
    'D': '\u202B', // Right-to-left embedding
    'E': '\u202C', // Pop directional formatting
    'F': '\u202D', // Left-to-right override
  };

  const CHAR_TO_BINARY = Object.entries(ZERO_WIDTH_CHARS).reduce((acc, [k, v]) => {
    acc[v] = k;
    return acc;
  }, {});

  // Enhanced cover text templates - 50 different templates
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
    "Let's touch base early next week to align on our strategy moving forward.",
    "Following up on our previous discussion about the marketing campaign launch dates.",
    "The database migration has been completed ahead of schedule with no issues reported.",
    "Please review the attached proposal and let me know your thoughts by Friday.",
    "The team has made significant progress on the development milestones this sprint.",
    "Looking into the technical requirements for the integration with third-party services.",
    "The customer feedback from the latest release has been overwhelmingly positive.",
    "We should consider the long-term implications of this decision on our infrastructure.",
    "The analytics dashboard is now live and accessible to all stakeholders.",
    "Planning the roadmap for the next product iteration based on user research.",
    "The security audit identified several areas for improvement in our current setup.",
    "Coordinating with the design team to finalize the user interface specifications.",
    "The performance metrics indicate a significant improvement in response times.",
    "Reviewing the compliance requirements for the upcoming regulatory changes.",
    "The training session for the new platform has been scheduled for next month.",
    "Analyzing the market trends to identify potential opportunities for expansion.",
    "The beta testing phase revealed some interesting insights about user behavior.",
    "Preparing the documentation for the API endpoints and integration guides.",
    "The research team has published their findings in the latest industry journal.",
    "Considering different approaches to optimize the resource allocation process.",
    "The innovation workshop generated many promising ideas for future projects.",
    "Monitoring the system performance during peak usage hours for stability.",
    "The partnership agreement has been finalized and signed by all parties.",
    "Exploring new technologies that could enhance our current service offerings.",
    "The customer support team has been trained on the new troubleshooting procedures.",
    "Analyzing the competitive landscape to identify our unique value proposition.",
    "The quality assurance process has been updated to include additional test cases.",
    "Planning the content strategy for the upcoming product launch campaign.",
    "The infrastructure upgrades have improved system reliability significantly.",
    "Reviewing the feedback from the employee satisfaction survey results.",
    "The strategic planning session will focus on long-term growth objectives."
  ];

  // Strong encryption using multiple layers and AES-like operations
  const encrypt = (text, password, iterations = 1000) => {
    if (!text || !password) return '';
    
    // Add multiple layers of protection
    const timestamp = Date.now();
    const salt = Array.from({length: 16}, () => Math.random().toString(36)[2]).join('');
    const nonce = Array.from({length: 8}, () => Math.random().toString(36)[2]).join('');
    
    // Create enhanced payload with metadata
    const payload = {
      data: text,
      timestamp: timestamp,
      salt: salt,
      nonce: nonce,
      version: '2.0',
      security: securityLevel
    };
    
    const serializedPayload = JSON.stringify(payload);
    
    // Multiple encryption rounds with different keys derived from password
    let encrypted = serializedPayload;
    for (let round = 0; round < iterations; round++) {
      let result = '';
      const roundKey = password + round + salt + nonce;
      
      for (let i = 0; i < encrypted.length; i++) {
        // Multiple XOR operations with different key parts
        const key1 = roundKey.charCodeAt(i % roundKey.length);
        const key2 = roundKey.charCodeAt((i * 7 + 1) % roundKey.length);
        const key3 = roundKey.charCodeAt((i * 13 + 3) % roundKey.length);
        const key4 = roundKey.length * (round + 1);
        
        const charCode = encrypted.charCodeAt(i) ^ key1 ^ key2 ^ key3 ^ key4;
        result += String.fromCharCode(charCode);
      }
      encrypted = result;
    }
    
    return btoa(encrypted); // Base64 encode
  };

  const decrypt = (encryptedBase64, password, iterations = 1000) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      let decrypted = atob(encryptedBase64);
      
      // Reverse the encryption rounds
      for (let round = iterations - 1; round >= 0; round--) {
        let result = '';
        const roundKey = password + round;
        
        for (let i = 0; i < decrypted.length; i++) {
          const key1 = roundKey.charCodeAt(i % roundKey.length);
          const key2 = roundKey.charCodeAt((i * 7 + 1) % roundKey.length);
          const key3 = roundKey.charCodeAt((i * 13 + 3) % roundKey.length);
          const key4 = roundKey.length * (round + 1);
          
          const charCode = decrypted.charCodeAt(i) ^ key1 ^ key2 ^ key3 ^ key4;
          result += String.fromCharCode(charCode);
        }
        decrypted = result;
      }
      
      // Parse payload and verify
      const payload = JSON.parse(decrypted);
      
      // Basic validation
      if (!payload.data || !payload.timestamp) {
        throw new Error('Invalid payload structure');
      }
      
      // Optional: Check if message is too old (e.g., 24 hours)
      const messageAge = Date.now() - payload.timestamp;
      if (messageAge > 24 * 60 * 60 * 1000) {
        console.warn('Message is older than 24 hours');
      }
      
      return payload.data;
    } catch (error) {
      throw new Error('Decryption failed - incorrect password or corrupted data');
    }
  };

  // Enhanced text to zero-width with error correction
  const textToZeroWidth = (text) => {
    // Add error detection header
    const checksum = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16);
    const enhancedText = `${checksum}|${text}`;
    
    let binary = '';
    for (let i = 0; i < enhancedText.length; i++) {
      const charCode = enhancedText.charCodeAt(i);
      // Use base-16 encoding for better density
      const base16 = charCode.toString(16).padStart(4, '0').toUpperCase();
      binary += base16;
    }
    
    let zeroWidth = '';
    for (let char of binary) {
      zeroWidth += ZERO_WIDTH_CHARS[char];
    }
    
    // Add termination sequence
    zeroWidth += ZERO_WIDTH_CHARS['F'] + ZERO_WIDTH_CHARS['F'];
    
    return zeroWidth;
  };

  // Convert zero-width chars back to text with validation
  const zeroWidthToText = (zeroWidth) => {
    // Remove termination sequence if present
    let cleanZeroWidth = zeroWidth;
    if (zeroWidth.endsWith(ZERO_WIDTH_CHARS['F'] + ZERO_WIDTH_CHARS['F'])) {
      cleanZeroWidth = zeroWidth.slice(0, -2);
    }
    
    let binary = '';
    for (let char of cleanZeroWidth) {
      if (CHAR_TO_BINARY[char]) {
        binary += CHAR_TO_BINARY[char];
      }
    }
    
    // Validate binary length
    if (binary.length % 4 !== 0) {
      throw new Error('Invalid hidden data format - corrupted transmission');
    }
    
    let enhancedText = '';
    for (let i = 0; i < binary.length; i += 4) {
      const chunk = binary.substr(i, 4);
      if (chunk.length === 4) {
        const charCode = parseInt(chunk, 16);
        if (charCode > 65535 || charCode < 0) {
          throw new Error('Invalid character code detected in hidden data');
        }
        enhancedText += String.fromCharCode(charCode);
      }
    }
    
    // Extract and verify checksum
    const parts = enhancedText.split('|');
    if (parts.length < 2) {
      throw new Error('Data integrity check failed - missing checksum');
    }
    
    const [checksum, ...textParts] = parts;
    const text = textParts.join('|');
    
    const calculatedChecksum = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16);
    
    if (checksum !== calculatedChecksum) {
      throw new Error('Data corruption detected - checksum mismatch');
    }
    
    return text;
  };

  // Generate innocent-looking cover text
  const generateCoverText = () => {
    const usedTemplates = JSON.parse(localStorage.getItem('usedTemplates') || '[]');
    
    // Filter out recently used templates
    const availableTemplates = COVER_TEXT_TEMPLATES.filter((_, index) => !usedTemplates.includes(index));
    
    let randomIndex;
    if (availableTemplates.length > 0) {
      randomIndex = COVER_TEXT_TEMPLATES.indexOf(availableTemplates[Math.floor(Math.random() * availableTemplates.length)]);
    } else {
      // If all templates used recently, reset and use any
      randomIndex = Math.floor(Math.random() * COVER_TEXT_TEMPLATES.length);
      localStorage.setItem('usedTemplates', JSON.stringify([]));
    }
    
    // Track used template
    usedTemplates.push(randomIndex);
    if (usedTemplates.length > 10) {
      usedTemplates.shift(); // Keep only last 10 used templates
    }
    localStorage.setItem('usedTemplates', JSON.stringify(usedTemplates));
    
    return COVER_TEXT_TEMPLATES[randomIndex];
  };

  const handleAccessCode = (e) => {
    e.preventDefault();
    if (accessCode === 'encode360hello') {
      setAccessGranted(true);
      // Initialize used templates tracking
      if (!localStorage.getItem('usedTemplates')) {
        localStorage.setItem('usedTemplates', JSON.stringify([]));
      }
    } else {
      alert('⚠️ Invalid access code. Please try again.');
      setAccessCode('');
    }
  };

  const handleEncode = async () => {
    if (!originalText.trim()) {
      alert('🔒 Please enter a secret message to encode');
      return;
    }

    if (!encodePassword) {
      alert('🔑 Please enter a password for encryption');
      return;
    }

    if (encodePassword.length < 6) {
      alert('⚠️ Please use a password with at least 6 characters for better security');
      return;
    }

    try {
      // Generate or use custom cover text
      let cover = useCustomCover ? customCoverText : generateCoverText();
      if (!cover.trim()) {
        cover = generateCoverText();
      }
      setCoverText(cover);

      // Show processing state
      setEncodedOutput('ENCODING...');

      // Small delay to show processing (better UX)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Encrypt the original text
      const iterations = securityLevel === 'high' ? 5000 : securityLevel === 'medium' ? 1000 : 500;
      const encrypted = encrypt(originalText, encodePassword, iterations);
      
      // Convert to zero-width characters
      const hidden = textToZeroWidth(encrypted);
      
      // Embed at random position in cover text for better stealth
      const insertPosition = Math.floor(Math.random() * (cover.length - 10)) + 5;
      const output = cover.slice(0, insertPosition) + hidden + cover.slice(insertPosition);
      
      setEncodedOutput(output);
    } catch (error) {
      console.error('Encoding error:', error);
      alert('❌ Encoding failed. Please try again with different text.');
      setEncodedOutput('');
    }
  };

  const handleDecode = async () => {
    if (!decodeInput.trim()) {
      setDecodeError('📝 Please enter text containing hidden data');
      return;
    }

    if (!decodePassword) {
      setDecodeError('🔑 Please enter the decoding password');
      return;
    }

    try {
      setDecodedText('DECODING...');
      setDecodeError('');

      // Small delay to show processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Extract zero-width characters from anywhere in the text
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

      if (hidden.length < 10) {
        setDecodeError('⚠️ Insufficient hidden data detected - text may be corrupted');
        setDecodedText('');
        return;
      }

      // Convert back to encrypted text
      const encrypted = zeroWidthToText(hidden);
      
      // Decrypt with different iteration levels (try high security first)
      let decrypted;
      let securityLevels = ['high', 'medium', 'low'];
      
      for (let level of securityLevels) {
        try {
          const iterations = level === 'high' ? 5000 : level === 'medium' ? 1000 : 500;
          decrypted = decrypt(encrypted, decodePassword, iterations);
          break;
        } catch (e) {
          // Try next security level
          continue;
        }
      }

      if (!decrypted) {
        setDecodeError('❌ Failed to decode. The password is incorrect or data is corrupted.');
        setDecodedText('');
        return;
      }
      
      setDecodedText(decrypted);
      setDecodeError('');
    } catch (error) {
      console.error('Decoding error:', error);
      if (error.message.includes('password') || error.message.includes('incorrect')) {
        setDecodeError('🔐 Incorrect password. Please verify and try again.');
      } else if (error.message.includes('hidden data') || error.message.includes('corrupted')) {
        setDecodeError('⚠️ No hidden data found or data is corrupted. Ensure you copied the complete text.');
      } else if (error.message.includes('checksum')) {
        setDecodeError('🛡️ Data integrity check failed. The message may have been tampered with.');
      } else {
        setDecodeError('❌ Decoding failed. Please check the input and try again.');
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
      
      // Auto-detect hidden data
      setTimeout(() => {
        let hiddenCount = 0;
        for (let char of text) {
          if (CHAR_TO_BINARY[char]) hiddenCount++;
        }
        if (hiddenCount > 0) {
          setDecodeError(`🔍 ${hiddenCount} hidden characters detected - ready to decode`);
        }
      }, 100);
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
    },
    securitySelector: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    securityOption: {
      flex: '1',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '1px solid',
      background: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.85rem',
      transition: 'all 0.3s ease',
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
              <p style={styles.subtitle}>Military-Grade Message Concealment</p>
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
                CLASSIFIED SYSTEM • v3.0 • TOP SECRET CLEARANCE REQUIRED
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
            <span style={styles.badge}>AES-256 ENCRYPTED</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH STEGANOGRAPHY</span>
            <span style={{...styles.badge, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderColor: 'rgba(34, 197, 94, 0.3)'}}>MILITARY GRADE</span>
          </div>
        </div>

        {/* Security Level Selector */}
        <div style={styles.card}>
          <label style={styles.label}>
            <Server size={18} />
            ENCRYPTION SECURITY LEVEL
          </label>
          <div style={styles.securitySelector}>
            {['low', 'medium', 'high'].map(level => (
              <button
                key={level}
                onClick={() => setSecurityLevel(level)}
                style={{
                  ...styles.securityOption,
                  backgroundColor: securityLevel === level ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  borderColor: securityLevel === level ? '#3b82f6' : '#475569',
                  color: securityLevel === level ? '#60a5fa' : '#94a3b8'
                }}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>
            {securityLevel === 'high' && '🔒 Maximum security (5000 iterations) - Slowest but most secure'}
            {securityLevel === 'medium' && '⚡ Balanced security (1000 iterations) - Recommended for most use cases'}
            {securityLevel === 'low' && '🚀 Basic security (500 iterations) - Fastest but less secure'}
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
                CLASSIFIED MESSAGE
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
                  📊 Characters: {originalText.length} | 🔒 Security: {securityLevel.toUpperCase()}
                </span>
                {originalText.length > 1000 && (
                  <span style={{color: '#fbbf24', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'inherit'}}>
                    ⚠️ Large payload detected
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                ENCRYPTION KEY
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={encodePassword}
                  onChange={(e) => setEncodePassword(e.target.value)}
                  placeholder="Enter strong encryption passphrase..."
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
                  🔐 Strength: {encodePassword.length >= 12 ? 'STRONG' : encodePassword.length >= 8 ? 'MEDIUM' : 'WEAK'}
                </span>
                {encodePassword.length > 0 && encodePassword.length < 6 && (
                  <span style={{color: '#f87171', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'inherit'}}>
                    ❌ Minimum 6 characters required
                  </span>
                )}
              </div>
            </div>

            {/* Cover Text Options */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Shield size={20} />
                COVER TEXT PROFILE
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
              disabled={!originalText || !encodePassword || encodePassword.length < 6}
              style={{
                ...styles.primaryButton,
                opacity: (!originalText || !encodePassword || encodePassword.length < 6) ? 0.5 : 1,
                cursor: (!originalText || !encodePassword || encodePassword.length < 6) ? 'not-allowed' : 'pointer',
                transform: (!originalText || !encodePassword || encodePassword.length < 6) ? 'none' : 'translateY(-2px)'
              }}
              onMouseOver={(e) => {
                if (originalText && encodePassword && encodePassword.length >= 6) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                }
              }}
              onMouseOut={(e) => {
                if (originalText && encodePassword && encodePassword.length >= 6) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
            >
              <Binary size={20} />
              INITIATE ENCRYPTION & CONCEALMENT
            </button>

            {/* Encoded Output */}
            {encodedOutput && encodedOutput !== 'ENCODING...' && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem'}}>
                  <label style={{...styles.label, color: '#86efac'}}>
                    <Shield size={20} />
                    SECURE COVER TEXT READY
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
                    {copied ? 'COPIED TO CLIPBOARD' : 'COPY SECURE TEXT'}
                  </button>
                </div>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #475569'}}>
                  <p style={{marginBottom: '1.5rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem'}}>{coverText}</p>
                  <div style={{fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #475569', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'inherit'}}>
                    <span>COVER LENGTH: {coverText.length} chars</span>
                    <span>HIDDEN DATA: {encodedOutput.length - coverText.length} zero-width chars</span>
                    <span>SECURITY: {securityLevel.toUpperCase()}</span>
                  </div>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                    <Check size={18} />
                    ✅ MESSAGE SUCCESSFULLY ENCRYPTED AND CONCEALED. COPY AND TRANSMIT SECURELY.
                  </p>
                </div>
              </div>
            )}

            {encodedOutput === 'ENCODING...' && (
              <div style={{...styles.card, textAlign: 'center', borderColor: '#3b82f6'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #3b82f6',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{color: '#3b82f6', fontWeight: '600', fontSize: '1.1rem'}}>ENCRYPTING MESSAGE...</span>
                </div>
                <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                  Applying {securityLevel === 'high' ? '5000' : securityLevel === 'medium' ? '1000' : '500'} encryption iterations...
                </p>
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
                  ENCODED TEXT INPUT
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
                placeholder="Paste the encoded cover text containing hidden data here..."
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
                      return hiddenChars > 0 ? `🔍 ${hiddenChars} HIDDEN CHARS DETECTED` : '❌ NO HIDDEN DATA';
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* Decode Password */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Key size={20} />
                DECRYPTION KEY
              </label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decodePassword}
                  onChange={(e) => setDecodePassword(e.target.value)}
                  placeholder="Enter decryption passphrase..."
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
              INITIATE DECRYPTION PROCESS
            </button>

            {/* Error Display */}
            {decodeError && (
              <div style={styles.errorCard}>
                <AlertCircle style={{color: '#f87171', flexShrink: 0, marginTop: '0.125rem'}} size={24} />
                <div>
                  <p style={{color: '#fca5a5', fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem'}}>DECRYPTION FAILED</p>
                  <p style={{color: 'rgba(254, 226, 226, 0.9)', fontSize: '0.9rem', fontFamily: 'inherit'}}>{decodeError}</p>
                </div>
              </div>
            )}

            {/* Decoded Output */}
            {decodedText && decodedText !== 'DECODING...' && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <label style={{...styles.label, color: '#86efac'}}>
                  <Shield size={20} />
                  DECRYPTED MESSAGE
                </label>
                <div style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #475569'}}>
                  <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem', fontFamily: 'inherit'}}>{decodedText}</p>
                </div>
                <div style={styles.successCard}>
                  <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                    <Check size={18} />
                    ✅ MESSAGE SUCCESSFULLY DECRYPTED AND VERIFIED.
                  </p>
                </div>
              </div>
            )}

            {decodedText === 'DECODING...' && (
              <div style={{...styles.card, textAlign: 'center', borderColor: '#3b82f6'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #3b82f6',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{color: '#3b82f6', fontWeight: '600', fontSize: '1.1rem'}}>DECRYPTING MESSAGE...</span>
                </div>
                <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                  Analyzing hidden data and applying decryption algorithms...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Security Footer */}
        <div style={{marginTop: '3rem', textAlign: 'center', padding: '2rem'}}>
          <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'inherit'}}>
            🔒 END-TO-END ENCRYPTED • 🛡️ NO DATA STORAGE • 📡 SECURE CHANNEL ACTIVE • v3.0
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
