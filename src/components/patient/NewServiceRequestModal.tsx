import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceType, Priority, TimeSlot, DocumentItem } from '../../types';
import { SERVICE_TYPE_CONFIG, DISTRICT_ZONES } from '../../data/mockData';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Syringe,
  HeartPulse,
  Activity,
  Users,
  ShieldCheck,
  Stethoscope,
  Droplet,
  Trash2,
} from 'lucide-react';

interface NewServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (requestId: string) => void;
}

export const NewServiceRequestModal: React.FC<NewServiceRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentPatient, createServiceRequest } = useApp();

  const [patientName, setPatientName] = useState(currentPatient?.fullName || '');
  const [patientAge, setPatientAge] = useState(currentPatient?.age || 45);
  const [patientPhone, setPatientPhone] = useState(currentPatient?.phone || '');
  const [duration, setDuration] = useState('1 Visit (approx 1 hr)');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serviceType, setServiceType] = useState<ServiceType>('wound_dressing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('routine');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<TimeSlot>('morning');
  const [specificTime, setSpecificTime] = useState('09:30 AM');
  const [locationAddress, setLocationAddress] = useState(currentPatient?.address || '');
  const [locationDistrictZone, setLocationDistrictZone] = useState(
    currentPatient?.districtZone || DISTRICT_ZONES[0]
  );
  const [locationLandmark, setLocationLandmark] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !currentPatient) return null;

  const handleServiceSelect = (st: ServiceType) => {
    setServiceType(st);
    if (!title || title.length < 5) {
      setTitle(SERVICE_TYPE_CONFIG[st].label);
    }
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const file = files[0];
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.name.toLowerCase().includes('prescription')
          ? 'prescription'
          : 'discharge_summary',
        uploadedAt: new Date().toISOString(),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        verified: false,
      };
      setDocuments((prev) => [...prev, newDoc]);
      setIsUploading(false);
    }, 600);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a service title or summary.');
      return;
    }
    if (!description.trim()) {
      alert('Please describe your medical care requirements.');
      return;
    }
    if (!locationAddress.trim()) {
      alert('Please provide your home visit address.');
      return;
    }

    const created = createServiceRequest({
      patientId: currentPatient.id,
      patientName: patientName.trim() || currentPatient.fullName,
      patientPhone: patientPhone.trim() || currentPatient.phone,
      patientAge: Number(patientAge) || currentPatient.age,
      patientGender: currentPatient.gender,
      serviceType,
      title: title.trim(),
      description: description.trim(),
      priority,
      preferredDate,
      preferredTimeSlot,
      specificTime,
      duration,
      locationAddress: locationAddress.trim(),
      locationDistrictZone,
      locationLandmark: locationLandmark.trim(),
      specialInstructions: specialInstructions.trim(),
      documents,
    });

    onClose();
    if (onSuccess) onSuccess(created.id);
  };

  const renderServiceIcon = (st: ServiceType) => {
    switch (st) {
      case 'injection_medication':
        return <Syringe size={20} className="text-teal-600" />;
      case 'wound_dressing':
        return <Activity size={20} className="text-teal-600" />;
      case 'post_surgery':
        return <HeartPulse size={20} className="text-teal-600" />;
      case 'elderly_care':
        return <Users size={20} className="text-teal-600" />;
      case 'iv_therapy':
        return <Droplet size={20} className="text-teal-600" />;
      case 'basic_nursing':
        return <Stethoscope size={20} className="text-teal-600" />;
      case 'recovery_assistance':
        return <ShieldCheck size={20} className="text-teal-600" />;
      default:
        return <Activity size={20} className="text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-teal-800">
              Home Healthcare Request
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Request a Qualified Nurse for Home Visit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep(1)}
              className={`font-semibold flex items-center gap-1.5 transition-colors ${
                step === 1 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 1 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>1</span>
              Select Care Service
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => setStep(2)}
              className={`font-semibold flex items-center gap-1.5 transition-colors ${
                step === 2 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 2 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>2</span>
              Schedule & Location
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => setStep(3)}
              className={`font-semibold flex items-center gap-1.5 transition-colors ${
                step === 3 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>3</span>
              Medical Notes & Docs
            </button>
          </div>
          <div className="text-[11px] text-slate-400">
            For: <span className="font-semibold text-slate-700">{currentPatient.fullName}</span>
          </div>
        </div>

        {/* Step Forms */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              {/* Patient Basic Info Fields */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs font-bold text-slate-800 mb-2">Patient Contact & Identity</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                      placeholder="Full patient name"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Patient Age</label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      required
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Select Required Healthcare Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(SERVICE_TYPE_CONFIG) as ServiceType[]).map((st) => {
                    const conf = SERVICE_TYPE_CONFIG[st];
                    const isSelected = serviceType === st;
                    return (
                      <div
                        key={st}
                        onClick={() => handleServiceSelect(st)}
                        className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-teal-50 border border-teal-100">
                              {renderServiceIcon(st)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{conf.label}</div>
                              <div className="text-[11px] text-slate-500">
                                Typical visit: {conf.typicalDuration}
                              </div>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 size={16} className="text-teal-700 shrink-0" />}
                        </div>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {conf.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Specific Request Title / Summary
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Daily post-op wound dressing & drain inspection"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Priority Urgency
                </label>
                <div className="flex gap-3">
                  <label
                    className={`flex-1 p-2.5 rounded-lg border cursor-pointer text-xs font-medium flex items-center justify-between ${
                      priority === 'routine'
                        ? 'border-teal-600 bg-teal-50/40 text-teal-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Routine Care (Scheduled in advance)</span>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === 'routine'}
                      onChange={() => setPriority('routine')}
                      className="text-teal-600"
                    />
                  </label>
                  <label
                    className={`flex-1 p-2.5 rounded-lg border cursor-pointer text-xs font-medium flex items-center justify-between ${
                      priority === 'urgent'
                        ? 'border-rose-600 bg-rose-50/40 text-rose-900 ring-1 ring-rose-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Urgent (Needs same-day / next-day priority review)</span>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === 'urgent'}
                      onChange={() => setPriority('urgent')}
                      className="text-rose-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Preferred Visit Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                    <Calendar size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value as TimeSlot)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
                    >
                      <option value="morning">Morning (08:00 AM – 11:30 AM)</option>
                      <option value="afternoon">Afternoon (12:00 PM – 03:30 PM)</option>
                      <option value="evening">Evening (04:00 PM – 07:30 PM)</option>
                      <option value="anytime">Flexible / Any Available Slot</option>
                    </select>
                    <Clock size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Specific Time Preference (Optional)
                  </label>
                  <input
                    type="text"
                    value={specificTime}
                    onChange={(e) => setSpecificTime(e.target.value)}
                    placeholder="e.g. 09:30 AM or Around 2:00 PM"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Duration of Service
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
                  >
                    <option value="1 Visit (approx 45 mins - 1 hr)">1 Visit (approx 45 mins - 1 hr)</option>
                    <option value="2 Hours Care Shift">2 Hours Care Shift</option>
                    <option value="Half Day Shift (4 Hours)">Half Day Shift (4 Hours)</option>
                    <option value="Full Day Shift (8 Hours)">Full Day Shift (8 Hours)</option>
                    <option value="12 Hours Night Shift">12 Hours Night Shift</option>
                    <option value="Daily Recurring (1 Week)">Daily Recurring (1 Week)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Home Visit Address
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Pre-filled from your profile
                  </span>
                </div>
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="Full street address, apartment/unit number"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                  <MapPin size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      District / Working Zone
                    </label>
                    <select
                      value={locationDistrictZone}
                      onChange={(e) => setLocationDistrictZone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                    >
                      {DISTRICT_ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Building Landmark or Access Notes
                    </label>
                    <input
                      type="text"
                      value={locationLandmark}
                      onChange={(e) => setLocationLandmark(e.target.value)}
                      placeholder="e.g. Elevator in Lobby B, Intercom #204"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Detailed Medical Requirements & Physician Instructions
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe symptoms, wound condition, medication dosage, doctor's discharge instructions, or assistance needed..."
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Special Access or Patient Comfort Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Dog is kept in room, please ring doorbell twice, patient is hard of hearing"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              {/* Document Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Upload Relevant Medical Documents (Prescriptions, Discharge Summary, Lab Reports)
                </label>
                <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <Upload size={24} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-700 font-medium">
                    Upload physician prescription or discharge order
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Helps the clinical administrator assign the exact qualified nurse specialist
                  </p>
                  <label className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-white border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors shadow-2xs">
                    <span>Browse File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleSimulatedFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />
                  </label>
                  {isUploading && (
                    <div className="mt-2 text-xs text-teal-700 font-medium animate-pulse">
                      Encrypting & uploading document...
                    </div>
                  )}
                </div>

                {/* Uploaded Documents List */}
                {documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Attached Documents ({documents.length})
                    </span>
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText size={16} className="text-teal-700 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                          <span className="text-slate-400">({doc.fileSize})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Patient Safety Note */}
              <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-lg flex items-start gap-2.5 text-xs text-teal-900">
                <AlertCircle size={16} className="text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Oversight Notice:</strong> All nursing assignments are verified and
                  monitored by our Chief Medical Admin. Your sensitive medical records are strictly
                  encrypted and shared only on a need-to-know basis with your assigned qualified nurse.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
              >
                Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
