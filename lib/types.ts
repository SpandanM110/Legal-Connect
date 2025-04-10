export interface Advocate {
  regNo: string
  name: string
  address: string
  areaOfPractice: string
  dateOfAppointment: string
  certificateValidUpto: string
  district: string
  rating?: number
  reviewCount?: number
}

export interface AdvocateRecommendationResult {
  advocates: Advocate[]
  nearbyDistrict: string | null
}

export interface UserFeedback {
  userId: string
  advocateRegNo: string
  rating: number
  comment: string
  timestamp: string
}
