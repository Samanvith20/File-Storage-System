'use client';
import Link from 'next/link';
import { CloudUpload, ShieldCheck, ImageIcon, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Store Your Files in the Cloud
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          Upload and access your images, documents, and more — anytime, anywhere.
        </p>
        <Link href="/upload">
          <button className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform">
            Upload Your Files
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition">
          <ShieldCheck className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Uploads</h3>
          <p className="text-slate-400 text-sm">All files are safely uploaded through our secure backend to AWS S3.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition">
          <ImageIcon className="w-10 h-10 text-pink-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Image & Media Ready</h3>
          <p className="text-slate-400 text-sm">Supports images, PDFs, and documents with instant previews.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition">
          <FileText className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Your Files</h3>
          <p className="text-slate-400 text-sm">Each upload is logged with file type, size, and date in your dashboard.</p>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} CloudBox. All rights reserved.
      </footer> */}
    </div>
  );
}
