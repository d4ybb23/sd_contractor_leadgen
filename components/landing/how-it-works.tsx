import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: "01",
    title: "Enter Your Keyword",
    description: "Simply type a keyword or topic, and select your preferred video format and language."
  },
  {
    number: "02",
    title: "AI Generates Content",
    description: "Our AI creates a compelling script, selects matching visuals, and generates a professional voiceover."
  },
  {
    number: "03",
    title: "Customize & Edit",
    description: "Fine-tune your video with our editor. Adjust scenes, swap media, edit text, or add your branding."
  },
  {
    number: "04",
    title: "Publish Everywhere",
    description: "Export your video or publish directly to YouTube, TikTok, Instagram, and other platforms."
  }
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/40 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From Keyword to Video
            <span className="text-primary"> in Minutes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our streamlined process makes video creation faster and easier than ever before.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10" />
                  <span className="text-3xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
