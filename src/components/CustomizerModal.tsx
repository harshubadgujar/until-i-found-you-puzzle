import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, RotateCcw, Copy, Check, Heart, QrCode, Download } from 'lucide-react';
import type { CoupleConfig } from '../types';

interface CustomizerProps {
  config: CoupleConfig;
  isAdmin: boolean;
  onSave: (newConfig: CoupleConfig) => void;
  onReset: () => void;
}

export const CustomizerModal: React.FC<CustomizerProps> = ({ config, isAdmin, onSave, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CoupleConfig>(config);
  const [shareName, setShareName] = useState<string>('Mansi');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleChange = (field: keyof CoupleConfig, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  const getShareUrl = (name: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const cleanName = name.trim() || 'Siddhi';
    return `${baseUrl}?name=${encodeURIComponent(cleanName)}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl(shareName);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentShareUrl = getShareUrl(shareName);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=f43f5e&bgcolor=0f172a&margin=10&data=${encodeURIComponent(currentShareUrl)}`;

  // Direct Blob PNG Download for QR Code Image Scanner Card
  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      // Create offscreen canvas for a high-res romantic QR card
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 600, 700);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#4c0519');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 700);

        // Outer Glow Border
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, 560, 660);

        // Header Title
        ctx.fillStyle = '#fecdd3';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Until I Found You 💖', 300, 80);

        // Subtitle
        ctx.fillStyle = '#f472b6';
        ctx.font = '20px sans-serif';
        ctx.fillText(`A Special Romantic Journey For ${shareName || 'You'}`, 300, 125);

        // Load QR Code Image cross-origin
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = qrCodeUrl;

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        // Draw QR Code in Center
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(150, 160, 300, 300);
        ctx.drawImage(img, 150, 160, 300, 300);

        // Instructions Footer
        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Scan with Camera to Play 🎵', 300, 510);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px sans-serif';
        ctx.fillText(currentShareUrl, 300, 560);

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'italic 16px serif';
        ctx.fillText('✨ Made with Love ✨', 300, 620);

        // Export Canvas to Data URL & Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `Until_I_Found_You_${shareName || 'QR'}_ScannerCard.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // Fallback: Direct Blob fetch
      try {
        const res = await fetch(qrCodeUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Until_I_Found_You_${shareName || 'QR'}_Scanner.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(qrCodeUrl, '_blank');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // If recipient girl (not Admin mode), hide Settings gear completely!
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Floating Gear Button (Only visible in Admin mode) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 right-5 z-40 p-3 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-400/40 text-rose-200 hover:bg-rose-500/30 transition-all shadow-xl shadow-rose-950/50 group cursor-pointer"
        title="Admin Settings & QR Scanner Link Generator"
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 text-pink-300" />
      </button>

      {/* Customizer Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl text-rose-100 max-h-[88vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-rose-200 flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-400" />
                  <span>Admin Link & QR Scanner</span>
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 text-rose-300 hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* UNTIL I FOUND YOU - ROMANTIC QR CODE CARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-rose-950/60 to-purple-950/80 border border-rose-400/40 shadow-xl flex flex-col items-center text-center space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm uppercase tracking-wider">
                  <QrCode className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span>Until I Found You 💖</span>
                </div>
                <p className="text-xs text-rose-200/80">
                  Romantic QR Code Scanner for <span className="font-bold text-pink-300">{shareName || 'partner'}</span>
                </p>

                {/* QR Code Container */}
                <div className="relative p-3 rounded-2xl bg-slate-950 border-2 border-rose-500/40 shadow-inner flex flex-col items-center">
                  <img
                    src={qrCodeUrl}
                    alt={`Until I Found You QR for ${shareName}`}
                    className="w-44 h-44 rounded-xl object-contain shadow-md"
                  />
                  <div className="mt-2 text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-400" />
                    <span>Scan with camera to play</span>
                  </div>
                </div>

                {/* Input Name & Copy Link */}
                <div className="w-full flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Enter name (e.g. Mansi)"
                    value={shareName}
                    onChange={(e) => setShareName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-md hover:shadow-rose-500/50 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                {copied && (
                  <p className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Link & QR ready for {shareName}! 💖</span>
                  </p>
                )}

                {/* Direct Download Button */}
                <button
                  onClick={handleDownloadQR}
                  disabled={isDownloading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-amber-200" />
                  <span>{isDownloading ? 'Generating PNG Card...' : 'Save QR Card PNG 📥'}</span>
                </button>
              </div>

              {/* STORY DETAILS EDIT */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-rose-300 font-semibold mb-1">Current Name Shown</label>
                  <input
                    type="text"
                    value={formData.partner2Name}
                    onChange={(e) => handleChange('partner2Name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-rose-300 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    value={formData.partner1Name}
                    onChange={(e) => handleChange('partner1Name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-rose-300 font-semibold mb-1">Love Letter Text</label>
                  <textarea
                    rows={4}
                    value={formData.loveLetterBody}
                    onChange={(e) => handleChange('loveLetterBody', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 leading-relaxed"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-md shadow-pink-500/30 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Story</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
