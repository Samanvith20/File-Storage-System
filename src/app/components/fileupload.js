'use client';

import { useState, useMemo } from 'react';
import { UploadCloud, FileText, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import useAccessToken from '../hooks/useaccesstoken';
import useUserFiles from '../hooks/useuserfiles';
import Image from 'next/image';

export default function FileUpload() {
  const [file, setFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const { accessToken } = useAccessToken();
  const { files, loading, deleteFile, refetchFiles } = useUserFiles(accessToken);

 
 
  const handleFileChange = (e) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length > 0) setFile(selected);
  };

  const handleDelete = async (fileId) => {
  const toastId = toast.loading('Deleting file...');
  try {
    await deleteFile(fileId); // From your custom hook
    toast.success('File deleted successfully', { id: toastId });
    refetchFiles(); // Refresh
  } catch (err) {
    toast.error(`Delete failed: ${err.message}`, { id: toastId });
  }
};


  const handleUpload = async () => {
    if (!file || file.length === 0) return toast.error('Please select a file');

    const toastId = toast.loading('Uploading...');
    setIsUploading(true);

    const formData = new FormData();
    file.forEach((f) => formData.append('file', f));

    try {
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      toast.success('Upload successful!', { id: toastId });
      setFile([]);
      refetchFiles();
    } catch (err) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set(['all']);
    files.forEach((file) => {
      const type = (file.contentType || '').split('/')[0];
      if (type) set.add(type);
    });
    return Array.from(set);
  }, [files]);

  const filteredFiles = useMemo(() => {
    if (activeCategory === 'all') return files;
    return files.filter((file) => (file.contentType || '').startsWith(activeCategory));
  }, [activeCategory, files]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
      <p className="text-slate-400 mb-6">Upload your files securely to the cloud.</p>

      {/* Upload Box */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 shadow-xl w-full max-w-2xl mx-auto mb-10">
  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
    <UploadCloud className="w-6 h-6 text-purple-400" />
    Upload Your Files
  </h2>

  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
    <input
      type="file"
      multiple
      onChange={handleFileChange}
      className="block w-full text-sm text-slate-300 bg-slate-900 rounded-md border border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-600"
    />
  </div>

  <button
    onClick={handleUpload}
    disabled={isUploading}
    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
  >
    {isUploading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Uploading...
      </>
    ) : (
      <>
        <UploadCloud className="w-4 h-4" />
        Upload
      </>
    )}
  </button>
</div>

  {
    // if no categories are there show a message
    files.length === 0 && (
      <p className="text-slate-400 text-center">No files uploaded yet. Start by uploading your first file!</p>
    )
  }
      {/* Filter Tabs */}
      { categories.length > 1 && (
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
            } hover:bg-purple-500 transition-all text-sm`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
      )}

      {/* Files Grid */}
      {loading ? (
        <p className="text-slate-400">Loading files...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div key={file._id} className="bg-slate-800 border border-slate-700 p-4 rounded-lg text-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {file.contentType?.startsWith('image') ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="truncate max-w-[200px]">{file.filename}</span>
                </div>
                <Trash2
                 onClick={() => handleDelete(file._id)}

                  className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-300"
                />
              </div>

             <div className="aspect-video mb-2 relative border border-slate-700 rounded bg-slate-900 flex items-center justify-center">
  {file.contentType?.startsWith('image') ? (
    <Image
      src={file.url}
      alt="Image Preview"
      fill
      className="rounded object-cover"
    />
  ) : file.contentType === 'application/pdf' ? (
    <iframe
      src={file.url}
      title="PDF Preview"
      className="w-full h-full rounded"
    />
  ) : (
    <div className="text-center px-4 text-sm text-slate-400">
      <FileText className="mx-auto mb-1" />
      <p>No inline preview</p>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline text-xs"
      >
        Open in new tab
      </a>
    </div>
  )}
</div>


              <div className="flex justify-between text-xs text-slate-400">
                <span>{(file.size / 1024).toFixed(2)} KB</span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Preview
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-1">Uploaded: {new Date(file.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
