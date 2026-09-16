'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Resume, Analysis } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, analysisRes] = await Promise.all([
          api.get('/core/resume/'),
          api.get('/core/analysis/'),
        ]);
        setResumes(resumeRes.data);
        setAnalyses(analysisRes.data);
      } catch {
        // Silently handle - user will see empty states
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const completedAnalyses = analyses.filter((a) => a.generated_resume);
  const pendingAnalyses = analyses.filter((a) => !a.generated_resume);
  const coverLetters = analyses.filter((a) => a.cover_letter);

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.username}</span> 👋
        </h1>
        <p className="page-subtitle">Here&apos;s an overview of your resume generation activity.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon purple">📄</div>
          <div>
            <div className="stat-value">{resumes.length}</div>
            <div className="stat-label">Resumes Uploaded</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon emerald">✅</div>
          <div>
            <div className="stat-value">{completedAnalyses.length}</div>
            <div className="stat-label">Completed Analyses</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon amber">⏳</div>
          <div>
            <div className="stat-value">{pendingAnalyses.length}</div>
            <div className="stat-label">Processing</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon sky">✉️</div>
          <div>
            <div className="stat-value">{coverLetters.length}</div>
            <div className="stat-label">Cover Letters</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-between mb-24">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Quick Actions</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Link href="/dashboard/resumes" className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon purple" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>📄</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Upload Resume</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add a new resume PDF</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
        </Link>
        <Link href="/dashboard/analyze" className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon emerald" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>✨</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>New Analysis</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate optimized resume</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
        </Link>
        <Link href="/dashboard/history" className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon sky" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>📋</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>View History</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Browse past analyses</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
        </Link>
      </div>

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <>
          <div className="flex-between mb-16">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Analyses</h2>
            <Link href="/dashboard/history" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          <div className="glass-card table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Description</th>
                  <th>Cover Letter</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {analyses.slice(0, 5).map((analysis) => (
                  <tr key={analysis.id}>
                    <td>
                      <Link href={`/dashboard/history/${analysis.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {analysis.job_description.slice(0, 60)}...
                      </Link>
                    </td>
                    <td>
                      {analysis.letter_required ? (
                        <span className="badge badge-info"><span className="badge-dot" />Yes</span>
                      ) : (
                        <span className="badge badge-warning">No</span>
                      )}
                    </td>
                    <td>
                      {analysis.generated_resume ? (
                        <span className="badge badge-success"><span className="badge-dot" />Complete</span>
                      ) : (
                        <span className="badge badge-warning"><span className="badge-dot" />Processing</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(analysis.created_on).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
