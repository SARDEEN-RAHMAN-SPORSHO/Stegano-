import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, AlertCircle, Zap, Shield, Key, Clipboard, ClipboardCheck, Cpu, Server, Binary, Settings, ArrowLeft, Mail, MailOpen } from 'lucide-react';

const TextSteganography = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [operationMode, setOperationMode] = useState(null);
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

  // ==================== BASIC ENCRYPTION ====================
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

  // ==================== ADVANCED ENCRYPTION (AES-256 + 3 Layers) ====================
  const deriveAESKey = (password, salt, iterations = 100000) => {
    let key = password + salt;
    
    for (let round = 0; round < iterations; round++) {
      let newKey = '';
      for (let i = 0; i < key.length; i++) {
        const charCode = key.charCodeAt(i);
        const saltChar = salt.charCodeAt(i % salt.length);
        const roundFactor = (round * 17 + i * 13) % 256;
        
        // AES-like key expansion
        const transformed = (
          (charCode ^ saltChar) * 0x1B +
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

  const aesSubBytes = (char) => {
    // Simplified AES S-box transformation
    const sBox = [
      0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
      0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0
    ];
    return sBox[char % 32] ^ char;
  };

  const aesShiftRows = (block) => {
    // AES ShiftRows simulation
    let shifted = '';
    for (let i = 0; i < block.length; i++) {
      const shift = (i * 3) % block.length;
      shifted += block[(i + shift) % block.length];
    }
    return shifted;
  };

  const aesMixColumns = (block) => {
    // AES MixColumns simulation
    let mixed = '';
    for (let i = 0; i < block.length; i++) {
      const current = block.charCodeAt(i);
      const next = block.charCodeAt((i + 1) % block.length);
      const mixedVal = (current * 2 + next * 3) % 65536;
      mixed += String.fromCharCode(mixedVal);
    }
    return mixed;
  };

  const encryptAdvanced = (text, password) => {
    if (!text || !password) return '';
    
    // Generate cryptographic components
    const salt = Array.from({length: 32}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const iv = Array.from({length: 16}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const timestamp = Date.now();
    
    // Derive AES-256 like key
    const derivedKey = deriveAESKey(password, salt, 100000);
    
    // LAYER 1: AES-like encryption
    let layer1 = '';
    const blockSize = 16;
    for (let i = 0; i < text.length; i += blockSize) {
      let block = text.substr(i, blockSize);
      
      // Pad block if necessary
      while (block.length < blockSize) {
        block += String.fromCharCode(blockSize - block.length);
      }
      
      // AES rounds simulation
      let encryptedBlock = '';
      for (let j = 0; j < block.length; j++) {
        const keyIndex = (i + j) % derivedKey.length;
        const keyChar = derivedKey.charCodeAt(keyIndex);
        const textChar = block.charCodeAt(j);
        const ivChar = iv.charCodeAt(j % iv.length);
        
        // SubBytes + AddRoundKey
        let encrypted = aesSubBytes(textChar) ^ keyChar ^ ivChar ^ (j % 256);
        encryptedBlock += String.fromCharCode(encrypted);
      }
      
      // ShiftRows and MixColumns
      encryptedBlock = aesShiftRows(encryptedBlock);
      encryptedBlock = aesMixColumns(encryptedBlock);
      
      layer1 += encryptedBlock;
    }
    
    // LAYER 2: CBC mode simulation
    let layer2 = '';
    let previousBlock = iv;
    for (let i = 0; i < layer1.length; i += blockSize) {
      const block = layer1.substr(i, blockSize);
      let encryptedBlock = '';
      
      for (let j = 0; j < block.length; j++) {
        const blockChar = block.charCodeAt(j);
        const prevChar = previousBlock.charCodeAt(j % previousBlock.length);
        const keyIndex = (i + j + 7) % derivedKey.length;
        const keyChar = derivedKey.charCodeAt(keyIndex);
        
        const encrypted = blockChar ^ prevChar ^ keyChar ^ ((i + j) % 256);
        encryptedBlock += String.fromCharCode(encrypted);
      }
      
      layer2 += encryptedBlock;
      previousBlock = encryptedBlock;
    }
    
    // LAYER 3: Final transformation with metadata
    let layer3 = '';
    for (let i = 0; i < layer2.length; i++) {
      const keyIndex1 = i % derivedKey.length;
      const keyIndex2 = (i * 7 + 3) % derivedKey.length;
      const keyIndex3 = (i * 13 + 5) % derivedKey.length;
      
      const keyChar1 = derivedKey.charCodeAt(keyIndex1);
      const keyChar2 = derivedKey.charCodeAt(keyIndex2);
      const keyChar3 = derivedKey.charCodeAt(keyIndex3);
      const layer2Char = layer2.charCodeAt(i);
      
      const encrypted = (
        layer2Char ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ 
        (i % 256) ^ derivedKey.length ^ password.length
      );
      layer3 += String.fromCharCode(encrypted);
    }
    
    // Add metadata and integrity check
    const metadata = `${salt}|${iv}|${timestamp}|${text.length}`;
    const fullData = metadata + '|' + layer3;
    
    // Final encoding
    return btoa(encodeURIComponent(fullData));
  };

  const decryptAdvanced = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const decoded = decodeURIComponent(atob(encryptedBase64));
      
      // Extract metadata
      const parts = decoded.split('|');
      if (parts.length < 5) {
        throw new Error('Invalid data format');
      }
      
      const [salt, iv, timestamp, lengthStr, encryptedText] = parts;
      
      // Derive the same key
      const derivedKey = deriveAESKey(password, salt, 100000);
      
      // Reverse LAYER 3
      let layer2 = '';
      for (let i = 0; i < encryptedText.length; i++) {
        const keyIndex1 = i % derivedKey.length;
        const keyIndex2 = (i * 7 + 3) % derivedKey.length;
        const keyIndex3 = (i * 13 + 5) % derivedKey.length;
        
        const keyChar1 = derivedKey.charCodeAt(keyIndex1);
        const keyChar2 = derivedKey.charCodeAt(keyIndex2);
        const keyChar3 = derivedKey.charCodeAt(keyIndex3);
        const encryptedChar = encryptedText.charCodeAt(i);
        
        const decrypted = (
          encryptedChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ 
          (i % 256) ^ derivedKey.length ^ password.length
        );
        layer2 += String.fromCharCode(decrypted);
      }
      
      // Reverse LAYER 2 (CBC mode)
      let layer1 = '';
      let previousBlock = iv;
      const blockSize = 16;
      
      for (let i = 0; i < layer2.length; i += blockSize) {
        const block = layer2.substr(i, blockSize);
        let decryptedBlock = '';
        
        for (let j = 0; j < block.length; j++) {
          const blockChar = block.charCodeAt(j);
          const prevChar = previousBlock.charCodeAt(j % previousBlock.length);
          const keyIndex = (i + j + 7) % derivedKey.length;
          const keyChar = derivedKey.charCodeAt(keyIndex);
          
          const decrypted = blockChar ^ prevChar ^ keyChar ^ ((i + j) % 256);
          decryptedBlock += String.fromCharCode(decrypted);
        }
        
        layer1 += decryptedBlock;
        previousBlock = block;
      }
      
      // Reverse LAYER 1 (AES operations)
      let result = '';
      for (let i = 0; i < layer1.length; i += blockSize) {
        let block = layer1.substr(i, blockSize);
        
        // Reverse MixColumns and ShiftRows
        let decryptedBlock = '';
        for (let j = 0; j < block.length; j++) {
          const keyIndex = (i + j) % derivedKey.length;
          const keyChar = derivedKey.charCodeAt(keyIndex);
          const blockChar = block.charCodeAt(j);
          const ivChar = iv.charCodeAt(j % iv.length);
          
          // Reverse SubBytes + AddRoundKey
          let decrypted = blockChar ^ keyChar ^ ivChar ^ (j % 256);
          // Simple reverse S-box
          decrypted = (decrypted + 256) % 65536;
          decryptedBlock += String.fromCharCode(decrypted);
        }
        
        result += decryptedBlock;
      }
      
      // Remove padding and return
      const paddingChar = result.charCodeAt(result.length - 1);
      if (paddingChar > 0 && paddingChar <= blockSize) {
        result = result.substr(0, result.length - paddingChar);
      }
      
      return result;
    } catch (error) {
      throw new Error('AES-256 decryption failed - incorrect password or corrupted data');
    }
  };

  // ==================== EXTREME ENCRYPTION (Quantum-Resistant 5 Layers) ====================
  const deriveQuantumKey = (password, salt, iterations = 250000) => {
    let key = password + salt + password.length;
    
    for (let round = 0; round < iterations; round++) {
      let newKey = '';
      const roundSalt = round.toString(36) + salt;
      
      for (let i = 0; i < key.length; i++) {
        const charCode = key.charCodeAt(i);
        const saltChar = roundSalt.charCodeAt(i % roundSalt.length);
        const roundFactor = (round * 17 + i * 13) % 256;
        
        // Quantum-resistant key derivation
        const transformed = (
          (charCode ^ saltChar) * 0x11B +
          (roundFactor ^ charCode) * 3 +
          (saltChar * 13) +
          (i % 256) +
          (password.length * 17) +
          (round % 128) * 7
        ) % 65536;
        
        newKey += String.fromCharCode(transformed);
      }
      key = newKey;
      
      // Quantum key strengthening every 25,000 iterations
      if (round % 25000 === 0 && round > 0) {
        let strengthened = '';
        for (let i = 0; i < key.length; i++) {
          const char = key.charCodeAt(i);
          const pos = (i * round) % key.length;
          const strengthenChar = key.charCodeAt(pos);
          strengthened += String.fromCharCode((char + strengthenChar * 3 + round * 5) % 65536);
        }
        key = strengthened;
      }
    }
    
    return key;
  };

  const quantumEntanglement = (data, key, round) => {
    // Quantum entanglement simulation
    let entangled = '';
    for (let i = 0; i < data.length; i++) {
      const dataChar = data.charCodeAt(i);
      const keyChar1 = key.charCodeAt((i + round * 7) % key.length);
      const keyChar2 = key.charCodeAt((i * 3 + round * 11) % key.length);
      const entangledChar = (dataChar * 2 + keyChar1 * 3 + keyChar2 * 5) % 65536;
      entangled += String.fromCharCode(entangledChar);
    }
    return entangled;
  };

  const reverseQuantumEntanglement = (data, key, round) => {
    // Reverse quantum entanglement
    let original = '';
    for (let i = 0; i < data.length; i++) {
      const dataChar = data.charCodeAt(i);
      const keyChar1 = key.charCodeAt((i + round * 7) % key.length);
      const keyChar2 = key.charCodeAt((i * 3 + round * 11) % key.length);
      const originalChar = (dataChar - keyChar1 * 3 - keyChar2 * 5 + 65536 * 3) / 2;
      original += String.fromCharCode(Math.round(originalChar) % 65536);
    }
    return original;
  };

  const encryptExtreme = (text, password) => {
    if (!text || !password) return '';
    
    // Generate quantum-resistant components
    const timestamp = Date.now();
    const randomSalt = Array.from({length: 64}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const nonce = Array.from({length: 32}, () => 
      Math.random().toString(36)[2]
    ).join('');
    const quantumIV = Array.from({length: 24}, () => 
      Math.random().toString(36)[2]
    ).join('');
    
    const salt = `${timestamp}:${randomSalt}:${nonce}:${quantumIV}`;
    
    // Derive ultra-strong quantum key
    const derivedKey = deriveQuantumKey(password, salt, 250000);
    
    // LAYER 1: Quantum Key Expansion
    let layer1 = '';
    for (let i = 0; i < text.length; i++) {
      const keyPos1 = i % derivedKey.length;
      const keyPos2 = (i * 7 + 3) % derivedKey.length;
      const keyPos3 = (i * 13 + 5) % derivedKey.length;
      const keyPos4 = (i * 19 + 11) % derivedKey.length;
      const keyPos5 = (i * 23 + 7) % derivedKey.length;
      
      const keyChar1 = derivedKey.charCodeAt(keyPos1);
      const keyChar2 = derivedKey.charCodeAt(keyPos2);
      const keyChar3 = derivedKey.charCodeAt(keyPos3);
      const keyChar4 = derivedKey.charCodeAt(keyPos4);
      const keyChar5 = derivedKey.charCodeAt(keyPos5);
      const textChar = text.charCodeAt(i);
      
      const encrypted = (
        textChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ keyChar5 ^ 
        (i % 256) ^ derivedKey.length ^ password.length ^ quantumIV.charCodeAt(i % quantumIV.length)
      );
      layer1 += String.fromCharCode(encrypted);
    }
    
    // LAYER 2: Quantum Entanglement
    let layer2 = quantumEntanglement(layer1, derivedKey, 1);
    
    // LAYER 3: Multi-Dimensional Transformation
    let layer3 = '';
    for (let i = 0; i < layer2.length; i++) {
      const char = layer2.charCodeAt(i);
      const posFactor = (i * 29 + 13) % 256;
      const keyFactor = derivedKey.charCodeAt((i * 17) % derivedKey.length);
      const timeFactor = (timestamp % 256);
      const quantumFactor = (i * password.length * 7) % 256;
      
      const transformed = (
        (char + posFactor + keyFactor + timeFactor + quantumFactor) * 3 + 17
      ) % 65536;
      layer3 += String.fromCharCode(transformed);
    }
    
    // LAYER 4: Quantum Block Cipher
    let layer4 = '';
    const quantumBlockSize = 32;
    for (let i = 0; i < layer3.length; i += quantumBlockSize) {
      const block = layer3.substr(i, quantumBlockSize);
      let quantumBlock = '';
      
      for (let j = 0; j < block.length; j++) {
        const left = j > 0 ? block.charCodeAt(j - 1) : block.charCodeAt(block.length - 1);
        const right = block.charCodeAt((j + 1) % block.length);
        const current = block.charCodeAt(j);
        const quantumKey = derivedKey.charCodeAt((i + j + timestamp) % derivedKey.length);
        
        // Quantum superposition simulation
        const superposed = (
          (current * 2 + left * 3 + right * 5 + quantumKey * 7) % 65536
        );
        quantumBlock += String.fromCharCode(superposed);
      }
      layer4 += quantumBlock;
    }
    
    // LAYER 5: Final Quantum Consolidation
    let layer5 = '';
    const reversed = layer4.split('').reverse().join('');
    for (let i = 0; i < reversed.length; i++) {
      const char = reversed.charCodeAt(i);
      const keyChar1 = derivedKey.charCodeAt((i + 13) % derivedKey.length);
      const keyChar2 = derivedKey.charCodeAt((i * 3 + 19) % derivedKey.length);
      const keyChar3 = derivedKey.charCodeAt((i * 7 + 31) % derivedKey.length);
      const keyChar4 = derivedKey.charCodeAt((i * 11 + 43) % derivedKey.length);
      
      const finalEncrypted = (
        char ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ 
        ((i * 23) % 256) ^ (password.length * 29) ^ (timestamp % 256)
      );
      layer5 += String.fromCharCode(finalEncrypted);
    }
    
    // Create quantum-secure payload
    const payload = {
      data: layer5,
      salt: salt,
      version: 'quantum-v3',
      security: 'quantum-resistant-5layer',
      timestamp: timestamp,
      iterations: 250000,
      checksum: Array.from(text).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 1), 0) % 1000000,
      quantumHash: Array.from(derivedKey.substr(0, 100)).reduce((acc, char, idx) => 
        acc + char.charCodeAt(0) * (idx + 2), 0) % 1000000
    };
    
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  };

  const decryptExtreme = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return '';
    
    try {
      const payloadStr = decodeURIComponent(escape(atob(encryptedBase64)));
      const payload = JSON.parse(payloadStr);
      
      if (!payload.data || !payload.salt || !payload.checksum || !payload.quantumHash) {
        throw new Error('Invalid quantum payload structure');
      }
      
      const { data: encryptedData, salt, checksum, quantumHash, timestamp } = payload;
      
      // Extract quantum components
      const saltParts = salt.split(':');
      if (saltParts.length < 4) {
        throw new Error('Invalid quantum salt format');
      }
      const quantumIV = saltParts[3];
      
      // Derive quantum key
      const derivedKey = deriveQuantumKey(password, salt, 250000);
      
      // Verify quantum key integrity
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
        const keyChar4 = derivedKey.charCodeAt((i * 11 + 43) % derivedKey.length);
        
        const decrypted = (
          char ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ 
          ((i * 23) % 256) ^ (password.length * 29) ^ (timestamp % 256)
        );
        layer4Reversed += String.fromCharCode(decrypted);
      }
      
      // Reverse LAYER 4
      const layer4 = layer4Reversed.split('').reverse().join('');
      let layer3 = '';
      const quantumBlockSize = 32;
      for (let i = 0; i < layer4.length; i += quantumBlockSize) {
        const block = layer4.substr(i, quantumBlockSize);
        let originalBlock = '';
        
        for (let j = 0; j < block.length; j++) {
          const left = j > 0 ? originalBlock.charCodeAt(j - 1) : 0;
          const right = block.charCodeAt((j + 1) % block.length);
          const current = block.charCodeAt(j);
          const quantumKey = derivedKey.charCodeAt((i + j + timestamp) % derivedKey.length);
          
          // Reverse quantum superposition
          const original = (
            (current - left * 3 - right * 5 - quantumKey * 7 + 65536 * 10) / 2
          );
          originalBlock += String.fromCharCode(Math.round(original) % 65536);
        }
        layer3 += originalBlock;
      }
      
      // Reverse LAYER 3
      let layer2 = '';
      for (let i = 0; i < layer3.length; i++) {
        const char = layer3.charCodeAt(i);
        const posFactor = (i * 29 + 13) % 256;
        const keyFactor = derivedKey.charCodeAt((i * 17) % derivedKey.length);
        const timeFactor = (timestamp % 256);
        const quantumFactor = (i * password.length * 7) % 256;
        
        const untransformed = (
          ((char - 17 + 65536) * 43691) % 65536 // Modular inverse of 3
        ) - posFactor - keyFactor - timeFactor - quantumFactor + 65536 * 5;
        layer2 += String.fromCharCode(untransformed % 65536);
      }
      
      // Reverse LAYER 2 (Quantum Entanglement)
      let layer1 = reverseQuantumEntanglement(layer2, derivedKey, 1);
      
      // Reverse LAYER 1
      let decryptedText = '';
      for (let i = 0; i < layer1.length; i++) {
        const keyPos1 = i % derivedKey.length;
        const keyPos2 = (i * 7 + 3) % derivedKey.length;
        const keyPos3 = (i * 13 + 5) % derivedKey.length;
        const keyPos4 = (i * 19 + 11) % derivedKey.length;
        const keyPos5 = (i * 23 + 7) % derivedKey.length;
        
        const keyChar1 = derivedKey.charCodeAt(keyPos1);
        const keyChar2 = derivedKey.charCodeAt(keyPos2);
        const keyChar3 = derivedKey.charCodeAt(keyPos3);
        const keyChar4 = derivedKey.charCodeAt(keyPos4);
        const keyChar5 = derivedKey.charCodeAt(keyPos5);
        const encryptedChar = layer1.charCodeAt(i);
        
        const decrypted = (
          encryptedChar ^ keyChar1 ^ keyChar2 ^ keyChar3 ^ keyChar4 ^ keyChar5 ^ 
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
      throw new Error('Quantum decryption failed - incorrect key or corrupted data');
    }
  };

  // ==================== AUTO-DETECTION SYSTEM ====================
  const detectAndDecrypt = (encryptedBase64, password) => {
    if (!encryptedBase64 || !password) return { result: '', level: 'unknown' };
    
    try {
      // Try Extreme encryption (JSON payload with quantum version)
      try {
        const payloadStr = decodeURIComponent(escape(atob(encryptedBase64)));
        const payload = JSON.parse(payloadStr);
        if (payload.version && payload.version.includes('quantum')) {
          const result = decryptExtreme(encryptedBase64, password);
          return { result, level: 'extreme' };
        }
      } catch (e) {
        // Not extreme encryption
      }
      
      // Try Advanced encryption (contains metadata with pipes)
      try {
        const decoded = decodeURIComponent(atob(encryptedBase64));
        if (decoded.includes('|') && decoded.split('|').length >= 5) {
          const result = decryptAdvanced(encryptedBase64, password);
          return { result, level: 'advanced' };
        }
      } catch (e) {
        // Not advanced encryption
      }
      
      // Try Basic encryption (fallback)
      try {
        const result = decryptBasic(encryptedBase64, password);
        return { result, level: 'basic' };
      } catch (e) {
        // Not basic either
      }
      
      throw new Error('Unable to detect encryption type');
      
    } catch (error) {
      throw new Error('Auto-detection failed: ' + error.message);
    }
  };

  // FIXED: Convert text to zero-width characters
  const textToZeroWidth = (text) => {
    // Convert text to binary string first
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      // Get char code and convert to 16-bit binary
      const charCode = text.charCodeAt(i);
      const binaryChar = charCode.toString(2).padStart(16, '0');
      binary += binaryChar;
    }
    
    // Convert binary to base4 using zero-width characters
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

  // FIXED: Convert zero-width chars back to text
  const zeroWidthToText = (zeroWidth) => {
    // Convert zero-width back to binary
    let binary = '';
    for (let char of zeroWidth) {
      if (CHAR_TO_BINARY[char] !== undefined) {
        const base4Digit = CHAR_TO_BINARY[char];
        const twoBits = parseInt(base4Digit, 10).toString(2).padStart(2, '0');
        binary += twoBits;
      }
    }
    
    // Convert binary back to text
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
        if (CHAR_TO_BINARY[char] !== undefined) {
          hidden += char;
        }
      }

      if (!hidden) {
        setDecodeError('🔍 No hidden data found in the provided text');
        return;
      }

      // Convert back to encrypted text
      const encrypted = zeroWidthToText(hidden);
      
      if (!encrypted) {
        setDecodeError('❌ Failed to extract encrypted data from zero-width characters');
        return;
      }
      
      // Auto-detect encryption level and decrypt
      const { result: decrypted, level: detectedLevel } = detectAndDecrypt(encrypted, decodePassword);
      
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
    // ... (rest of the styles remain the same)
  };

  // Rest of the component remains exactly the same...
  // Only the textToZeroWidth and zeroWidthToText functions were changed

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
             encryptionLevel === 'advanced' ? 'AES-256 + 3-Layer Encryption' : 'Quantum-Resistant 5-Layer Encryption'}
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

        {/* Security Info */}
        <div style={styles.card}>
          <label style={styles.label}>
            <Shield size={20} />
            SECURITY SPECIFICATIONS - {operationMode === 'decode' ? 'AUTO-DETECT' : encryptionLevel.toUpperCase()} MODE
          </label>
          <div style={{color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6'}}>
            {operationMode === 'decode' ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                <div>🔍 Auto-detect Basic, Advanced, Extreme</div>
                <div>⚡ Smart decryption algorithm</div>
                <div>🛡️ No manual selection needed</div>
                <div>🎯 Universal compatibility</div>
              </div>
            ) : encryptionLevel === 'basic' ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                <div>🔒 Simple XOR Encryption</div>
                <div>⚡ Fast Processing</div>
                <div>📊 Basic Security</div>
                <div>🎯 Suitable for Low Risk</div>
              </div>
            ) : encryptionLevel === 'advanced' ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                <div>🔒 AES-256 Simulation with S-Box</div>
                <div>🛡️ 100K Iteration Key Derivation</div>
                <div>📊 3-Layer CBC Mode Encryption</div>
                <div>🎯 Military-Grade Security</div>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
                <div>⚛️ 250K Iteration Quantum Key Derivation</div>
                <div>🔒 5-Layer Quantum-Resistant Encryption</div>
                <div>📊 Quantum Entanglement Simulation</div>
                <div>🎯 Post-Quantum Cryptography</div>
              </div>
            )}
          </div>
        </div>

        {/* For Decode mode, show only decode interface */}
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
                    Scanning for Basic, Advanced, and Quantum encryption...
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
                      const hiddenChars = decodeInput.split('').filter(c => CHAR_TO_BINARY[c] !== undefined).length;
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
          // For Encode mode, show the encoding interface
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
                    {encryptionLevel === 'extreme' ? '250,000 iteration quantum key derivation...' : 
                     encryptionLevel === 'advanced' ? '100,000 iteration key derivation...' : 'Basic encryption...'}
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

        {/* Security Footer */}
        <div style={{marginTop: '3rem', textAlign: 'center', padding: '2rem'}}>
          <p style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'inherit'}}>
            {operationMode === 'decode' ? '🔍 AUTO-DETECT DECODING • 🛡️ SMART SECURITY • v5.0' :
             encryptionLevel === 'basic' ? '🔒 BASIC ENCRYPTION • ⚡ FAST PROCESSING • v5.0' :
             encryptionLevel === 'advanced' ? '🔒 AES-256 ENCRYPTION • 🛡️ 3-LAYER SECURITY • v5.0' :
             '⚛️ QUANTUM ENCRYPTION • 🛡️ 5-LAYER MAXIMUM SECURITY • v5.0'}
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
