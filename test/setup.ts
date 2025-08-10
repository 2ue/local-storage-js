// Jest setup file
import 'jest-environment-jsdom';

// Mock localStorage if not available
Object.defineProperty(window, 'localStorage', {
    value: (() => {
        let store: Record<string, string> = {};
        return {
            getItem: (key: string) => (store.hasOwnProperty(key) ? store[key] : null),
            setItem: (key: string, value: string) => {
                store[key] = value;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            },
            get length() {
                return Object.keys(store).length;
            },
            key: (index: number) => {
                const keys = Object.keys(store);
                return keys[index] || null;
            },
        };
    })(),
    writable: true,
    configurable: true, // 允许删除和重新定义
});
