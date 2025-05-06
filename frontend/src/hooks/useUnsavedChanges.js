import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUnsavedChanges = (formState) => {
    const [isDirty, setIsDirty] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsDirty(true);
    }, [formState]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handleNavigate = (e) => {
            if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                e.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handleNavigate);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleNavigate);
        };
    }, [isDirty]);

    const resetDirty = () => setIsDirty(false);

    const handleNavigateAway = (path) => {
        if (!isDirty || window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            navigate(path);
        }
    };

    return { isDirty, resetDirty, handleNavigateAway };
};