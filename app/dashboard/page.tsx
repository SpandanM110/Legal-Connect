"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserIcon, MessageSquareIcon, FileTextIcon, HistoryIcon, SearchIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import { getCurrentUser } from "@/lib/firebase"
import { getTopRatedAdvocates } from "@/lib/data-service"
import type { Advocate } from "@/lib/types"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [topAdvocates, setTopAdvocates] = useState<Advocate[]>([])
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = getCurrentUser()

        if (!currentUser) {
          // For demo purposes, we'll allow access without login
          // In a real app, you would redirect to login
          // router.push("/login")
          // return
        }

        setUser(currentUser)

        // Fetch top advocates
        const advocates = getTopRatedAdvocates(3)
        setTopAdvocates(advocates)
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <p>Loading dashboard...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your legal needs and connections</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">+0 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">+3 unread messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">1 upcoming this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
                <HistoryIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Property dispute, family law</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent interactions and case updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MessageSquareIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New message from Adv. Neha Kulkarni</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 4:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileTextIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Document uploaded: Property deed</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Consultation scheduled with Adv. Amit Patil</p>
                      <p className="text-xs text-muted-foreground">Next Monday at 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Top Rated Advocates</CardTitle>
                <CardDescription>Highly rated legal professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAdvocates.length > 0 ? (
                    topAdvocates.map((advocate) => (
                      <div key={advocate.regNo} className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-2">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{advocate.name}</p>
                            <p className="text-xs text-muted-foreground">{advocate.areaOfPractice}</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-3 w-3 ${i < (advocate.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/advocate/${advocate.regNo}`}>View</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No advocates found</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/search">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Find an Advocate
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
