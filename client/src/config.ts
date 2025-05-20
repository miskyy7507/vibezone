// default values are for express.js api server running in dev environment
const devApiPort: number = import.meta.env.VITE_DEV_API_PORT as string && parseInt(import.meta.env.VITE_DEV_API_PORT as string) || 5000
export const apiUrl: string = import.meta.env.VITE_API_URL as string || `http://localhost:${devApiPort.toString()}`;
export const uploadsUrl: string = import.meta.env.VITE_UPLOADS_URL as string || `http://localhost:${devApiPort.toString()}/uploads`;
