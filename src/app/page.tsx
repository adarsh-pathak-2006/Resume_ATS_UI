'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Floating orbs */}
      <div className="landing-orb orb-1" />
      <div className="landing-orb orb-2" />
      <div className="landing-orb orb-3" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-mark">R</div>
          ResumeATS
        </div>
        <div className="landing-nav-links">
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn btn-primary">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-badge">
          ⚡ Powered by Gemini AI
        </div>
        <h1 className="hero-title">
          Land More Interviews with
          <br />
          <span className="hero-gradient-text">ATS-Optimized Resumes</span>
        </h1>
        <p className="hero-subtitle">
          Upload your resume, paste any job description, and let AI generate a perfectly 
          tailored, ATS-friendly resume and cover letter in seconds.
        </p>
        <div className="hero-actions">
          <Link href={isAuthenticated ? '/dashboard/analyze' : '/register'} className="btn btn-primary btn-lg">
            ✨ Start for Free
          </Link>
          <Link href={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-secondary btn-lg">
            Learn More →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon stat-icon purple">🤖</div>
            <h3 className="feature-title">AI-Powered Generation</h3>
            <p className="feature-desc">
              Our Gemini AI analyzes your resume against the job description and generates 
              a perfectly optimized version that passes ATS filters.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon stat-icon emerald">📝</div>
            <h3 className="feature-title">Cover Letter Included</h3>
            <p className="feature-desc">
              Optionally generate a compelling, personalized cover letter that complements 
              your resume and speaks directly to the company culture.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon stat-icon amber">⚡</div>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-desc">
              Get your optimized resume in seconds, not hours. Our async processing 
              engine handles everything in the background while you wait.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
