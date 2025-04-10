import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import advocatesData from "@/data/advocates.json"
import type { Advocate, AdvocateRecommendationResult, UserFeedback } from "./types"

// Function to get all advocates from JSON
export function getAllAdvocates(): Advocate[] {
  return advocatesData as Advocate[]
}

// Function to get advocate by registration number
export function getAdvocateByRegNo(regNo: string): Advocate | null {
  const advocates = getAllAdvocates()
  const advocate = advocates.find((adv) => adv.regNo === regNo)
  return advocate || null
}

// Function to get advocates by district
export function getAdvocatesByDistrict(district: string): Advocate[] {
  const advocates = getAllAdvocates()
  return advocates.filter((adv) => adv.district.toLowerCase() === district.toLowerCase())
}

// Function to get advocates by practice area
export function getAdvocatesByPracticeArea(practiceArea: string): Advocate[] {
  const advocates = getAllAdvocates()
  return advocates.filter((adv) => adv.areaOfPractice.toLowerCase().includes(practiceArea.toLowerCase()))
}

// Function to get advocates by both district and practice area
export function getAdvocatesByDistrictAndPractice(district: string, practiceArea: string): Advocate[] {
  const advocates = getAllAdvocates()
  return advocates.filter(
    (adv) =>
      adv.district.toLowerCase() === district.toLowerCase() &&
      adv.areaOfPractice.toLowerCase().includes(practiceArea.toLowerCase()),
  )
}

// Function to get top rated advocates
export function getTopRatedAdvocates(limit = 5): Advocate[] {
  const advocates = getAllAdvocates()

  // Add default rating if not present
  const advocatesWithRating = advocates.map((adv) => ({
    ...adv,
    rating: adv.rating || Math.floor(Math.random() * 3) + 3, // Random rating between 3-5 for demo
    reviewCount: adv.reviewCount || Math.floor(Math.random() * 10) + 1, // Random review count for demo
  }))

  // Sort by rating
  return advocatesWithRating.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit)
}

// Function to find nearby district
export function findNearbyDistrict(district: string): string | null {
  // This would typically use a geographic database or API
  // For demo purposes, we'll use a simple mapping
  const nearbyDistrictMap: Record<string, string> = {
    Pune: "Mumbai",
    Mumbai: "Thane",
    Delhi: "Gurgaon",
    Bangalore: "Mysore",
    Chennai: "Coimbatore",
    Hyderabad: "Secunderabad",
    Kolkata: "Howrah",
    Ahmedabad: "Gandhinagar",
    Jaipur: "Ajmer",
    Lucknow: "Kanpur",
  }

  return nearbyDistrictMap[district] || null
}

// Function to get advocate recommendations based on user query
export async function getAdvocateRecommendations(
  district: string,
  legalIssue: string,
): Promise<AdvocateRecommendationResult> {
  try {
    // First, get all advocates in the user's district
    const advocatesInDistrict = getAdvocatesByDistrict(district)

    // If no advocates found in the district, return empty result
    if (advocatesInDistrict.length === 0) {
      // Find nearby district
      const nearbyDistrict = findNearbyDistrict(district)
      return { advocates: [], nearbyDistrict }
    }

    // Determine practice area from legal issue (simplified for demo)
    const practiceArea = determinePracticeAreaFromIssue(legalIssue)

    // Filter advocates by practice area
    let matchedAdvocates = advocatesInDistrict.filter((advocate) =>
      advocate.areaOfPractice.toLowerCase().includes(practiceArea.toLowerCase()),
    )

    // If no matches by practice area, return all advocates in district
    if (matchedAdvocates.length === 0) {
      matchedAdvocates = advocatesInDistrict
    }

    // Filter out advocates with expired certificates
    const validAdvocates = matchedAdvocates.filter((advocate) => {
      const validUpto = new Date(advocate.certificateValidUpto)
      const today = new Date()
      return validUpto > today
    })

    // Sort by experience (date of appointment)
    validAdvocates.sort((a, b) => {
      const dateA = new Date(a.dateOfAppointment)
      const dateB = new Date(b.dateOfAppointment)
      return dateA.getTime() - dateB.getTime() // Earlier date = more experience
    })

    // Add ratings if not present (for demo purposes)
    const advocatesWithRatings = validAdvocates.map((adv) => ({
      ...adv,
      rating: adv.rating || Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
      reviewCount: adv.reviewCount || Math.floor(Math.random() * 10) + 1, // Random review count
    }))

    // Return top 3 advocates
    return {
      advocates: advocatesWithRatings.slice(0, 3),
      nearbyDistrict: null,
    }
  } catch (error) {
    console.error("Error getting advocate recommendations:", error)
    throw error
  }
}

