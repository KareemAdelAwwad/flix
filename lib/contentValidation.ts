// import fs from 'fs';
// import path from 'path';

// export interface ValidationResult {
//   isValid: boolean;
//   reason?: string;
// }

// export class ContentValidator {
//   public static readonly URL_REGEX = /https?:\/\/[^\s]+/g;
//   public static readonly SPAM_KEYWORDS = [
//     'buy now',
//     'click here',
//     'free',
//     'discount',
//     'win',
//     'lottery',
//     'prize',
//     'offer',
//     'cheap',
//     'subscribe',
//     'forex',
//     'casino',
//     'bitcoin',
//     'crypto'
//   ];

//   public static readonly MIN_LENGTH = 10;
//   public static readonly MAX_LENGTH = 2000;
//   public static readonly MAX_URLS = 1;

//   private static readonly MIN_WORDS = 3;
//   private static readonly MAX_REPEATED_CHARS_RATIO = 0.3;

//   public static readonly PROFANITY_WORDS = ContentValidator.loadProfanityWords();

//   private static loadProfanityWords(): string[] {
//     const filePaths = [
//       path.join(__dirname, '../data/profanity/en.txt'),
//       path.join(__dirname, '../data/profanity/ar.txt')
//     ];

//     const words = new Set<string>();

//     for (const filePath of filePaths) {
//       const fileContent = fs.readFileSync(filePath, 'utf-8');
//       fileContent.split('\n').forEach(word => words.add(word.trim()));
//     }

//     return Array.from(words);
//   }

//   private static readonly SUSPICIOUS_PATTERNS = [
//     /\d{4,}/,           // Too many consecutive numbers
//     /(.)\1{4,}/,        // Same character repeated 5+ times
//     /[A-Z]{5,}/,        // All caps sequence
//     /[!?]{3,}/,         // Multiple punctuation
//     /\$\d+/,            // Price patterns
//     /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
//   ];

//   static validateContent(content: string): ValidationResult {
//     // Check length
//     if (content.length < this.MIN_LENGTH) {
//       return { isValid: false, reason: 'Review is too short' };
//     }
//     if (content.length > this.MAX_LENGTH) {
//       return { isValid: false, reason: 'Review is too long' };
//     }

//     // Check for excessive URLs
//     const urlMatches = content.match(this.URL_REGEX) || [];
//     if (urlMatches.length > this.MAX_URLS) {
//       return { isValid: false, reason: 'Too many links in review' };
//     }

//     // Check for spam keywords
//     const contentLower = content.toLowerCase();
//     const spamWords = this.SPAM_KEYWORDS.filter(word =>
//       contentLower.includes(word.toLowerCase())
//     );

//     if (spamWords.length > 0) {
//       return {
//         isValid: false,
//         reason: `Review contains suspicious words: ${spamWords.join(', ')}`
//       };
//     }

//     // Check for repeated characters
//     if (/(.)\1{4,}/.test(content)) {
//       return {
//         isValid: false,
//         reason: 'Review contains excessive repeated characters'
//       };
//     }

//     return { isValid: true };
//   }
// }
