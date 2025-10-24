import { validateEmail, validatePassword } from '../auth';

describe('Auth Service Validation', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should reject passwords shorter than 6 characters', () => {
      const result = validatePassword('12345');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Passordet må være minst 6 tegn');
    });

    it('should accept passwords 6-7 characters with warning', () => {
      const result = validatePassword('123456');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Passordet er svakt. Bruk minst 8 tegn');
    });

    it('should accept passwords 8+ characters without numbers with suggestion', () => {
      const result = validatePassword('password');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Passord med tall er sikrere');
    });

    it('should accept strong passwords', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should accept very strong passwords', () => {
      const result = validatePassword('MySecurePassword123');
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });
  });
});

