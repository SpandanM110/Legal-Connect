"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  MessageSquareIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import { getAdvocateByRegNo, getFeedbackForAdvocate, submitFeedback } from "@/lib/data-service"
import type { Advocate, UserFeedback } from "@/lib/types"
import { generateLegalResponse } from "@/lib/gemini"

export default function AdvocateProfilePage() {
  const params = useParams()
  const router = useRouter()
  const regNo = params.regNo as string

  const [advocate, setAdvocate] = useState<Advocate | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<UserFeedback[]>([])
  const [newFeedback, setNewFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [question, setQuestion] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [generatingResponse, setGeneratingResponse] = useState(false)

  useEffect(() => {
    async function fetchAdvocateData() {
      try {
        setLoading(true)
        const advocateData = getAdvocateByRegNo(regNo)

        if (advocateData) {
          setAdvocate(advocateData)

          // Fetch feedback for this advocate
          const feedbackData = await getFeedbackForAdvocate(regNo)
          setFeedback(feedbackData)
        } else {
          // Advocate not found, redirect to search
          router.push("/search")
        }
      } catch (error) {
        console.error("Error fetching advocate data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (regNo) {
      fetchAdvocateData()
    }
  }, [regNo, router])

  function calculateExperience(dateOfAppointment: string): string {
    const appointmentDate = new Date(dateOfAppointment)
    const currentDate = new Date()
    const years = currentDate.getFullYear() - appointmentDate.getFullYear()

    return years === 1 ? "1 year" : `${years} years`
  }

  function isCertificateValid(validUpto: string): boolean {
    const validDate = new Date(validUpto)
    const currentDate = new Date()
    return validDate > currentDate
  }

  async function handleSubmitFeedback() {
    if (!rating || !newFeedback) return

    try {
      setSubmittingFeedback(true)

      await submitFeedback({
        userId: "current-user-id", // In a real app, get from auth
        advocateRegNo: regNo,
        rating,
        comment: newFeedback,
        timestamp: new Date().toISOString(),
      })

      // Refresh feedback
      const updatedFeedback = await getFeedbackForAdvocate(regNo)
      setFeedback(updatedFeedback)

      // Reset form
      setNewFeedback("")
      setRating(0)
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setSubmittingFeedback(false)
    }
  }

  async function handleAskQuestion() {
    if (!question) return

    try {
      setGeneratingResponse(true)
      const response = await generateLegalResponse(question)
      setAiResponse(response)
    } catch (error) {
      console.error("Error generating response:", error)
      setAiResponse("Sorry, I was unable to generate a response at this time. Please try again later.")
    } finally {
      setGeneratingResponse(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-12">
        <div className="mb-6">
          <Link href="/search/results">
            <Button variant="ghost" className="gap-1">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Results
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ) : advocate ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{advocate.name}</CardTitle>
                    <CardDescription>Registration No: {advocate.regNo}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {advocate.areaOfPractice}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {advocate.address}, {advocate.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span>Experience: {calculateExperience(advocate.dateOfAppointment)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCertificateValid(advocate.certificateValidUpto) ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span>
                          Certificate Valid until {new Date(advocate.certificateValidUpto).toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-5 w-5 text-destructive" />
                        <span>
                          Certificate Expired on {new Date(advocate.certificateValidUpto).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  {advocate.rating !== undefined && (
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${i < advocate.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm ml-2">
                        {advocate.rating.toFixed(1)} ({advocate.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" className="gap-2">
                  <MailIcon className="h-4 w-4" />
                  Email
                </Button>
                <Button className="gap-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  Message
                </Button>
              </CardFooter>
            </Card>

            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="ask">Ask a Question</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {advocate.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Specialization</h3>
                        <p>{advocate.areaOfPractice}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Experience</h3>
                        <p>
                          {advocate.name} has been practicing law for {calculateExperience(advocate.dateOfAppointment)},
                          specializing in {advocate.areaOfPractice.toLowerCase()} cases.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Location</h3>
                        <p>
                          {advocate.address}, {advocate.district}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                    <CardDescription>See what others are saying about {advocate.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feedback.length > 0 ? (
                      <div className="space-y-4">
                        {feedback.map((item, index) => (
                          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                              <span className="text-sm ml-2">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm">{item.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
                    )}

                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium">Leave a Review</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-6 w-6 cursor-pointer ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                          />
                        ))}
                      </div>
                      <Textarea
                        placeholder="Share your experience with this advocate..."
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleSubmitFeedback} disabled={!rating || !newFeedback || submittingFeedback}>
                        Submit Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ask" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ask a Legal Question</CardTitle>
                    <CardDescription>Get general information about your legal issue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="What would you like to know about your legal situation?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleAskQuestion} disabled={!question || generatingResponse} className="w-full">
                        {generatingResponse ? "Generating Response..." : "Ask Question"}
                      </Button>

                      {aiResponse && (
                        <div className="mt-4 p-4 bg-muted rounded-md">
                          <h3 className="font-medium mb-2">Response:</h3>
                          <p className="text-sm whitespace-pre-line">{aiResponse}</p>
                          <p className="text-xs text-muted-foreground mt-4">
                            Note: This is general information only and not specific legal advice. For personalized
                            advice, please consult directly with {advocate.name}.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Advocate Not Found</CardTitle>
              <CardDescription>We couldn't find an advocate with the registration number {regNo}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The advocate you're looking for may not be registered in our system.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/search">Search for Advocates</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
