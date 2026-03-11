import { 
  Wand2, 
  Mic, 
  ImageIcon, 
  Layers, 
  Share2, 
  Globe,
  Sparkles,
  FileText,
  Video
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Wand2,
    title: "AI Script Generation",
    description: "Enter a keyword and our AI creates engaging, SEO-optimized video scripts in seconds."
  },
  {
    icon: Mic,
    title: "AI Voiceovers",
    description: "Choose from 100+ realistic AI voices in 50+ languages with natural intonation."
  },
  {
    icon: ImageIcon,
    title: "Stock Media Library",
    description: "Access millions of royalty-free images, video clips, and music tracks."
  },
  {
    icon: Layers,
    title: "Multiple Formats",
    description: "Create vertical (9:16), horizontal (16:9), and square (1:1) videos for any platform."
  },
  {
    icon: Video,
    title: "Video Editor",
    description: "Fine-tune your videos with our intuitive drag-and-drop editor and timeline."
  },
  {
    icon: Share2,
    title: "Direct Publishing",
    description: "Publish directly to YouTube, TikTok, Instagram, Facebook, and more."
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Create content in 50+ languages to reach a global audience effortlessly."
  },
  {
    icon: FileText,
    title: "Captions & Subtitles",
    description: "Auto-generate accurate captions and subtitles for better accessibility."
  },
  {
    icon: Sparkles,
    title: "Brand Customization",
    description: "Add your logo, colors, fonts, and intro/outro for consistent branding."
  }
]

export function LandingFeatures() {
  return (
    <section id="features" className="border-t border-border/40 bg-muted/20 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Create
            <span className="text-primary"> Viral Videos</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered platform handles every aspect of video creation so you can focus on growing your audience.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
