import { useCallback, useMemo, useState } from "react";

export const useFileInput = () => {
  const [file, setFile] = useState<File>();

  const filePreview = useMemo(() => {
    if (!file) return;

    return URL.createObjectURL(file);
  }, [file]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFile(file);
  }, []);

  const clearFile = useCallback(() => {
    setFile(undefined);
  }, []);

  return {
    file,
    filePreview,
    onFileChange,
    clearFile,
  };
};
