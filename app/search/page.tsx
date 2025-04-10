"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SearchIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { districts } from "@/lib/constants"
import Header from "@/components/header"

const formSchema = z.object({
  district: z.string().min(1, { message: "Please select your district" }),
  legalIssue: z.string().min(10, { message: "Please describe your legal issue in at least 10 characters" }),
})

export default function SearchPage() {
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      district: "",
      legalIssue: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSearching(true)

    // Encode the form values to pass as URL parameters
    const params = new URLSearchParams({
      district: values.district,
      issue: values.legalIssue,
    })

    // Navigate to results page with the search parameters
    setTimeout(() => {
      router.push(`/search/results?${params.toString()}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-12">
        <div className="grid gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Find an Advocate</h1>
            <p className="text-muted-foreground">
              Tell us about your legal issue and location to get matched with the right advocate
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Search for Legal Help</CardTitle>
              <CardDescription>
                Our AI will match you with advocates who specialize in your type of case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your District</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>We'll find advocates in or near this location</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalIssue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe Your Legal Issue</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="E.g., I need help with a property dispute involving my neighbor's encroachment on my land..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details to help us match you with the right specialist
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Finding Advocates...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Find Advocates
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
