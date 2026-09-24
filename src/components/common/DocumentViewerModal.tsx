import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { previewDocument, setPreviewDocument, activeRole } = useApp();

  if (!previewDocument) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 truncate max-w-md">
                {previewDocument.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{previewDocument.fileSize}</span>
                <span>·</span>
                <span>Uploaded {new Date(previewDocument.uploadedAt).toLocaleDateString()}</span>
                {previewDocument.verified !== undefined && (
                  <>
                    <span>·</span>
                    <span className={previewDocument.verified ? 'text-teal-700 font-medium' : 'text-amber-700'}>
                      {previewDocument.verified ? 'Verified Document' : 'Pending Verification'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setPreviewDocument(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Document Content Simulation */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100/70">
          <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-8 min-h-[380px] flex flex-col justify-between">
            <div>
              {/* Document Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-teal-800">
                    Official Healthcare Record
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {previewDocument.type.replace(/_/g, ' ').toUpperCase()}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 font-mono">
                  REF-{previewDocument.id}
                </div>
              </div>

              {/* Simulated Document Body */}
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800">Document Type:</span>{' '}
                      {previewDocument.type.replace(/_/g, ' ')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Verification Hash:</span>{' '}
                      <span className="font-mono text-[11px]">SHA256: 4b98...e1a2</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Issuer Authority:</span> State Health & Licensing Board
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Document Status:</span> Active & Validated
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <h4 className="font-semibold text-slate-900 mb-1">Official Registry Validation & Audit Summary</h4>
                  <p className="text-slate-600">
                    This document has been submitted through the CuraHome encrypted clinical credentialing portal.
                    The credentials, license stamps, and signatures contained herein correspond to authorized registered
                    healthcare practitioners certified for in-home nursing administration.
                  </p>
                </div>

                <div className="border border-dashed border-slate-200 rounded p-4 text-center text-slate-500 bg-slate-50/50">
                  <p className="text-xs">
                    [Encrypted document raster preview loaded with primary watermark security seal]
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-teal-700 font-medium bg-teal-50 px-3 py-1 rounded">
                    <ShieldCheck size={14} /> Digital Registry Attestation Intact
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>CuraHome Certified Health Repository</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-white">
          <div className="text-xs text-slate-500">
            {activeRole === 'admin' ? 'Admin verification review mode' : 'Viewing authorized record'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Downloading ${previewDocument.name}...`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Download size={14} /> Download Document
            </button>
            <button
              onClick={() => setPreviewDocument(null)}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
