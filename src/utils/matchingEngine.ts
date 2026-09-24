import { NurseProfile, ServiceRequest, NurseMatchScore } from '../types';

/**
 * Intelligent Nurse Matching System
 * Evaluates verified nurses against patient request parameters:
 * - Verification status (strictly verified only)
 * - Geographic proximity / working zones
 * - Clinical expertise alignment
 * - On-duty availability status
 * - Clinical experience & verified rating
 */
export function calculateNurseMatchScores(
  request: ServiceRequest,
  nurses: NurseProfile[]
): NurseMatchScore[] {
  // Only nurses with 'verified' status are eligible for assignment
  const verifiedNurses = nurses.filter((n) => n.verificationStatus === 'verified');

  const scoredList: NurseMatchScore[] = verifiedNurses.map((nurse) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Expertise Match (35 points max)
    const expertiseMatch = nurse.areasOfExpertise.includes(request.serviceType);
    if (expertiseMatch) {
      score += 35;
      reasons.push('Specialized expertise in requested service');
    } else {
      // Partial credit for basic nursing or general qualifications
      if (nurse.qualification.toLowerCase().includes('b.sc') || nurse.qualification.toLowerCase().includes('practitioner')) {
        score += 15;
        reasons.push('Advanced registered nursing qualification');
      }
    }

    // 2. Location / District Zone Match (30 points max)
    const locationMatch = nurse.preferredWorkingAreas.some(
      (zone) => zone.toLowerCase() === request.locationDistrictZone.toLowerCase()
    );
    if (locationMatch) {
      score += 30;
      reasons.push(`Covers target zone: ${request.locationDistrictZone}`);
    } else {
      reasons.push(`Operates in nearby zones`);
      score += 10;
    }

    // 3. Availability & Active On-Duty (20 points max)
    const availabilityMatch = nurse.availability.isActiveOnDuty;
    if (availabilityMatch) {
      score += 20;
      reasons.push('Currently active & available on-duty');
    } else {
      score += 5;
      reasons.push('Scheduled on-call');
    }

    // 4. Clinical Experience (10 points max)
    const expPoints = Math.min(10, Math.round(nurse.yearsOfExperience * 1.5));
    score += expPoints;
    if (nurse.yearsOfExperience >= 5) {
      reasons.push(`${nurse.yearsOfExperience}+ years clinical experience`);
    }

    // 5. Patient Rating & Reliability Bonus (5 points max)
    if (nurse.rating >= 4.8) {
      score += 5;
      reasons.push(`Top-rated clinician (${nurse.rating.toFixed(1)} ★)`);
    } else if (nurse.rating > 4.0) {
      score += 3;
    }

    // Cap score at 100
    const finalScore = Math.min(100, score);

    return {
      nurse,
      score: finalScore,
      breakdown: {
        locationMatch,
        expertiseMatch,
        availabilityMatch,
        experienceScore: expPoints,
      },
      reasons,
    };
  });

  // Sort descending by score
  return scoredList.sort((a, b) => b.score - a.score);
}
