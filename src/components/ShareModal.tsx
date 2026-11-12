import React, { useState } from 'react';
import { KuralItem, LanguageMode, TOPICS } from '../data/kurals';
import { X, Copy, Check, Share2, Download, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  kural: KuralItem;
  language: LanguageMode;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  kural,
  language,
  onClose,
}) => {
  const [shareLang, setShareLang] = useState<LanguageMode>(language);
  const [includeExample, setIncludeExample] = useState(true);
  const [includeLife, setIncludeLife] = useState(true);
  const [includeBusiness, setIncludeBusiness] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const content = kural.content[shareLang];
  const topicMeta = TOPICS.find((t) => t.id === kural.topic);
  const topicLabel = topicMeta ? topicMeta.label[shareLang] : kural.topic;

  const buildShareText = (): string => {
    const lines: string[] = [
      `திருக்குறள் #${kural.number} · ${kural.adhigaram[shareLang]}`,
      `Concept: ${topicLabel}`,
      '',
      `${kural.line1}`,
      `${kural.line2}`,
    ];

    if (shareLang !== 'tamil') {
      lines.push(`(${kural.tanglishCouplet})`);
    }

    lines.push('');
    const expHeader =
      shareLang === 'tamil'
        ? 'தெளிவுரை:'
        : shareLang === 'tanglish'
        ? 'Meaning (Tanglish):'
        : 'Explanation:';
    lines.push(`${expHeader}\n${content.explanation}`);

    if (includeExample) {
      lines.push('');
      const exHeader =
        shareLang === 'tamil'
          ? 'நடைமுறை உதாரணம்:'
          : 'Real-World Example:';
      lines.push(`${exHeader}\n${content.realWorldExample}`);
    }

    if (includeLife) {
      lines.push('');
      const lifeHeader =
        shareLang === 'tamil'
          ? 'வாழ்க்கைக்கு வழிகாட்டி:'
          : 'Life Application:';
      lines.push(`${lifeHeader}\n${content.lifeApplication}`);
    }

    if (includeBusiness) {
      lines.push('');
      const bizHeader =
        shareLang === 'tamil'
          ? 'தொழில் & தலைமைத்துவம்:'
          : 'Business Application:';
      lines.push(`${bizHeader}\n${content.businessApplication}`);
    }

    lines.push('');
    const actionHeader =
      shareLang === 'tamil' ? 'இன்றைய செயல்:' : 'Daily Habit Action:';
    lines.push(`${actionHeader} ${content.actionableTakeaway}`);
    lines.push('\n— Nitham Oru Kural (Daily Thirukkural Habit App)');

    return lines.join('\n');
  };

  const shareText = buildShareText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `திருக்குறள் #${kural.number}`,
          text: shareText,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await handleCopy();
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    const link = document.createElement('a');
    link.href = `https://wa.me/?text=${encoded}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleDownloadPoster = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Modern slate background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Inner card surface
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(48, 48, canvas.width - 96, canvas.height - 96);

      // Header metadata
      ctx.fillStyle = '#34D399';
      ctx.font = '600 28px sans-serif';
      ctx.fillText(
        `திருக்குறள் #${kural.number}  ·  ${kural.adhigaram[shareLang]}`,
        96,
        125
      );

      // Divider
      ctx.fillStyle = '#334155';
      ctx.fillRect(96, 155, canvas.width - 192, 2);

      // Tamil Couplet
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 40px sans-serif';
      ctx.fillText(kural.line1, 96, 235);
      ctx.fillText(kural.line2, 96, 295);

      const drawWrappedText = (
        text: string,
        x: number,
        startY: number,
        maxWidth: number,
        lineHeight: number,
        font: string,
        color: string
      ): number => {
        ctx.font = font;
        ctx.fillStyle = color;
        const words = text.split(' ');
        let line = '';
        let y = startY;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line.trim()) {
          ctx.fillText(line.trim(), x, y);
          y += lineHeight;
        }
        return y;
      };

      let cursorY = 370;

      ctx.fillStyle = '#34D399';
      ctx.font = '700 26px sans-serif';
      ctx.fillText(
        shareLang === 'tamil' ? 'தெளிவுரை' : 'EXPLANATION',
        96,
        cursorY
      );
      cursorY += 42;
      cursorY = drawWrappedText(
        content.explanation,
        96,
        cursorY,
        canvas.width - 192,
        40,
        '400 28px sans-serif',
        '#E2E8F0'
      );

      cursorY += 32;

      ctx.fillStyle = '#34D399';
      ctx.font = '700 26px sans-serif';
      ctx.fillText(
        shareLang === 'tamil' ? 'வாழ்க்கைக்கு வழிகாட்டி' : 'LIFE APPLICATION',
        96,
        cursorY
      );
      cursorY += 42;
      cursorY = drawWrappedText(
        content.lifeApplication,
        96,
        cursorY,
        canvas.width - 192,
        38,
        '400 26px sans-serif',
        '#CBD5E1'
      );

      cursorY += 32;

      ctx.fillStyle = '#34D399';
      ctx.font = '700 26px sans-serif';
      ctx.fillText(
        shareLang === 'tamil'
          ? 'தொழில் & தலைமைத்துவம்'
          : 'BUSINESS APPLICATION',
        96,
        cursorY
      );
      cursorY += 42;
      cursorY = drawWrappedText(
        content.businessApplication,
        96,
        cursorY,
        canvas.width - 192,
        38,
        '400 26px sans-serif',
        '#CBD5E1'
      );

      ctx.fillStyle = '#064E3B';
      ctx.fillRect(96, 1120, canvas.width - 192, 130);
      drawWrappedText(
        `இன்றைய செயல்: ${content.actionableTakeaway}`,
        124,
        1168,
        canvas.width - 248,
        36,
        '600 24px sans-serif',
        '#A7F3D0'
      );

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `daily-kural-${kural.number}.png`;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Share Daily Kural #{kural.number}
            </h3>
            <p className="text-xs text-slate-500">
              {kural.adhigaram[shareLang]} · Offline Share Studio
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Share Language
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
              {(['tamil', 'tanglish', 'english'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setShareLang(lang)}
                  className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    shareLang === lang
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'tamil'
                    ? 'எளிய தமிழ்'
                    : lang === 'tanglish'
                    ? 'Tanglish'
                    : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIncludeExample((v) => !v)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                includeExample
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {includeExample ? '✓ ' : '+ '}Real-World Example
            </button>
            <button
              type="button"
              onClick={() => setIncludeLife((v) => !v)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                includeLife
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {includeLife ? '✓ ' : '+ '}Life Application
            </button>
            <button
              type="button"
              onClick={() => setIncludeBusiness((v) => !v)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                includeBusiness
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {includeBusiness ? '✓ ' : '+ '}Business Application
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
            {shareText}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={handleNativeShare}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Share App</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 shrink-0" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPoster}
            disabled={downloading}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{downloading ? 'Saving...' : 'Poster PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
