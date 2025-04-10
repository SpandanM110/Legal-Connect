import Link from "next/link"
import { LandmarkIcon as LawIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LawIcon className="h-6 w-6" />
          <span>LegalConnect</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link href="/search">
            <Button variant="ghost">Find an Advocate</Button>
          </Link>
          <Link href="/onboard">
            <Button variant="ghost">Register as Advocate</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
