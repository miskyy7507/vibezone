// default values are for express.js api server running in dev environment
export const apiUrl: string = import.meta.env.VITE_API_URL as string || "http://localhost:5000";
export const uploadsUrl: string = import.meta.env.VITE_UPLOADS_URL as string || "http://localhost:5000/uploads";
