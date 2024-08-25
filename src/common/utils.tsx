export function cache(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const cacheMap = new Map<string, any>();

    descriptor.value = function (...args: any[]) {
        const key = JSON.stringify(args);
        if (!cacheMap.has(key)) {
            const result = originalMethod.apply(this, args);
            cacheMap.set(key, result);
        }
        return cacheMap.get(key);
    };

    return descriptor;
}
