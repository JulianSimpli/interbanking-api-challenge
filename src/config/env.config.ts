// We can use Zod or Joi or any other library to validate the environment variables
// Add required environment variables
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variable ${key} is required`);
  return value;
}

// Environment configuration object
export const env = {
  PORT: parseInt(requireEnv('PORT'), 10),
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim()),
  // NODE_ENV: requireEnv('NODE_ENV'),
} as const; 