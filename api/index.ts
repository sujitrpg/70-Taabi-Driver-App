import { createServer } from 'http';
import handler from '../dist/index.js';

const server = createServer(handler);

export default handler;
