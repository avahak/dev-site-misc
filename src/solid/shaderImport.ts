/**
 * Use with Vite's `import.meta.glob` to extract shader chunks indexed by name
 * (instead of whole path string).
 */
function importShaders(shaderModules: Record<string, unknown>) {
    const shaderChunks: Record<string, string> = {};

    for (const [filePath, source] of Object.entries(shaderModules)) {
        const baseName = filePath.split('/').pop()!;
        const chunkName = baseName.replace(/\.glsl$/, '');
        shaderChunks[chunkName] = source as string;
    }

    return shaderChunks;
}

/**
 * Resolves include statements from shader code chunks.
 */
function resolveShaderChunk(
    name: string,
    shaderChunks: Record<string, string>,
    visited = new Set()
): string {
    if (!shaderChunks[name])
        throw new Error(`Unknown shader chunk: ${name}`);

    return shaderChunks[name].replace(/#include\s+<\s*(\S+?)\s*>/g, (_match: string, key: string) => {
        if (visited.has(key))
            throw new Error(`Circular shader include: ${key}`);
        if (!shaderChunks[key])
            throw new Error(`Unknown shader chunk: ${key}`);
        visited.add(key);
        const resolved = resolveShaderChunk(key, shaderChunks, visited);
        visited.delete(key);
        return resolved;
    })
}

export { importShaders, resolveShaderChunk };