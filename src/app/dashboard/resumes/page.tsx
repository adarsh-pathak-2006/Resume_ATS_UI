'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import type { Resume } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { useToast } from '@/components/Toast';
import { SpinnerSmall } from '@/components/LoadingSpinner';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const { showToast } = useToast();

  const fetchResumes = useCallback(async () => {
    try {
      const res = await api.get('/core/resume/');
      setResumes(res.data);
    } catch {
      showToast('error', 'Failed to load resumes.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await api.post('/core/resume/', formData);
      showToast('success', 'Resume uploaded successfully!');
      setSelectedFile(null);
      setShowUpload(false);
      fetchResumes();
    } catch {
      showToast('error', 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await api.delete(`/core/resume/${id}/`);
      showToast('success', 'Resume deleted.');
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      showToast('error', 'Failed to delete resume.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading resumes..." />;

  return (
    <div className="fade-in-up">
      <div className="flex-between page-header">
        <div>
          <h1 className="page-title">My Resumes</h1>
          <p className="page-subtitle">Upload and manage your resume PDFs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? '✕ Cancel' : '+ Upload Resume'}
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="glass-card fade-in-up" style={{ padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Upload New Resume</h3>
          <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          {selectedFile && (
            <button
              className="btn btn-primary mt-16"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? <><SpinnerSmall /> Uploading...</> : '📤 Upload Resume'}
            </button>
          )}
        </div>
      )}

      {/* Resume Grid */}
      {resumes.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📄</div>
          <h3 className="empty-state-title">No Resumes Yet</h3>
          <p className="empty-state-desc">Upload your first resume PDF to get started with AI-powered optimization.</p>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>+ Upload Resume</button>
        </div>
      ) : (
        <div className="resume-grid">
          {resumes.map((resume) => (
            <div key={resume.id} className="glass-card resume-card">
              <div className="resume-card-header">
                <div className="resume-card-icon">📄</div>
                <div>
                  <div className="resume-card-name">
                    {resume.resume.split('/').pop() || `Resume #${resume.id}`}
                  </div>
                  <div className="resume-card-date">
                    Uploaded {new Date(resume.added_on).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <div className="resume-card-actions">
                <a
                  href={resume.resume.startsWith('http') ? resume.resume : `${process.env.NEXT_PUBLIC_API_URL}${resume.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  👁️ View
                </a>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(resume.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
