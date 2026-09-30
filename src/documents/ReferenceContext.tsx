import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TargetData {
    id: string;
    title: string;
    content: ReactNode;
}

interface ReferenceContextType {
    register: (item: TargetData) => void;
    getItem: (id: string) => TargetData | undefined;
}

const ReferenceContext = createContext<ReferenceContextType | null>(null);

export const ReferenceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [registry, setRegistry] = useState<Map<string, TargetData>>(new Map());

    const register = useCallback((item: TargetData) => {
        setRegistry((prev) => {
            const existing = prev.get(item.id);
            // If ID and title are identical, skip update to prevent re-render loops
            if (existing && existing.title === item.title) {
                return prev;
            }
            const next = new Map(prev);
            next.set(item.id, item);
            return next;
        });
    }, []);

    const getItem = useCallback((id: string) => registry.get(id), [registry]);

    return (
        <ReferenceContext.Provider value={{ register, getItem }}>
            {children}
        </ReferenceContext.Provider>
    );
};

export const useReferenceRegistry = () => {
    const ctx = useContext(ReferenceContext);
    if (!ctx)
        throw new Error('useReferenceRegistry must be used within ReferenceProvider');
    return ctx;
};