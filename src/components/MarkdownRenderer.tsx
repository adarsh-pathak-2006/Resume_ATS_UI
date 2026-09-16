'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown-like rendering for AI-generated content
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const Tag = listType;
        elements.push(
          <Tag key={`list-${elements.length}`}>
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </Tag>
        );
        listItems = [];
        listType = null;
      }
    };

    const formatInline = (line: string): string => {
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return line;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Headers
      if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i}>{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i}>{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={i}>{line.slice(2)}</h1>);
      }
      // Unordered list
      else if (line.match(/^[\s]*[-•*]\s/)) {
        const item = line.replace(/^[\s]*[-•*]\s/, '');
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        listItems.push(item);
      }
      // Ordered list
      else if (line.match(/^[\s]*\d+\.\s/)) {
        const item = line.replace(/^[\s]*\d+\.\s/, '');
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        listItems.push(item);
      }
      // Horizontal rule
      else if (line.match(/^---+$/)) {
        flushList();
        elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />);
      }
      // Empty line
      else if (line.trim() === '') {
        flushList();
      }
      // Regular paragraph
      else {
        flushList();
        elements.push(
          <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      }
    }

    flushList();
    return elements;
  };

  return <div className="content-body">{renderContent(content)}</div>;
}
