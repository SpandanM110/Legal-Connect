"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPinIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import { getAdvocateRecommendations } from "@/lib/data-service"
import type { Advocate } from "@/lib/types"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const district = searchParams.get("district")
  const issue = searchParams.get("issue")

  const [loading, setLoading] = useState(true)
  const [advocates, setAdvocates] = useState<Advocate[]>([])
  const [noResults, setNoResults] = useState(false)
  const [nearbyDistrict, setNearbyDistrict] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      if (!district || !issue) return

      try {
        setLoading(true)
        const results = await getAdvocateRecommendations(district, issue)

        if (results.advocates.length === 0) {
          setNoResults(true)
          setNearbyDistrict(results.nearbyDistrict)
        } else {
          setAdvocates(results.advocates)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [district, issue])

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-12">
        <div className="mb-6">
          <Link href="/search">
            <Button variant="ghost" className="gap-1">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Advocate Recommendations</h1>
            <p className="text-muted-foreground">
              {district && issue ? (
                <>
                  Based on your search for help with <span className="font-medium">{issue}</span> in{" "}
                  <span className="font-medium">{district}</span>
                </>
              ) : (
                "Based on your search"
              )}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : noResults ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircleIcon className="h-5 w-5 text-destructive" />
                  No Advocates Found
                </CardTitle>
                <CardDescription>
                  We couldn't find any advocates in {district} who specialize in this type of case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyDistrict ? (
                    <p>
                      The closest match is in <span className="font-medium">{nearbyDistrict}</span> district. Would you
                      like to see advocates from there instead?
                    </p>
                  ) : (
                    <p>We don't have any advocates in nearby districts either who specialize in this area.</p>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {nearbyDistrict && (
                      <Link href={`/search/results?district=${nearbyDistrict}&issue=${issue}`}>
                        <Button>View Advocates in {nearbyDistrict}</Button>
                      </Link>
                    )}
                    <Link href="/onboard">
                      <Button variant={nearbyDistrict ? "outline" : "default"}>Suggest an Advocate</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {advocates.map((advocate) => (
                <Card key={advocate.regNo}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{advocate.name}</CardTitle>
                        <CardDescription>Registration No: {advocate.regNo}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          advocate.areaOfPractice.toLowerCase().includes(issue?.toLowerCase().split(" ")[0] || "")
                            ? "default"
                            : "outline"
                        }
                      >
                        {advocate.areaOfPractice}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {advocate.address}, {advocate.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Experience: {calculateExperience(advocate.dateOfAppointment)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {isCertificateValid(advocate.certificateValidUpto) ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span>
                              Certificate Valid until {new Date(advocate.certificateValidUpto).toLocaleDateString()}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 text-destructive" />
                            <span>
                              Certificate Expired on {new Date(advocate.certificateValidUpto).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      {advocate.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < advocate.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="text-sm ml-1">({advocate.reviewCount || 0} reviews)</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/advocate/${advocate.regNo}`}>View Profile</Link>
                    </Button>
                    <Button>Contact</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
