import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import { DISTRICT_ZONES } from '../../data/mockData';
import { X, User, Phone, MapPin, Heart, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentPatient, updatePatientProfile } = useApp();

  if (!isOpen || !currentPatient) return null;

  const [fullName, setFullName] = useState(currentPatient.fullName);
  const [phone, setPhone] = useState(currentPatient.phone);
  const [age, setAge] = useState(currentPatient.age);
  const [gender, setGender] = useState(currentPatient.gender);
  const [address, setAddress] = useState(currentPatient.address);
  const [districtZone, setDistrictZone] = useState(currentPatient.districtZone);

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState(currentPatient.emergencyContact.fullName);
  const [emergencyPhone, setEmergencyPhone] = useState(currentPatient.emergencyContact.phone);
  const [emergencyRelation, setEmergencyRelation] = useState(
    currentPatient.emergencyContact.relationship
  );

  // Medical info
  const [bloodGroup, setBloodGroup] = useState(currentPatient.medicalInfo.bloodGroup);
  const [allergiesText, setAllergiesText] = useState(
    currentPatient.medicalInfo.allergies.join(', ')
  );
  const [conditionsText, setConditionsText] = useState(
    currentPatient.medicalInfo.chronicConditions.join(', ')
  );
  const [medicationsText, setMedicationsText] = useState(
    currentPatient.medicalInfo.currentMedications.join(', ')
  );
  const [mobilityNotes, setMobilityNotes] = useState(
    currentPatient.medicalInfo.mobilityNotes || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updatePatientProfile(currentPatient.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender,
      address: address.trim(),
      districtZone,
      emergencyContact: {
        fullName: emergencyName.trim(),
        phone: emergencyPhone.trim(),
        relationship: emergencyRelation.trim(),
      },
      medicalInfo: {
        bloodGroup,
        allergies: allergiesText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        chronicConditions: conditionsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        currentMedications: medicationsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        mobilityNotes: mobilityNotes.trim(),
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
              Personal Healthcare Record
            </div>
            <h2 className="text-base font-bold text-slate-900">Edit Patient Profile & Health Info</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Basic Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <User size={14} className="text-slate-500" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Default Home Visit Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">District / Zone</label>
                <select
                  value={districtZone}
                  onChange={(e) => setDistrictZone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                >
                  {DISTRICT_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Phone size={14} className="text-slate-500" /> Emergency Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  placeholder="e.g. Son, Spouse, Caregiver"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Heart size={14} className="text-slate-500" /> Medical Context & Alerts
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Known Drug / Latex Allergies
                  </label>
                  <input
                    type="text"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="Comma-separated: e.g. Penicillin, Sulfa"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Chronic Conditions / Diagnoses
                </label>
                <input
                  type="text"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  placeholder="Comma-separated: e.g. Hypertension, Diabetes, Knee Arthroplasty"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Medications
                </label>
                <input
                  type="text"
                  value={medicationsText}
                  onChange={(e) => setMedicationsText(e.target.value)}
                  placeholder="Comma-separated: e.g. Metformin 500mg, Lisinopril"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobility & Transfer Assistance Notes
                </label>
                <input
                  type="text"
                  value={mobilityNotes}
                  onChange={(e) => setMobilityNotes(e.target.value)}
                  placeholder="e.g. Uses walker, requires steady arm for stairs"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
