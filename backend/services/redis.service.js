import Redis from 'ioredis';

class RedisMock {
    constructor() {
        this.store = new Map();
        console.warn("WARNING: Using in-memory Redis fallback because a local Redis server is not available.");
    }
    async get(key) {
        return this.store.get(key) || null;
    }
    async set(key, value, mode, duration) {
        this.store.set(key, value);
        if (mode === 'EX' && typeof duration === 'number') {
            setTimeout(() => {
                this.store.delete(key);
            }, duration * 1000);
        }
        return 'OK';
    }
    on(event, callback) {
        if (event === 'connect') {
            setTimeout(callback, 0);
        }
    }
}

let activeClient;
let useMock = false;

if (process.env.REDIS_HOST) {
    try {
        activeClient = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: 1,
            showFriendlyErrorStack: true,
            retryStrategy: (times) => {
                useMock = true;
                activeClient = new RedisMock();
                return null;
            }
        });
        activeClient.on('connect', () => {
            if (!useMock) console.log('Redis connected successfully.');
        });
        activeClient.on('error', (err) => {
            if (!useMock) {
                console.warn("Redis Connection Error, falling back to mock:", err.message);
                useMock = true;
                activeClient = new RedisMock();
            }
        });
    } catch (e) {
        console.warn("Redis initialization failed, falling back to mock:", e.message);
        useMock = true;
        activeClient = new RedisMock();
    }
} else {
    useMock = true;
    activeClient = new RedisMock();
}

const redisClient = new Proxy({}, {
    get(target, prop) {
        const val = activeClient[prop];
        if (typeof val === 'function') {
            return val.bind(activeClient);
        }
        return val;
    }
});

export default redisClient;