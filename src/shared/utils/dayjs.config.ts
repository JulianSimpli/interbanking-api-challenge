import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

// Configure dayjs for UTC globally
dayjs.extend(utc);

// Export the configured dayjs instance
export { dayjs };

// Re-export dayjs as default for convenience
export default dayjs;
