import Link from "next/link"
import { LandmarkIcon as LawIcon, SearchIcon, UserPlusIcon, MessageSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <LawIcon className="h-6 w-6" />
            <span>LegalConnect</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find the Right Legal Advocate for Your Needs
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with qualified advocates based on your location and legal requirements. Our AI-powered system
                  matches you with the best legal professionals.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/search">
                    <Button className="gap-1">
                      <SearchIcon className="h-4 w-4" />
                      Find an Advocate
                    </Button>
                  </Link>
                  <Link href="/onboard">
                    <Button variant="outline" className="gap-1">
                      <UserPlusIcon className="h-4 w-4" />
                      Register as an Advocate
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="rounded-lg border bg-card p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <MessageSquareIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">Legal Assistant</p>
                        <p className="text-sm text-gray-500">How can I help with your legal needs today?</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">I need someone for property dispute resolution in Pune.</p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3">
                        <p className="text-sm">✅ Found 2 top advocates in Pune who specialize in Civil Law:</p>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="grid gap-1">
                            <p className="font-medium">Adv. Neha Kulkarni</p>
                            <p>🧑‍⚖️ Area: Civil Law</p>
                            <p>📍 District: Pune</p>
                          </li>
                          <li className="grid gap-1">
                            <p className="font-medium">Adv. Amit Patil</p>
                            <p>🧑‍⚖️ Area: Real Estate & Civil</p>
                            <p>📍 District: Pune</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform makes finding legal help simple and efficient
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <SearchIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Describe Your Issue</h3>
                  <p className="text-gray-500">
                    Share your location and legal problem to get personalized recommendations.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <LawIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Get Matched</h3>
                  <p className="text-gray-500">
                    Our AI matches you with qualified advocates in your area with relevant expertise.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <MessageSquareIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Connect & Resolve</h3>
                  <p className="text-gray-500">Connect with your chosen advocate and get the legal help you need.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 px-4 md:flex-row md:items-center md:gap-8 md:px-6">
          <div className="flex items-center gap-2">
            <LawIcon className="h-5 w-5" />
            <span className="text-sm font-semibold">LegalConnect</span>
          </div>
          <nav className="flex gap-4 md:ml-auto md:gap-6">
            <Link href="#" className="text-sm underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm underline-offset-4 hover:underline">
              Contact
            </Link>
          </nav>
          <p className="text-sm text-gray-500 md:ml-auto md:mr-4">© 2025 LegalConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