// Simple function to determine practice area from legal issue
function determinePracticeAreaFromIssue(legalIssue: string): string {
  const legalIssueLC = legalIssue.toLowerCase()

  if (legalIssueLC.includes("property") || legalIssueLC.includes("land") || legalIssueLC.includes("real estate")) {
    return "Real Estate Law"
  } else if (
    legalIssueLC.includes("divorce") ||
    legalIssueLC.includes("custody") ||
    legalIssueLC.includes("marriage")
  ) {
    return "Family Law"
  } else if (legalIssueLC.includes("crime") || legalIssueLC.includes("theft") || legalIssueLC.includes("assault")) {
    return "Criminal Law"
  } else if (
    legalIssueLC.includes("company") ||
    legalIssueLC.includes("business") ||
    legalIssueLC.includes("contract")
  ) {
    return "Corporate Law"
  } else if (legalIssueLC.includes("injury") || legalIssueLC.includes("accident") || legalIssueLC.includes("damage")) {
    return "Personal Injury"
  } else if (legalIssueLC.includes("tax") || legalIssueLC.includes("income") || legalIssueLC.includes("revenue")) {
    return "Tax Law"
  } else if (legalIssueLC.includes("job") || legalIssueLC.includes("work") || legalIssueLC.includes("employment")) {
    return "Labor Law"
  } else {
    return "Civil Law" // Default
  }
}

// Firebase-based functions for user feedback
export async function submitFeedback(feedbackData: UserFeedback) {
  try {
    // Add feedback to collection
    const feedbackRef = await addDoc(collection(db, "feedback"), {
      ...feedbackData,
      timestamp: serverTimestamp(),
    })

    return feedbackRef.id
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw error
  }
}

export async function getFeedbackForAdvocate(advocateRegNo: string): Promise<UserFeedback[]> {
  try {
    const feedbackQuery = query(
      collection(db, "feedback"),
      where("advocateRegNo", "==", advocateRegNo),
      orderBy("timestamp", "desc"),
    )

    const feedbackSnapshot = await getDocs(feedbackQuery)

    if (feedbackSnapshot.empty) {
      // Return sample feedback for demo purposes
      return generateSampleFeedback(advocateRegNo)
    }

    return feedbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UserFeedback)
  } catch (error) {
    console.error("Error getting feedback for advocate:", error)
    // Return sample feedback as fallback
    return generateSampleFeedback(advocateRegNo)
  }
}

// Generate sample feedback for demo purposes
function generateSampleFeedback(advocateRegNo: string): UserFeedback[] {
  const sampleFeedback = [
    {
      userId: "user1",
      advocateRegNo,
      rating: 5,
      comment: "Excellent advocate! Very knowledgeable and helped me win my case.",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
      userId: "user2",
      advocateRegNo,
      rating: 4,
      comment: "Good communication and reasonable fees. Would recommend.",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
  ]

  return sampleFeedback
}

// Function to add a new advocate (for onboarding)
export async function onboardAdvocate(advocateData: Advocate): Promise<string> {
  try {
    // In a real app, this would add to Firebase
    // For demo, we'll just return success
    return advocateData.regNo
  } catch (error) {
    console.error("Error onboarding advocate:", error)
    throw error
  }
}
