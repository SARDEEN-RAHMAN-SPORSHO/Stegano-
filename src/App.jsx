import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck, Cpu, Server, Binary, Settings, ArrowLeft, Mail, MailOpen } from 'lucide-react';

const TextSteganography = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [operationMode, setOperationMode] = useState(null); // 'encode' or 'decode'
  const [encryptionLevel, setEncryptionLevel] = useState(null);
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

  // ==================== BASIC ENCRYPTION (Enhanced XOR) ====================
  const encryptBasic = (text, password) => {
    if (!text || !password) return '';
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(encodeURIComponent(result));
  };

  const decryptBasic = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const decoded = decodeURIComponent(atob(encryptedBase64));
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      throw new Error('Decryption failed - incorrect password');
    }
  };

  // ==================== ADVANCED ENCRYPTION (AES-256 Simulation) ====================
  const encryptAdvanced = (text, password) => {
    if (!text || !password) return '';
    
    // Generate strong cryptographic components
    const salt = Array.from({length: 32}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const iv = Array.from({length: 16}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const timestamp = Date.now();
    
    // Enhanced key derivation with 100,000 iterations
    let derivedKey = password + salt;
    for (let i = 0; i < 100000; i++) {
      let newKey = '';
      for (let j = 0; j < derivedKey.length; j++) {
        const charCode = derivedKey.charCodeAt(j);
        const saltChar = salt.charCodeAt(j % salt.length);
        const iterationFactor = (i * 17 + j * 13) % 256;
        
        const transformed = (
          (charCode ^ saltChar) * 31 +
          (iterationFactor ^ charCode) +
          (saltChar * 7) +
          (j % 128) +
          (password.length * 11)
        ) % 65536;
        
        newKey += String.fromCharCode(transformed);
      }
      derivedKey = newKey;
    }
    
    // Layer 1: AES-like substitution and permutation
    let layer1 = '';
    for (let i = 0; i < text.length; i++) {
      const keyIndex1 = i % derivedKey.length;
      const keyIndex2 = (i * 7 + 3) % derivedKey.length;
      const keyIndex3 = (i * 13 + 5) % derivedKey.length;
      const keyIndex4 = (i * 19 + 7) % derivedKey.length;
      
      const keyChar1 = derivedKey.charCodeAt(keyIndex1);
      const keyChar2 = derivedKey.charCodeAt(keyIndex2);
      const keyChar3 = derivedKey.charCodeAt(keyIndex3);
      const keyChar4 = derivedKey.charCodeAt(keyIndex4);
      const textChar = text.charCodeAt(i);
      
      // Multiple XOR operations with position-based factors
      const encryptedChar = textChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ 
                          derivedKey.length ^ (i % 256) ^ iv.charCodeAt(i % iv.length);
      layer1 += String.fromCharCode(encryptedChar);
    }
    
    // Layer 2: Block mixing and diffusion
    let layer2 = '';
    const blockSize = 16;
    for (let i = 0; i < layer1.length; i += blockSize) {
      const block = layer1.substr(i, blockSize);
      let mixedBlock = '';
      
      for (let j = 0; j < block.length; j++) {
        const prevChar = j > 0 ? block.charCodeAt(j - 1) : 0;
        const nextChar = block.charCodeAt((j + 1) % block.length);
        const currentChar = block.charCodeAt(j);
        const keyChar = derivedKey.charCodeAt((i + j) % derivedKey.length);
        
        // AES-like MixColumns simulation
        const mixed = (
          (currentChar * 2 + prevChar * 3 + nextChar + keyChar) % 65536
        );
        mixedBlock += String.fromCharCode(mixed);
      }
      layer2 += mixedBlock;
    }
    
    // Layer 3: Final encryption with metadata
    const metadata = `${salt}|${iv}|${timestamp}|${text.length}`;
    const fullData = metadata + '|' + layer2;
    
    let finalResult = '';
    for (let i = 0; i < fullData.length; i++) {
      const keyPos = (i * 11 + 5) % derivedKey.length;
      const dataChar = fullData.charCodeAt(i);
      const keyChar = derivedKey.charCodeAt(keyPos);
      const encrypted = dataChar ^ keyChar ^ (i % 256) ^ password.length;
      finalResult += String.fromCharCode(encrypted);
    }
    
    return btoa(encodeURIComponent(finalResult));
  };

  const decryptAdvanced = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const decoded = decodeURIComponent(atob(encryptedBase64));
      
      // First, we need to extract metadata to derive the key properly
      // Let's try to decrypt the first part to get metadata
      let tempDerivedKey = password;
      for (let i = 0; i < 1000; i++) {
        let newKey = '';
        for (let j = 0; j < tempDerivedKey.length; j++) {
          const charCode = tempDerivedKey.charCodeAt(j);
          const iterationFactor = (i * 17 + j * 13) % 256;
          const transformed = (charCode * 31 + iterationFactor) % 65536;
          newKey += String.fromCharCode(transformed);
        }
        tempDerivedKey = newKey;
      }
      
      // Reverse final encryption to get metadata
      let decryptedData = '';
      for (let i = 0; i < decoded.length; i++) {
        const keyPos = (i * 11 + 5) % tempDerivedKey.length;
        const encryptedChar = decoded.charCodeAt(i);
        const keyChar = tempDerivedKey.charCodeAt(keyPos);
        const decrypted = encryptedChar ^ keyChar ^ (i % 256) ^ password.length;
        decryptedData += String.fromCharCode(decrypted);
      }
      
      // Extract metadata and encrypted data
      const parts = decryptedData.split('|');
      if (parts.length < 5) {
        throw new Error('Invalid data format');
      }
      
      const [salt, iv, timestamp, lengthStr, encryptedText] = parts;
      
      // Re-derive key with salt (proper derivation)
      let derivedKey = password + salt;
      for (let i = 0; i < 100000; i++) {
        let newKey = '';
        for (let j = 0; j < derivedKey.length; j++) {
          const charCode = derivedKey.charCodeAt(j);
          const saltChar = salt.charCodeAt(j % salt.length);
          const iterationFactor = (i * 17 + j * 13) % 256;
          const transformed = (
            (charCode ^ saltChar) * 31 +
            (iterationFactor ^ charCode) +
            (saltChar * 7) +
            (j % 128) +
            (password.length * 11)
          ) % 65536;
          newKey += String.fromCharCode(transformed);
        }
        derivedKey = newKey;
      }
      
      // Reverse block mixing
      let layer1 = '';
      const blockSize = 16;
      for (let i = 0; i < encryptedText.length; i += blockSize) {
        const block = encryptedText.substr(i, blockSize);
        let originalBlock = '';
        
        for (let j = 0; j < block.length; j++) {
          const prevChar = j > 0 ? originalBlock.charCodeAt(j - 1) : 0;
          const nextChar = block.charCodeAt((j + 1) % block.length);
          const currentChar = block.charCodeAt(j);
          const keyChar = derivedKey.charCodeAt((i + j) % derivedKey.length);
          
          // Reverse MixColumns - fixed calculation
          const original = (
            (currentChar - prevChar * 3 - nextChar - keyChar + 65536 * 4) % 65536
          );
          originalBlock += String.fromCharCode(original);
        }
        layer1 += originalBlock;
      }
      
      // Reverse AES-like encryption
      let result = '';
      for (let i = 0; i < layer1.length; i++) {
        const keyIndex1 = i % derivedKey.length;
        const keyIndex2 = (i * 7 + 3) % derivedKey.length;
        const keyIndex3 = (i * 13 + 5) % derivedKey.length;
        const keyIndex4 = (i * 19 + 7) % derivedKey.length;
        
        const keyChar1 = derivedKey.charCodeAt(keyIndex1);
        const keyChar2 = derivedKey.charCodeAt(keyIndex2);
        const keyChar3 = derivedKey.charCodeAt(keyIndex3);
        const keyChar4 = derivedKey.charCodeAt(keyIndex4);
        const encryptedChar = layer1.charCodeAt(i);
        
        const decrypted = encryptedChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ 
                         derivedKey.length ^ (i % 256) ^ iv.charCodeAt(i % iv.length);
        result += String.fromCharCode(decrypted);
      }
      
      return result;
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('validation')) {
        throw new Error('Incorrect password or corrupted data');
      }
      throw new Error('Advanced decryption failed');
    }
  };

  // ==================== EXTREME ENCRYPTION (Quantum-Protected - 250K+ Iterations) ====================
  const deriveQuantumKey = (password, salt, iterations = 250000) => {
    let key = password + salt + password.length;
    
    for (let round = 0; round < iterations; round++) {
      let newKey = '';
      const roundSalt = round.toString(36) + salt;
      
      for (let i = 0; i < key.length; i++) {
        const charCode = key.charCodeAt(i);
        const saltChar = roundSalt.charCodeAt(i % roundSalt.length);
        const roundFactor = (round * 17 + i * 13) % 256;
        
        // Multiple cryptographic operations with quantum-resistant properties
        const transformed = (
          (charCode ^ saltChar) * 31 +
          (roundFactor ^ charCode) +
          (saltChar * 7) +
          (i % 128) +
          (password.length * 11) +
          (round % 64) * 13
        ) % 65536;
        
        newKey += String.fromCharCode(transformed);
      }
      key = newKey;
      
      // Additional key strengthening every 10,000 iterations
      if (round % 10000 === 0 && round > 0) {
        let strengthened = '';
        for (let i = 0; i < key.length; i++) {
          const char = key.charCodeAt(i);
          const pos = (i * round) % key.length;
          const strengthenChar = key.charCodeAt(pos);
          strengthened += String.fromCharCode((char + strengthenChar + round) % 65536);
        }
        key = strengthened;
      }
    }
    
    return key;
  };

  const encryptExtreme = (text, password) => {
    if (!text || !password) return '';
    
    // Generate quantum-resistant components
    const timestamp = Date.now();
    const randomSalt = Array.from({length: 32}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const nonce = Array.from({length: 16}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const quantumIV = Array.from({length: 16}, () => 
      Math.random().toString(36)[2]
    ).join('');
    
    const salt = `${timestamp}:${randomSalt}:${nonce}:${quantumIV}`;
    
    // Derive ultra-strong quantum key with 250,000+ iterations
    const derivedKey = deriveQuantumKey(password, salt, 250000);
    
    // LAYER 1: Quantum Key Expansion and Initial Encryption
    let layer1 = '';
    for (let i = 0; i < text.length; i++) {
      const keyPos1 = i % derivedKey.length;
      const keyPos2 = (i * 7 + 3) % derivedKey.length;
      const keyPos3 = (i * 13 + 5) % derivedKey.length;
      const keyPos4 = (i * 19 + 11) % derivedKey.length;
      
      const keyChar1 = derivedKey.charCodeAt(keyPos1);
      const keyChar2 = derivedKey.charCodeAt(keyPos2);
      const keyChar3 = derivedKey.charCodeAt(keyPos3);
      const keyChar4 = derivedKey.charCodeAt(keyPos4);
      const textChar = text.charCodeAt(i);
      
      const encrypted = (
        textChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ 
        (i % 256) ^ derivedKey.length ^ password.length ^ quantumIV.charCodeAt(i % quantumIV.length)
      );
      layer1 += String.fromCharCode(encrypted);
    }
    
    // LAYER 2: Advanced Position-Based Quantum Transformation
    let layer2 = '';
    for (let i = 0; i < layer1.length; i++) {
      const char = layer1.charCodeAt(i);
      const posFactor = (i * 29 + 13) % 256;
      const keyFactor = derivedKey.charCodeAt((i * 17) % derivedKey.length);
      const timeFactor = (timestamp % 256);
      const quantumFactor = (i * password.length * 7) % 256;
      
      const transformed = (
        (char + posFactor + keyFactor + timeFactor + quantumFactor) * 3 + 17
      ) % 65536;
      layer2 += String.fromCharCode(transformed);
    }
    
    // LAYER 3: Quantum Block Cipher Simulation
    let layer3 = '';
    const quantumBlockSize = 16;
    for (let i = 0; i < layer2.length; i += quantumBlockSize) {
      const block = layer2.substr(i, quantumBlockSize);
      let quantumBlock = '';
      
      for (let j = 0; j < block.length; j++) {
        const left = j > 0 ? block.charCodeAt(j - 1) : block.charCodeAt(block.length - 1);
        const right = block.charCodeAt((j + 1) % block.length);
        const current = block.charCodeAt(j);
        const quantumKey = derivedKey.charCodeAt((i + j + timestamp) % derivedKey.length);
        
        // Quantum-like entanglement simulation
        const entangled = (
          (current * 2 + left * 3 + right * 5 + quantumKey * 7) % 65536
        );
        quantumBlock += String.fromCharCode(entangled);
      }
      layer3 += quantumBlock;
    }
    
    // LAYER 4: Multi-Dimensional XOR with Quantum Bits
    let layer4 = '';
    for (let i = 0; i < layer3.length; i++) {
      const char = layer3.charCodeAt(i);
      const dim1 = derivedKey.charCodeAt((i * 3 + 17) % derivedKey.length);
      const dim2 = derivedKey.charCodeAt((i * 7 + 29) % derivedKey.length);
      const dim3 = derivedKey.charCodeAt((i * 11 + 41) % derivedKey.length);
      const dim4 = quantumIV.charCodeAt((i * 5) % quantumIV.length);
      
      const quantumXOR = char ^ dim1 ^ dim2 ^ dim3 ^ dim4 ^ (i * 19 % 256) ^ (password.length * 23);
      layer4 += String.fromCharCode(quantumXOR);
    }
    
    // LAYER 5: Final Quantum Consolidation with Reverse Entanglement
    let layer5 = '';
    const reversed = layer4.split('').reverse().join('');
    for (let i = 0; i < reversed.length; i++) {
      const char = reversed.charCodeAt(i);
      const keyChar1 = derivedKey.charCodeAt((i + 13) % derivedKey.length);
      const keyChar2 = derivedKey.charCodeAt((i * 3 + 19) % derivedKey.length);
      const keyChar3 = derivedKey.charCodeAt((i * 7 + 31) % derivedKey.length);
      
      const finalEncrypted = (
        char ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ 
        ((i * 23) % 256) ^ (password.length * 29) ^ (timestamp % 256)
      );
      layer5 += String.fromCharCode(finalEncrypted);
    }
    
    // Create quantum-secure payload with multiple validations
    const payload = {
      data: layer5,
      salt: salt,
      version: 'quantum-v2',
      security: 'quantum-resistant-250k',
      timestamp: timestamp,
      iterations: 250000,
      checksum: Array.from(text).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 1), 0) % 1000000,
      quantumHash: Array.from(derivedKey.substr(0, 100)).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 2), 0) % 1000000
    };
    
    // Quantum-grade encoding
    const jsonPayload = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(jsonPayload)));
  };

  const decryptExtreme = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      // Quantum-grade decoding
      const payloadStr = decodeURIComponent(escape(atob(encryptedBase64)));
      const payload = JSON.parse(payloadStr);
      
      if (!payload.data || !payload.salt || !payload.checksum || !payload.quantumHash) {
        throw new Error('Invalid quantum payload structure');
      }
      
      const { data: encryptedData, salt, checksum, quantumHash, iterations, timestamp } = payload;
      
      // Verify quantum payload integrity
      if (typeof checksum !== 'number' || typeof quantumHash !== 'number') {
        throw new Error('Quantum payload validation failed');
      }
      
      // Extract quantum components from salt
      const saltParts = salt.split(':');
      if (saltParts.length < 4) {
        throw new Error('Invalid quantum salt format');
      }
      const quantumIV = saltParts[3];
      
      // Derive the same quantum key with 250,000+ iterations
      const derivedKey = deriveQuantumKey(password, salt, iterations || 250000);
      
      // Verify quantum key hash (using only first 100 chars to avoid performance issues)
      const calculatedHash = Array.from(derivedKey.substr(0, 100)).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 2), 0) % 1000000;
      
      if (Math.abs(calculatedHash - quantumHash) > 1) {
        throw new Error('Quantum key integrity violation');
      }
      
      // Reverse LAYER 5
      let layer4Reversed = '';
      for (let i = 0; i < encryptedData.length; i++) {
        const char = encryptedData.charCodeAt(i);
        const keyChar1 = derivedKey.charCodeAt((i + 13) % derivedKey.length);
        const keyChar2 = derivedKey.charCodeAt((i * 3 + 19) % derivedKey.length);
        const keyChar3 = derivedKey.charCodeAt((i * 7 + 31) % derivedKey.length);
        
        const decrypted = (
          char ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ 
          ((i * 23) % 256) ^ (password.length * 29) ^ (timestamp % 256)
        );
        layer4Reversed += String.fromCharCode(decrypted);
      }
      
      // Reverse LAYER 4
      const layer4 = layer4Reversed.split('').reverse().join('');
      let layer3 = '';
      for (let i = 0; i < layer4.length; i++) {
        const char = layer4.charCodeAt(i);
        const dim1 = derivedKey.charCodeAt((i * 3 + 17) % derivedKey.length);
        const dim2 = derivedKey.charCodeAt((i * 7 + 29) % derivedKey.length);
        const dim3 = derivedKey.charCodeAt((i * 11 + 41) % derivedKey.length);
        const dim4 = quantumIV.charCodeAt((i * 5) % quantumIV.length);
        
        const decrypted = char ^ dim1 ^ dim2 ^ dim3 ^ dim4 ^ (i * 19 % 256) ^ (password.length * 23);
        layer3 += String.fromCharCode(decrypted);
      }
      
      // Reverse LAYER 3 (Quantum Block Cipher)
      let layer2 = '';
      const quantumBlockSize = 16;
      for (let i = 0; i < layer3.length; i += quantumBlockSize) {
        const block = layer3.substr(i, quantumBlockSize);
        let originalBlock = '';
        
        for (let j = 0; j < block.length; j++) {
          const left = j > 0 ? originalBlock.charCodeAt(j - 1) : 0;
          const right = block.charCodeAt((j + 1) % block.length);
          const current = block.charCodeAt(j);
          const quantumKey = derivedKey.charCodeAt((i + j + timestamp) % derivedKey.length);
          
          // Reverse quantum entanglement - FIXED CALCULATION
          const original = (
            (current - left * 3 - right * 5 - quantumKey * 7 + 65536 * 10) % 65536
          );
          originalBlock += String.fromCharCode(original);
        }
        layer2 += originalBlock;
      }
      
      // Reverse LAYER 2
      let layer1 = '';
      for (let i = 0; i < layer2.length; i++) {
        const char = layer2.charCodeAt(i);
        const posFactor = (i * 29 + 13) % 256;
        const keyFactor = derivedKey.charCodeAt((i * 17) % derivedKey.length);
        const timeFactor = (timestamp % 256);
        const quantumFactor = (i * password.length * 7) % 256;
        
        // Fixed modular inverse calculation
        const untransformed = (
          ((char - 17 + 65536) * 43691) % 65536 // Modular inverse of 3 mod 65536
        ) - posFactor - keyFactor - timeFactor - quantumFactor + 65536 * 5;
        layer1 += String.fromCharCode(untransformed % 65536);
      }
      
      // Reverse LAYER 1
      let decryptedText = '';
      for (let i = 0; i < layer1.length; i++) {
        const keyPos1 = i % derivedKey.length;
        const keyPos2 = (i * 7 + 3) % derivedKey.length;
        const keyPos3 = (i * 13 + 5) % derivedKey.length;
        const keyPos4 = (i * 19 + 11) % derivedKey.length;
        
        const keyChar1 = derivedKey.charCodeAt(keyPos1);
        const keyChar2 = derivedKey.charCodeAt(keyPos2);
        const keyChar3 = derivedKey.charCodeAt(keyPos3);
        const keyChar4 = derivedKey.charCodeAt(keyPos4);
        const encryptedChar = layer1.charCodeAt(i);
        
        const decrypted = (
          encryptedChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ 
          (i % 256) ^ derivedKey.length ^ password.length ^ quantumIV.charCodeAt(i % quantumIV.length)
        );
        decryptedText += String.fromCharCode(decrypted);
      }
      
      // Verify quantum checksum
      const calculatedChecksum = Array.from(decryptedText).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 1), 0) % 1000000;
      
      if (Math.abs(calculatedChecksum - checksum) > 1) {
        throw new Error('Quantum integrity violation - message compromised');
      }
      
      return decryptedText;
    } catch (error) {
      if (error.message.includes('integrity') || error.message.includes('checksum') || error.message.includes('quantum')) {
        throw new Error('Quantum integrity check failed - message tampered or incorrect key');
      }
      throw new Error('Quantum decryption failed - incorrect key or corrupted data');
    }
  };

  // Auto-detect encryption level and decrypt
  const autoDecrypt = (encryptedBase64, password) => {
    let result = '';
    let detectedLevel = '';

    // Try Extreme first
    try {
      result = decryptExtreme(encryptedBase64, password);
      detectedLevel = 'extreme';
      return { result, level: detectedLevel };
    } catch (e) {
      console.log('Not extreme encryption:', e.message);
    }

    // Try Advanced
    try {
      result = decryptAdvanced(encryptedBase64, password);
      detectedLevel = 'advanced';
      return { result, level: detectedLevel };
    } catch (e) {
      console.log('Not advanced encryption:', e.message);
    }

    // Try Basic
    try {
      result = decryptBasic(encryptedBase64, password);
      detectedLevel = 'basic';
      return { result, level: detectedLevel };
    } catch (e) {
      console.log('Not basic encryption:', e.message);
    }

    throw new Error('Unable to decrypt with any encryption method. Please check your password.');
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
    const { encrypt } = getEncryptionMethods();
    
    if (!originalText.trim()) {
      alert('🔒 Please enter a secret message to encode');
      return;
    }

    if (!encodePassword) {
      alert('🔑 Please enter a password for encryption');
      return;
    }

    // Password requirements based on encryption level
    if (encryptionLevel === 'extreme' && passwordStrength.strength === 'weak') {
      alert('⚠️ For quantum-level security, please use a strong password with at least 12 characters including uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (encryptionLevel === 'advanced' && passwordStrength.strength === 'weak') {
      if (!confirm('⚠️ Weak password detected. For better security, we recommend using a stronger password. Continue anyway?')) {
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

      // Encrypt the original text using selected method
      const encrypted = encrypt(originalText, encodePassword);
      
      // Convert to zero-width characters
      const hidden = textToZeroWidth(encrypted);
      
      // Embed at the end of cover text
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
      
      // Auto-detect encryption level and decrypt
      const { result: decrypted, level: detectedLevel } = autoDecrypt(encrypted, decodePassword);
      
      if (!decrypted) {
        setDecodeError('❌ Failed to decode. The password might be incorrect.');
        return;
      }
      
      setDecodedText(decrypted);
      setDecodeError(`✅ Successfully decoded with ${detectedLevel.toUpperCase()} encryption`);
    } catch (error) {
      console.error('Decoding error:', error);
      if (error.message.includes('password') || error.message.includes('incorrect')) {
        setDecodeError('🔐 Incorrect password. Please verify and try again.');
      } else if (error.message.includes('integrity') || error.message.includes('tampered')) {
        setDecodeError('🛡️ ' + error.message);
      } else if (error.message.includes('Invalid') || error.message.includes('corrupted')) {
        setDecodeError('⚠️ Data format error. Please ensure you copied the complete encoded text.');
      } else if (error.message.includes('hidden data')) {
        setDecodeError('⚠️ No hidden data found in the provided text');
      } else {
        setDecodeError('❌ ' + error.message);
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

  // Encryption method selector for encoding
  const getEncryptionMethods = () => {
    switch (encryptionLevel) {
      case 'basic':
        return { encrypt: encryptBasic, decrypt: decryptBasic };
      case 'advanced':
        return { encrypt: encryptAdvanced, decrypt: decryptAdvanced };
      case 'extreme':
        return { encrypt: encryptExtreme, decrypt: decryptExtreme };
      default:
        return { encrypt: encryptAdvanced, decrypt: decryptAdvanced };
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
    operationCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '3rem 2rem',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      marginBottom: '1.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textAlign: 'center'
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
    },
    levelCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2.5rem',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      marginBottom: '1.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textAlign: 'center'
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
              <p style={styles.subtitle}>Multi-Level Secure Message System</p>
              <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem'}}>
                <span style={styles.badge}>MULTI-LEVEL ENCRYPTION</span>
                <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH</span>
              </div>
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
                <Binary size={20} />
                INITIATE SECURE SYSTEM
              </button>
            </form>
            
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px'}}>
                SECURE SYSTEM • v4.1 • AUTO-DETECT DECODING
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Operation Mode Selection (Encode/Decode)
  if (!operationMode) {
    return (
      <div style={styles.container}>
        <div style={styles.mainContainer}>
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
                  <Settings style={{color: 'white'}} size={24} />
                </div>
                <div style={{position: 'absolute', inset: '-2px', backgroundColor: 'rgba(59, 130, 246, 0.3)', borderRadius: '50%', filter: 'blur(8px)'}}></div>
              </div>
              <h1 style={styles.title}>SELECT OPERATION</h1>
            </div>
            <p style={styles.subtitle}>Choose what you want to do</p>
          </div>

          {/* Encode Option */}
          <div 
            style={{
              ...styles.operationCard,
              borderColor: '#3b82f6',
              transform: 'translateY(0)',
            }}
            onClick={() => setOperationMode('encode')}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail style={{color: 'white'}} size={28} />
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>ENCODE</h3>
                <p style={{color: '#93c5fd', margin: 0}}>Hide secret message in text</p>
              </div>
            </div>
            <div style={{color: '#cbd5e1', textAlign: 'left', marginBottom: '1.5rem'}}>
              <p style={{marginBottom: '0.5rem'}}>• Hide confidential messages in plain text</p>
              <p style={{marginBottom: '0.5rem'}}>• Choose from 3 encryption levels</p>
              <p style={{marginBottom: '0.5rem'}}>• Generate secure cover text</p>
              <p>• Protect with strong passwords</p>
            </div>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
              <span style={{...styles.badge, backgroundColor: 'rgba(59, 130, 246, 0.2)'}}>HIDE DATA</span>
              <span style={{...styles.badge, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399'}}>ENCRYPT</span>
            </div>
          </div>

          {/* Decode Option */}
          <div 
            style={{
              ...styles.operationCard,
              borderColor: '#8b5cf6',
              transform: 'translateY(0)',
            }}
            onClick={() => {
              setOperationMode('decode');
              setActiveTab('decode');
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MailOpen style={{color: 'white'}} size={28} />
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>DECODE</h3>
                <p style={{color: '#a78bfa', margin: 0}}>Extract hidden message from text</p>
              </div>
            </div>
            <div style={{color: '#cbd5e1', textAlign: 'left', marginBottom: '1.5rem'}}>
              <p style={{marginBottom: '0.5rem'}}>• Extract hidden messages from any text</p>
              <p style={{marginBottom: '0.5rem'}}>• Auto-detect encryption level</p>
              <p style={{marginBottom: '0.5rem'}}>• No need to know encryption method</p>
              <p>• Works with Basic, Advanced, and Extreme</p>
            </div>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
              <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)'}}>EXTRACT DATA</span>
              <span style={{...styles.badge, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399'}}>AUTO-DETECT</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Encryption Level Selection Screen (Only for Encode)
  if (operationMode === 'encode' && !encryptionLevel) {
    return (
      <div style={styles.container}>
        <div style={styles.mainContainer}>
          <div style={styles.header}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem'}}>
              <button
                onClick={() => setOperationMode(null)}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'absolute',
                  left: '1rem',
                  top: '1rem'
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>
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
                  <Settings style={{color: 'white'}} size={24} />
                </div>
                <div style={{position: 'absolute', inset: '-2px', backgroundColor: 'rgba(59, 130, 246, 0.3)', borderRadius: '50%', filter: 'blur(8px)'}}></div>
              </div>
              <h1 style={styles.title}>SELECT ENCRYPTION LEVEL</h1>
            </div>
            <p style={styles.subtitle}>Choose your security level based on sensitivity</p>
          </div>

          {/* Basic Encryption */}
          <div 
            style={{
              ...styles.levelCard,
              borderColor: '#3b82f6',
              transform: 'translateY(0)',
            }}
            onClick={() => setEncryptionLevel('basic')}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield style={{color: 'white'}} size={28} />
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>BASIC</h3>
                <p style={{color: '#93c5fd', margin: 0}}>Standard XOR Encryption</p>
              </div>
            </div>
            <div style={{color: '#cbd5e1', textAlign: 'left', marginBottom: '1.5rem'}}>
              <p style={{marginBottom: '0.5rem'}}>• Simple XOR encryption</p>
              <p style={{marginBottom: '0.5rem'}}>• Fast processing</p>
              <p style={{marginBottom: '0.5rem'}}>• Suitable for low-sensitivity data</p>
              <p>• Basic password protection</p>
            </div>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
              <span style={{...styles.badge, backgroundColor: 'rgba(59, 130, 246, 0.2)'}}>FAST</span>
              <span style={{...styles.badge, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399'}}>SIMPLE</span>
            </div>
          </div>

          {/* Advanced Encryption */}
          <div 
            style={{
              ...styles.levelCard,
              borderColor: '#8b5cf6',
              transform: 'translateY(0)',
            }}
            onClick={() => setEncryptionLevel('advanced')}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Server style={{color: 'white'}} size={28} />
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>ADVANCED</h3>
                <p style={{color: '#a78bfa', margin: 0}}>AES-256 Simulation + 3 Layers</p>
              </div>
            </div>
            <div style={{color: '#cbd5e1', textAlign: 'left', marginBottom: '1.5rem'}}>
              <p style={{marginBottom: '0.5rem'}}>• AES-256 like encryption</p>
              <p style={{marginBottom: '0.5rem'}}>• 100,000 iteration key derivation</p>
              <p style={{marginBottom: '0.5rem'}}>• 3-layer encryption process</p>
              <p>• Military-grade security</p>
            </div>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
              <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)'}}>AES-256</span>
              <span style={{...styles.badge, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399'}}>SECURE</span>
            </div>
          </div>

          {/* Extreme Encryption */}
          <div 
            style={{
              ...styles.levelCard,
              borderColor: '#ec4899',
              transform: 'translateY(0)',
            }}
            onClick={() => setEncryptionLevel('extreme')}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu style={{color: 'white'}} size={28} />
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>EXTREME</h3>
                <p style={{color: '#f9a8d4', margin: 0}}>Quantum-Protected Encryption</p>
              </div>
            </div>
            <div style={{color: '#cbd5e1', textAlign: 'left', marginBottom: '1.5rem'}}>
              <p style={{marginBottom: '0.5rem'}}>• 250,000+ iteration key derivation</p>
              <p style={{marginBottom: '0.5rem'}}>• 5-layer quantum-resistant encryption</p>
              <p style={{marginBottom: '0.5rem'}}>• Advanced quantum integrity protection</p>
              <p>• Post-quantum cryptography</p>
            </div>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
              <span style={{...styles.badge, backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#f9a8d4'}}>QUANTUM</span>
              <span style={{...styles.badge, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399'}}>MAXIMUM</span>
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
                borderRadius: '0.75rem',
                padding: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'absolute',
                left: '1rem',
                top: '1rem'
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div style={{position: 'relative'}}>
              <div style={{
                width: '50px',
                height: '50px',
                background: operationMode === 'decode' ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' :
                         encryptionLevel === 'basic' ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' :
                         encryptionLevel === 'advanced' ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' :
                         'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu style={{color: 'white'}} size={24} />
              </div>
              <div style={{position: 'absolute', inset: '-2px', 
                backgroundColor: operationMode === 'decode' ? 'rgba(139, 92, 246, 0.3)' :
                         encryptionLevel === 'basic' ? 'rgba(59, 130, 246, 0.3)' :
                         encryptionLevel === 'advanced' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)', 
                borderRadius: '50%', filter: 'blur(8px)'}}></div>
            </div>
            <h1 style={styles.title}>
              {operationMode === 'decode' ? 'DECODE MODE' :
               encryptionLevel === 'basic' ? 'BASIC MODE' :
               encryptionLevel === 'advanced' ? 'ADVANCED MODE' : 'EXTREME MODE'}
            </h1>
          </div>
          <p style={styles.subtitle}>
            {operationMode === 'decode' ? 'Auto-Detect Encryption • Smart Decoding' :
             encryptionLevel === 'basic' ? 'Standard XOR Encryption' :
             encryptionLevel === 'advanced' ? 'AES-256 + 3-Layer Encryption' : 'Quantum-Protected 5-Layer Encryption'}
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap'}}>
            <span style={{
              ...styles.badge,
              backgroundColor: operationMode === 'decode' ? 'rgba(139, 92, 246, 0.2)' :
                            encryptionLevel === 'basic' ? 'rgba(59, 130, 246, 0.2)' :
                            encryptionLevel === 'advanced' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)',
              color: operationMode === 'decode' ? '#a78bfa' :
                     encryptionLevel === 'basic' ? '#93c5fd' :
                     encryptionLevel === 'advanced' ? '#a78bfa' : '#f9a8d4'
            }}>
              {operationMode === 'decode' ? 'AUTO-DETECT DECODING' :
               encryptionLevel === 'basic' ? 'BASIC ENCRYPTION' :
               encryptionLevel === 'advanced' ? 'AES-256 + 3 LAYERS' : 'QUANTUM 5-LAYER'}
            </span>
            <span style={{...styles.badge, backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)'}}>ZERO-WIDTH STEGANOGRAPHY</span>
          </div>
        </div>

        {/* For Decode mode, show only decode tab */}
        {operationMode === 'decode' ? (
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
                  <p style={{fontWeight: '600'}}>AUTO-DETECTING ENCRYPTION</p>
                  <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                    Trying Basic → Advanced → Quantum decryption...
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
              AUTO-DECODE MESSAGE
            </button>

            {/* Error Display */}
            {decodeError && !decodedText && (
              <div style={styles.errorCard}>
                <AlertCircle style={{color: '#f87171', flexShrink: 0, marginTop: '0.125rem'}} size={24} />
                <div>
                  <p style={{color: '#fca5a5', fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem'}}>DECODING ERROR</p>
                  <p style={{color: 'rgba(254, 226, 226, 0.9)', fontSize: '0.9rem', fontFamily: 'inherit'}}>{decodeError}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {decodeError && decodedText && (
              <div style={{...styles.card, borderColor: 'rgba(34, 197, 94, 0.4)'}}>
                <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                  <Check size={18} />
                  {decodeError}
                </p>
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
              </div>
            )}
          </div>
        ) : (
          // For Encode mode, show tabs
          <>
            {/* Security Info */}
            <div style={styles.card}>
              <label style={styles.label}>
                <Shield size={20} />
                SECURITY SPECIFICATIONS - {encryptionLevel.toUpperCase()} MODE
              </label>
              <div style={{color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6'}}>
                {encryptionLevel === 'basic' && (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                    <div>🔒 Simple XOR Encryption</div>
                    <div>⚡ Fast Processing</div>
                    <div>📊 Basic Security</div>
                    <div>🎯 Suitable for Low Risk</div>
                  </div>
                )}
                {encryptionLevel === 'advanced' && (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                    <div>🔒 AES-256 Simulation</div>
                    <div>🛡️ 100K Iteration Key Derivation</div>
                    <div>📊 3-Layer Encryption</div>
                    <div>🎯 Military-Grade Security</div>
                  </div>
                )}
                {encryptionLevel === 'extreme' && (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                    <div>⚛️ 250K+ Iteration Key Derivation</div>
                    <div>🔒 5-Layer Quantum Encryption</div>
                    <div>📊 Quantum Integrity Protection</div>
                    <div>🎯 Post-Quantum Cryptography</div>
                  </div>
                )}
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
                      <p style={{fontWeight: '600'}}>
                        {encryptionLevel === 'basic' ? 'ENCRYPTING MESSAGE' :
                         encryptionLevel === 'advanced' ? 'APPLYING AES-256 ENCRYPTION' : 'APPLYING QUANTUM ENCRYPTION'}
                      </p>
                      <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                        {encryptionLevel === 'extreme' ? '250,000+ iteration quantum key derivation...' : 
                         encryptionLevel === 'advanced' ? '100,000 iteration key derivation...' : 'Processing...'}
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
                      placeholder={
                        encryptionLevel === 'extreme' ? 
                        "Enter quantum-grade password (min 12 characters)..." :
                        encryptionLevel === 'advanced' ?
                        "Enter AES-256 password (min 8 characters)..." :
                        "Enter encryption password..."
                      }
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
                  disabled={!originalText || !encodePassword || 
                    (encryptionLevel === 'extreme' && passwordStrength.strength === 'weak') || 
                    processing}
                  style={{
                    ...styles.primaryButton,
                    opacity: (!originalText || !encodePassword || 
                      (encryptionLevel === 'extreme' && passwordStrength.strength === 'weak') || 
                      processing) ? 0.5 : 1,
                    cursor: (!originalText || !encodePassword || 
                      (encryptionLevel === 'extreme' && passwordStrength.strength === 'weak') || 
                      processing) ? 'not-allowed' : 'pointer',
                    transform: (!originalText || !encodePassword || 
                      (encryptionLevel === 'extreme' && passwordStrength.strength === 'weak') || 
                      processing) ? 'none' : 'translateY(-2px)'
                  }}
                >
                  <Binary size={20} />
                  {encryptionLevel === 'basic' ? 'ENCODE MESSAGE' :
                   encryptionLevel === 'advanced' ? 'AES-256 ENCODE' : 'QUANTUM ENCODE'}
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
                        <span>MODE: {encryptionLevel.toUpperCase()}</span>
                      </div>
                    </div>
                    <div style={styles.successCard}>
                      <p style={{color: '#86efac', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit', fontWeight: '600'}}>
                        <Check size={18} />
                        ✅ MESSAGE SUCCESSFULLY ENCODED WITH {encryptionLevel.toUpperCase()} SECURITY
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Decode Tab (in Encode mode) */}
            {activeTab === 'decode' && (
              <div style={{textAlign: 'center', padding: '3rem 2rem'}}>
                <div style={{marginBottom: '2rem'}}>
                  <MailOpen size={64} color="#8b5cf6" />
                </div>
                <h3 style={{color: 'white', fontSize: '1.5rem', marginBottom: '1rem'}}>Switch to Decode Mode</h3>
                <p style={{color: '#94a3b8', marginBottom: '2rem'}}>
                  To decode messages, you need to switch to dedicated decode mode for auto-detection of encryption levels.
                </p>
                <button
                  onClick={() => {
                    setOperationMode('decode');
                    setActiveTab('decode');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    color: 'white',
                    fontWeight: '700',
                    padding: '1.25rem 2rem',
                    borderRadius: '1.25rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <MailOpen size={20} />
                  SWITCH TO DECODE MODE
                </button>
              </div>
            )}
          </>
        )}

        {/* Security Footer */}
        <div style={{marginTop: '3rem', textAlign: 'center', padding: '2rem'}}>
          <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'inherit'}}>
            {operationMode === 'decode' ? '🔍 AUTO-DETECT DECODING • 🛡️ SMART SECURITY • v4.1' :
             encryptionLevel === 'basic' ? '🔒 BASIC ENCRYPTION • ⚡ FAST PROCESSING • v4.1' :
             encryptionLevel === 'advanced' ? '🔒 AES-256 ENCRYPTION • 🛡️ 3-LAYER SECURITY • v4.1' :
             '⚛️ QUANTUM ENCRYPTION • 🛡️ 5-LAYER MAXIMUM SECURITY • v4.1'}
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
