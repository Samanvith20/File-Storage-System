'use client';

import { useState } from 'react';
import { UploadCloud, FileText, Trash2, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import useAccessToken from '../hooks/useaccesstoken';

export default function FileUpload() {
  const [file, setFile] = useState([]);
  console.log(file);
  // const [preview, setPreview] = useState([]);
  // console.log(preview);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length > 0) {
      setFile(selected);
      // setPreview(selected.map(file => URL.createObjectURL(file)));
    }
  };
  const { accessToken } = useAccessToken();

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');

    const toastId = toast.loading('Uploading...');
    setIsUploading(true);

    const formData = new FormData();
    file.forEach((f) => formData.append('file', f));

    try {
      const res = await fetch('api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Upload failed');

      toast.success('Upload successful!', { id: toastId });
      // setUploadedFiles((prev) => [data.file, ...prev]);
      setFile(null);
     
    } catch (err) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Welcome back! 👋</h1>
      <p className="text-slate-400 mb-6">Upload your files securely to the cloud.</p>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col items-center text-white">
        <UploadCloud className="w-10 h-10 mb-4" />
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />

        {/* {file && 
      
         (
          <div className="w-full bg-slate-900 border border-slate-700 p-4 rounded-lg text-sm text-slate-300 mb-4">
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> {file.type}</p>
            {preview && file.type.startsWith('image') && (
              <img src={preview} alt="preview" className="mt-2 rounded max-h-48 object-contain" />
            )}
          </div>
        )} */}

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {/* Uploaded files list */}
      {/* {uploadedFiles.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Your Uploaded Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 p-4 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{file.originalname || file.name}</span>
                  </div>
                  <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-300" />
                </div>
                <p className="text-slate-400 text-xs">Size: {(file.size / 1024).toFixed(2)} KB</p>
                <p className="text-slate-400 text-xs">Type: {file.contentType || file.type}</p>
                <p className="text-slate-400 text-xs">Uploaded: {file.uploadedAt || 'just now'}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
