'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { Resume } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';
import { SpinnerSmall } from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function AnalyzePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [letterRequired, setLetterRequired] = useState(true);

  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/core/resume/');
        setResumes(res.data);
        if (res.data.length > 0) {
          setSelectedResumeId(res.data[0].id);
        }
      } catch {
        showToast('error', 'Failed to load resumes.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [showToast]);

  const currentStep = () => {
    if (!selectedResumeId) return 1;
    if (!jobDescription.trim()) return 1;
    if (!aboutCompany.trim()) return 2;
    return 3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      showToast('error', 'Please select a resume.');
      return;
    }

    if (!jobDescription.trim()) {
      showToast('error', 'Please enter a job description.');
      return;
    }

    if (!aboutCompany.trim()) {
      showToast('error', 'Please enter company information.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post(`/core/resume-analyse/${selectedResumeId}/`, {
        job_description: jobDescription,
        about_company: aboutCompany,
        letter_required: letterRequired,
      });

      showToast('success', 'Analysis started! Redirecting to results...');
      router.push(`/dashboard/history/${res.data.analysis_id}`);
    } catch {
      showToast('error', 'Failed to start analysis. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading resumes..." />;

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">New Analysis ✨</h1>
        <p className="page-subtitle">Generate an ATS-optimized resume tailored to a specific job.</p>
      </div>

      {resumes.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📄</div>
          <h3 className="empty-state-title">No Resumes Found</h3>
          <p className="empty-state-desc">You need to upload a resume before running an analysis.</p>
          <Link href="/dashboard/resumes" className="btn btn-primary">Upload Resume →</Link>
        </div>
      ) : (
        <div className="analyze-form-container">
          {/* Progress Steps */}
          <div className="analyze-steps">
            <div className={`analyze-step ${currentStep() >= 1 ? 'active' : ''} ${currentStep() > 1 ? 'completed' : ''}`}>
              <div className="analyze-step-number">{currentStep() > 1 ? '✓' : '1'}</div>
              Select Resume
            </div>
            <div className={`analyze-step ${currentStep() >= 2 ? 'active' : ''} ${currentStep() > 2 ? 'completed' : ''}`}>
              <div className="analyze-step-number">{currentStep() > 2 ? '✓' : '2'}</div>
              Job Details
            </div>
            <div className={`analyze-step ${currentStep() >= 3 ? 'active' : ''}`}>
              <div className="analyze-step-number">3</div>
              Generate
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="glass-card analyze-form-card">
              {/* Resume Selection */}
              <div className="form-group">
                <label className="form-label" htmlFor="analyze-resume">Select Resume</label>
                <select
                  id="analyze-resume"
                  className="form-select"
                  value={selectedResumeId || ''}
                  onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                >
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.resume.split('/').pop() || `Resume #${resume.id}`} — Uploaded {new Date(resume.added_on).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="analyze-jd">Job Description</label>
                <textarea
                  id="analyze-jd"
                  className="form-textarea"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  style={{ minHeight: '180px' }}
                  required
                />
              </div>

              {/* Company Info */}
              <div className="form-group">
                <label className="form-label" htmlFor="analyze-company">About the Company</label>
                <textarea
                  id="analyze-company"
                  className="form-textarea"
                  placeholder="Tell us about the company — name, industry, culture, values..."
                  value={aboutCompany}
                  onChange={(e) => setAboutCompany(e.target.value)}
                  required
                />
              </div>

              {/* Cover Letter Toggle */}
              <div className="form-group">
                <div
                  className="toggle-wrapper"
                  onClick={() => setLetterRequired(!letterRequired)}
                >
                  <div className={`toggle-track ${letterRequired ? 'active' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                  <span className="toggle-label">
                    {letterRequired ? '✉️ Cover letter will be generated' : 'Resume only (no cover letter)'}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={submitting || !selectedResumeId || !jobDescription.trim() || !aboutCompany.trim()}
              >
                {submitting ? (
                  <><SpinnerSmall /> Generating...</>
                ) : (
                  '✨ Generate ATS-Optimized Resume'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
