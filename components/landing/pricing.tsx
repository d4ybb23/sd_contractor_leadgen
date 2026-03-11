import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out ContentReel",
    features: [
      "5 videos per month",
      "720p video quality",
      "Basic AI voices",
      "Standard stock media",
      "ContentReel watermark"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Creator",
    price: "$29",
    period: "/month",
    description: "For content creators and influencers",
    features: [
      "50 videos per month",
      "1080p HD quality",
      "All AI voices (100+)",
      "Premium stock media",
      "No watermark",
      "Brand customization",
      "Direct publishing"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Business",
    price: "$99",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Unlimited videos",
      "4K Ultra HD quality",
      "All AI voices + cloning",
      "Premium stock media",
      "No watermark",
      "Full brand kit",
      "API access",
      "Priority support",
      "Team collaboration"
    ],
    cta: "Contact Sales",
    popular: false
  }
]

export function LandingPricing() {
  return (
    <section id="pricing" className="border-t border-border/40 bg-muted/20 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent
            <span className="text-primary"> Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                plan.popular 
                  ? "border-primary bg-card shadow-xl shadow-primary/10" 
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4 pt-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "secondary"}
                  asChild
                >
                  <Link href="/auth/sign-up">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
