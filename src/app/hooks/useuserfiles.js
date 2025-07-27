import { useState, useEffect } from 'react';

export default function useUserFiles(accessToken) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files/get-files', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(data.userFiles); 
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    const res = await fetch(`/api/files/delete-file/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    }
  };

  useEffect(() => {
    if (accessToken) fetchFiles();
  }, [accessToken]);

  return { files, loading, deleteFile, refetchFiles: fetchFiles };
}
