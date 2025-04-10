"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2Icon, CheckCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { districts, practiceAreas } from "@/lib/constants"
import Header from "@/components/header"
import { onboardAdvocate } from "@/lib/firebase"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  regNo: z.string().min(5, { message: "Registration number is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  district: z.string().min(1, { message: "Please select your district" }),
  areaOfPractice: z.string().min(1, { message: "Please select your area of practice" }),
  dateOfAppointment: z.string().min(1, { message: "Date of appointment is required" }),
  certificateValidUpto: z.string().min(1, { message: "Certificate validity date is required" }),
})

export default function OnboardPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      regNo: "",
      address: "",
      district: "",
      areaOfPractice: "",
      dateOfAppointment: "",
      certificateValidUpto: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      await onboardAdvocate({
        ...values,
        dateOfAppointment: new Date(values.dateOfAppointment).toISOString(),
        certificateValidUpto: new Date(values.certificateValidUpto).toISOString(),
      })

      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error("Error onboarding advocate:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-12">
        <div className="grid gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Register as an Advocate</h1>
            <p className="text-muted-foreground">Join our platform to connect with clients seeking legal assistance</p>
          </div>

          {isSuccess ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  Registration Successful
                </CardTitle>
                <CardDescription>Your profile has been submitted for verification</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Thank you for registering with LegalConnect. Our team will review your information and activate your
                  profile shortly. You will receive an email notification once your profile is live.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setIsSuccess(false)} className="w-full">
                  Register Another Advocate
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Advocate Registration Form</CardTitle>
                <CardDescription>Please provide your professional details to create your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Adv. John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="regNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="BAR12345" {...field} />
                          </FormControl>
                          <FormDescription>Your official bar council registration number</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Law Street, City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select district" />
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="areaOfPractice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area of Practice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {practiceAreas.map((area) => (
                                  <SelectItem key={area} value={area}>
                                    {area}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="dateOfAppointment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Appointment</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>When you were officially appointed as an advocate</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="certificateValidUpto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificate Valid Until</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>Expiration date of your practice certificate</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Register as an Advocate"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
