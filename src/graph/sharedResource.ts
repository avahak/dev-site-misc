type DisposableResource = { dispose: () => void };

/**
 * Manages shared resources with automatic reference counting and disposal.
 * 
 * Provides a centralized way to share expensive resources (like WebGL renderers or textures)
 * across multiple consumers. Tracks usage with reference counting and automatically
 * disposes resources when the last consumer releases them. Uses string keys to identify
 * different resource types.
 * 
 * @example
 * // Acquire shared renderer
 * const renderer = SharedResource.acquire('webgl-renderer', 
 *   () => new THREE.WebGLRenderer());
 * 
 * // Release when done  
 * SharedResource.release('webgl-renderer');
 */
class SharedResource<T extends DisposableResource> {
    private static instances = new Map<string, { 
        resource: DisposableResource, 
        refCount: number 
    }>();

    static acquire<T extends DisposableResource>(
        key: string,
        create: () => T
    ): T {
        let entry = this.instances.get(key);
        if (!entry) {
            const resource = create();
            entry = { resource, refCount: 0 };
            this.instances.set(key, entry);
        }
        entry.refCount++;
        return entry.resource as T;
    }

    static release(key: string): void {
        const entry = this.instances.get(key);
        if (!entry) 
            return;

        entry.refCount--;
        if (entry.refCount <= 0) {
            entry.resource.dispose();
            this.instances.delete(key);
        }
    }
}

export { SharedResource };