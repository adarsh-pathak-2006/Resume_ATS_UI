'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { Analysis } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useToast } from '@/components/Toast';

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover_letter'>('resume');
  const [polling, setPolling] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await api.get(`/core/analysis/${params.id}/`);
      setAnalysis(res.data);

      // If still processing, poll every 5 seconds
      if (!res.data.generated_resume) {
        setPolling(true);
      } else {
        setPolling(false);
      }
    } catch {
      showToast('error', 'Failed to load analysis.');
      router.push('/dashboard/history');
    } finally {
      setLoading(false);
    }
  }, [params.id, showToast, router]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/core/analysis/${params.id}/`);
        setAnalysis(res.data);
        if (res.data.generated_resume) {
          setPolling(false);
          showToast('success', 'Analysis complete! Your results are ready.');
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [polling, params.id, showToast]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', `${label} copied to clipboard!`);
    }).catch(() => {
      showToast('error', 'Failed to copy. Please select and copy manually.');
    });
  };

  if (loading) return <LoadingSpinner text="Loading analysis..." />;
  if (!analysis) return null;

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => router.push('/dashboard/history')}>
          ←
        </button>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.4rem' }}>Analysis Results</h1>
          <p className="page-subtitle">
            {analysis.generated_resume ? 'Your optimized content is ready' : 'Processing your resume...'}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="detail-meta">
        <div className="detail-meta-item">
          <span className="detail-meta-icon">📅</span>
          {new Date(analysis.created_on).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="detail-meta-item">
          {analysis.generated_resume ? (
            <span className="badge badge-success"><span className="badge-dot" />Complete</span>
          ) : (
            <span className="badge badge-warning"><span className="badge-dot" />Processing</span>
          )}
        </div>
        <div className="detail-meta-item">
          <span className="detail-meta-icon">✉️</span>
          {analysis.letter_required ? 'Cover letter included' : 'Resume only'}
        </div>
      </div>

      {/* Job Description Summary */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Job Description
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxHeight: '120px', overflow: 'hidden', position: 'relative' }}>
          {analysis.job_description}
        </p>
      </div>

      {/* Results */}
      {analysis.generated_resume ? (
        <div className="glass-card content-viewer">
          {/* Tabs */}
          <div className="content-tabs">
            <button
              className={`content-tab ${activeTab === 'resume' ? 'active' : ''}`}
              onClick={() => setActiveTab('resume')}
            >
              📄 Generated Resume
            </button>
            {analysis.cover_letter && (
              <button
                className={`content-tab ${activeTab === 'cover_letter' ? 'active' : ''}`}
                onClick={() => setActiveTab('cover_letter')}
              >
                ✉️ Cover Letter
              </button>
            )}
          </div>

          {/* Content */}
          {activeTab === 'resume' && analysis.generated_resume && (
            <>
              <MarkdownRenderer content={analysis.generated_resume} />
              <div className="content-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleCopy(analysis.generated_resume!, 'Resume')}
                >
                  📋 Copy Resume
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    const blob = new Blob([analysis.generated_resume!], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'optimized-resume.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  💾 Download as Text
                </button>
              </div>
            </>
          )}

          {activeTab === 'cover_letter' && analysis.cover_letter && (
            <>
              <MarkdownRenderer content={analysis.cover_letter} />
              <div className="content-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleCopy(analysis.cover_letter!, 'Cover Letter')}
                >
                  📋 Copy Cover Letter
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    const blob = new Blob([analysis.cover_letter!], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'cover-letter.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  💾 Download as Text
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
            AI is Generating Your Resume...
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto' }}>
            This usually takes 15–30 seconds. The page will update automatically when results are ready.
          </p>
        </div>
      )}
    </div>
  );
}
