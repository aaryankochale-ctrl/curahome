import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceType, DocumentItem } from '../../types';
import { SERVICE_TYPE_CONFIG, DISTRICT_ZONES } from '../../data/mockData';
import {
  X,
  ArrowLeft,
  User,
  Award,
  FileCheck,
  MapPin,
  Clock,
  Phone,
  Upload,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

interface NurseRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (nurseId: string) => void;
}

export const NurseRegistrationModal: React.FC<NurseRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
}) => {
  const { registerNurse } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal & Contact
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('1994-05-15');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [districtZone, setDistrictZone] = useState(DISTRICT_ZONES[0]);

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  // Step 2: Nursing Qualification & Clinical Profile
  const [qualification, setQualification] = useState('B.Sc Nursing');
  const [qualificationDetails, setQualificationDetails] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issuingCouncil, setIssuingCouncil] = useState('Maharashtra Nursing Council / Indian Nursing Council');
  const [yearsOfExperience, setYearsOfExperience] = useState(4);
  const [selectedExpertise, setSelectedExpertise] = useState<ServiceType[]>([
    'wound_dressing',
    'basic_nursing',
  ]);
  const [selectedZones, setSelectedZones] = useState<string[]>([DISTRICT_ZONES[0]]);
  const [selectedShifts, setSelectedShifts] = useState<
    ('morning' | 'afternoon' | 'evening' | 'night')[]
  >(['morning', 'afternoon']);

  // Step 3: Document Uploads
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const toggleExpertise = (st: ServiceType) => {
    setSelectedExpertise((prev) =>
      prev.includes(st) ? prev.filter((item) => item !== st) : [...prev, st]
    );
  };

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleSimulatedFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: DocumentItem['type']
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const file = files[0];
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: docType,
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

    if (!fullName.trim() || !phone.trim() || !licenseNumber.trim()) {
      alert('Please fill out all required clinical and identity fields.');
      return;
    }

    if (selectedExpertise.length === 0) {
      alert('Please select at least one clinical area of expertise.');
      return;
    }

    if (selectedZones.length === 0) {
      alert('Please select at least one preferred working area.');
      return;
    }

    // Default sample documents if user didn't upload any
    const finalDocs =
      documents.length > 0
        ? documents
        : [
            {
              id: `doc-reg-1-${Date.now()}`,
              name: `${licenseNumber.replace(/\s+/g, '_')}_License_Card.pdf`,
              type: 'license_certificate',
              uploadedAt: new Date().toISOString(),
              fileSize: '1.6 MB',
              verified: false,
            },
            {
              id: `doc-reg-2-${Date.now()}`,
              name: `${qualification.replace(/\s+/g, '_')}_Degree_Diploma.pdf`,
              type: 'degree_certificate',
              uploadedAt: new Date().toISOString(),
              fileSize: '2.8 MB',
              verified: false,
            },
            {
              id: `doc-reg-3-${Date.now()}`,
              name: 'Government_Photo_ID.pdf',
              type: 'id_proof',
              uploadedAt: new Date().toISOString(),
              fileSize: '1.2 MB',
              verified: false,
            },
          ];

    const created = registerNurse({
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone.trim(),
      dob,
      address: address.trim() || '742 Evergreen Way',
      city,
      districtZone,
      qualification,
      qualificationDetails:
        qualificationDetails.trim() || 'Regional Institute of Health & Nursing Sciences',
      licenseNumber: licenseNumber.trim(),
      issuingCouncil: issuingCouncil.trim(),
      yearsOfExperience: Number(yearsOfExperience),
      areasOfExpertise: selectedExpertise,
      preferredWorkingAreas: selectedZones,
      availability: {
        shifts: selectedShifts,
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        isActiveOnDuty: false, // Inactive until verified!
      },
      emergencyContact: {
        fullName: emergencyName.trim() || 'Emergency Contact',
        phone: emergencyPhone.trim() || '+1 (555) 999-0000',
        relationship: emergencyRelation.trim() || 'Family',
      },
      documents: finalDocs,
    });

    onClose();
    if (onRegistered) onRegistered(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-teal-800">
              Clinician Enrollment
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Registered Nurse Application & Verification Submission
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-100 flex items-center gap-3 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStep(1)}
            className={`font-semibold flex items-center gap-1.5 ${
              step === 1 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 1 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>1</span>
            Personal & Contact
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => setStep(2)}
            className={`font-semibold flex items-center gap-1.5 ${
              step === 2 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 2 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>2</span>
            License & Expertise
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => setStep(3)}
            className={`font-semibold flex items-center gap-1.5 ${
              step === 3 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 3 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>3</span>
            Documents & Verification
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Full Legal Name (with credentials)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maria Vasquez, RN"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maria.vasquez@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, apartment/suite number"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Home Base District
                  </label>
                  <select
                    value={districtZone}
                    onChange={(e) => setDistrictZone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    {DISTRICT_ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Emergency / Next of Kin Contact
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Contact name"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      placeholder="Spouse / Parent / Sibling"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Primary Nursing Qualification
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    <option value="B.Sc Nursing">B.Sc Nursing (Bachelor of Science)</option>
                    <option value="GNM">General Nursing & Midwifery (GNM)</option>
                    <option value="ANM">Auxiliary Nursing & Midwifery (ANM)</option>
                    <option value="Nurse Practitioner">Nurse Practitioner (NP / APN)</option>
                    <option value="M.Sc Nursing">M.Sc Nursing (Master of Science)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Years of Clinical Practice
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Official Nursing License / Registration Number
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. RN-2023-88914"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Issuing Nursing Council / Authority
                  </label>
                  <input
                    type="text"
                    required
                    value={issuingCouncil}
                    onChange={(e) => setIssuingCouncil(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Graduation College / Institute Details
                  </label>
                  <input
                    type="text"
                    value={qualificationDetails}
                    onChange={(e) => setQualificationDetails(e.target.value)}
                    placeholder="e.g. St. Jude Institute of Health Sciences, Class of 2018"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Areas of Expertise */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Clinical Areas of Expertise (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(SERVICE_TYPE_CONFIG) as ServiceType[]).map((st) => {
                    const conf = SERVICE_TYPE_CONFIG[st];
                    const isChecked = selectedExpertise.includes(st);
                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => toggleExpertise(st)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all ${
                          isChecked
                            ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-medium ring-1 ring-teal-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate font-semibold">{conf.category}</div>
                        <div className="text-[10px] text-slate-500 truncate">{conf.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Working Areas */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Preferred Working Areas / Travel Zones
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISTRICT_ZONES.map((zone) => {
                    const isChecked = selectedZones.includes(zone);
                    return (
                      <button
                        type="button"
                        key={zone}
                        onClick={() => toggleZone(zone)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                          isChecked
                            ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {zone}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Mandatory Admin Verification:</strong> Upon submission, your profile will be
                  marked as <strong>"Pending Verification"</strong>. The platform Administrator will
                  verify your license with the regulatory council before granting active duty status.
                  You will not be assigned to patients until verified.
                </div>
              </div>

              {/* Upload buckets */}
              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        1. Nursing License / Registration Certificate
                      </div>
                      <div className="text-[11px] text-slate-500">
                        State Nursing Board card or official registration certificate
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-800 bg-white border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50">
                      <Upload size={13} /> Browse
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleSimulatedFileUpload(e, 'license_certificate')}
                      />
                    </label>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        2. Nursing Degree / Diploma Certificate
                      </div>
                      <div className="text-[11px] text-slate-500">
                        B.Sc, GNM, or ANM completion certificate / transcript
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-800 bg-white border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50">
                      <Upload size={13} /> Browse
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleSimulatedFileUpload(e, 'degree_certificate')}
                      />
                    </label>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        3. Government Photo ID / Passport
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Valid government identity document for background verification
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-800 bg-white border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50">
                      <Upload size={13} /> Browse
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleSimulatedFileUpload(e, 'id_proof')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              {documents.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    Uploaded Documents ({documents.length})
                  </div>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck size={16} className="text-teal-700 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                        <span className="text-slate-400">({doc.fileSize})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <div>
            <button
              type="button"
              onClick={() => {
                if (step > 1) {
                  setStep((s) => (s - 1) as 1 | 2);
                } else {
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg bg-slate-200/70 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>{step > 1 ? 'Back Step' : 'Back / Close'}</span>
            </button>
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
                Submit Credentials for Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
