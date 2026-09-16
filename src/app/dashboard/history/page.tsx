'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Analysis } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await api.get('/core/analysis/');
        setAnalyses(res.data);
      } catch {
        showToast('error', 'Failed to load analysis history.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, [showToast]);

  if (loading) return <LoadingSpinner text="Loading history..." />;

  return (
    <div className="fade-in-up">
      <div className="flex-between page-header">
        <div>
          <h1 className="page-title">Analysis History</h1>
          <p className="page-subtitle">View all your past resume analyses and results.</p>
        </div>
        <Link href="/dashboard/analyze" className="btn btn-primary">
          + New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No Analyses Yet</h3>
          <p className="empty-state-desc">Run your first analysis to generate an ATS-optimized resume.</p>
          <Link href="/dashboard/analyze" className="btn btn-primary">✨ Start Analysis</Link>
        </div>
      ) : (
        <div className="history-list">
          {analyses.map((analysis) => (
            <Link
              key={analysis.id}
              href={`/dashboard/history/${analysis.id}`}
              className="glass-card history-card"
            >
              <div style={{ fontSize: '1.5rem' }}>
                {analysis.generated_resume ? '✅' : '⏳'}
              </div>
              <div className="history-card-content">
                <div className="history-card-jd">
                  {analysis.job_description.slice(0, 100)}...
                </div>
                <div className="history-card-meta">
                  <span>
                    {analysis.generated_resume ? (
                      <span className="badge badge-success"><span className="badge-dot" />Complete</span>
                    ) : (
                      <span className="badge badge-warning"><span className="badge-dot" />Processing</span>
                    )}
                  </span>
                  <span>
                    {analysis.letter_required ? '✉️ With cover letter' : '📄 Resume only'}
                  </span>
                  <span>
                    {new Date(analysis.created_on).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <span className="history-card-arrow">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
