"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { 
  Sparkles, 
  Wand2, 
  Mic, 
  Image as ImageIcon, 
  Film,
  ArrowRight,
  RefreshCw,
  CheckCircle2
} from "lucide-react"
import { generateVideoScript, createVideoProject } from "@/app/actions/video-actions"
import Link from "next/link"

const voices = [
  { id: "alloy", name: "Alloy", description: "Neutral & Balanced" },
  { id: "echo", name: "Echo", description: "Deep & Calm" },
  { id: "fable", name: "Fable", description: "Warm & Friendly" },
  { id: "onyx", name: "Onyx", description: "Authoritative" },
  { id: "nova", name: "Nova", description: "Energetic & Youthful" },
  { id: "shimmer", name: "Shimmer", description: "Soft & Elegant" },
]

const formats = [
  { id: "9:16", name: "Vertical (9:16)", description: "TikTok, Reels, Shorts" },
  { id: "16:9", name: "Horizontal (16:9)", description: "YouTube, Facebook" },
  { id: "1:1", name: "Square (1:1)", description: "Instagram Feed" },
]

const languages = [
  { id: "English", name: "English" },
  { id: "Spanish", name: "Spanish" },
  { id: "French", name: "French" },
  { id: "German", name: "German" },
  { id: "Portuguese", name: "Portuguese" },
  { id: "Italian", name: "Italian" },
  { id: "Japanese", name: "Japanese" },
  { id: "Korean", name: "Korean" },
  { id: "Chinese", name: "Chinese" },
  { id: "Arabic", name: "Arabic" },
]

interface Scene {
  text: string
  visualDescription: string
  duration: number
}

interface VideoData {
  title: string
  script: string
  scenes: Scene[]
  hashtags: string[]
  estimatedDuration: number
}

export default function CreateVideoPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [format, setFormat] = useState("9:16")
  const [language, setLanguage] = useState("English")
  const [voice, setVoice] = useState("alloy")
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [editedScript, setEditedScript] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateScript = async () => {
    if (!keyword.trim()) return
    setGenerating(true)
    setError(null)
    
    try {
      const result = await generateVideoScript(keyword, format, language)
      if (result) {
        setVideoData(result)
        setEditedScript(result.script)
        setStep(2)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate script")
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateVideo = async () => {
    if (!videoData) return
    setGenerating(true)
    setError(null)
    
    try {
      await createVideoProject(
        videoData.title,
        keyword,
        format,
        language,
        voice,
        editedScript,
        videoData.scenes
      )
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Video</h1>
        <p className="mt-1 text-muted-foreground">Generate AI-powered videos from just a keyword</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[
          { num: 1, label: "Setup" },
          { num: 2, label: "Script" },
          { num: 3, label: "Scenes" },
          { num: 4, label: "Complete" },
        ].map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
              </div>
              <span className="mt-2 text-xs text-muted-foreground">{s.label}</span>
            </div>
            {i < 3 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  step > s.num ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Step 1: Setup */}
      {step === 1 && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Video Setup
            </CardTitle>
            <CardDescription>Enter your keyword and configure video settings</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="keyword">Keyword or Topic</FieldLabel>
                <Input
                  id="keyword"
                  placeholder="e.g., How to make money online, Best travel destinations..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Our AI will generate a complete video script based on this keyword
                </p>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Video Format</FieldLabel>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          <div className="flex flex-col">
                            <span>{f.name}</span>
                            <span className="text-xs text-muted-foreground">{f.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Language</FieldLabel>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>AI Voice</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-3">
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoice(v.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        voice === v.id
                          ? "border-primary bg-primary/10"
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mic className={`h-4 w-4 ${voice === v.id ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium text-foreground">{v.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{v.description}</p>
                    </button>
                  ))}
                </div>
              </Field>
            </FieldGroup>

            <Button
              onClick={handleGenerateScript}
              disabled={!keyword.trim() || generating}
              className="mt-6 w-full gap-2"
            >
              {generating ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Generating Script with AI...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Script with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Script */}
      {step === 2 && videoData && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Wand2 className="h-5 w-5 text-primary" />
                  {videoData.title}
                </CardTitle>
                <CardDescription>Review and edit your video script</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Generated
                </Badge>
                <Badge variant="outline">~{videoData.estimatedDuration}s</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Field>
              <Textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </Field>

            <div className="mt-4 flex flex-wrap gap-2">
              {videoData.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                onClick={handleGenerateScript}
                disabled={generating}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 gap-2"
              >
                Continue to Scenes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Scenes */}
      {step === 3 && videoData && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ImageIcon className="h-5 w-5 text-primary" />
              Video Scenes
            </CardTitle>
            <CardDescription>Review your video scenes and visuals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videoData.scenes.map((scene, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-lg border border-border/50 p-4"
                >
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
                      index % 2 === 0 ? "from-primary/20 to-accent/20" : "from-accent/20 to-primary/20"
                    }`}
                  >
                    <Film className="h-8 w-8 text-primary/50" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">Scene {index + 1}</Badge>
                      <Badge variant="outline">{scene.duration}s</Badge>
                    </div>
                    <p className="text-sm text-foreground">{scene.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{scene.visualDescription}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back to Script
              </Button>
              <Button
                onClick={handleCreateVideo}
                disabled={generating}
                className="flex-1 gap-2"
              >
                {generating ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Creating Video...
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4" />
                    Create Video
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <Card className="border-border/50 bg-card">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Video Created!</h2>
            <p className="mt-2 text-muted-foreground">
              Your video has been generated successfully and saved to your library.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" asChild>
                <Link href="/dashboard/videos">View My Videos</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => {
                setStep(1)
                setKeyword("")
                setVideoData(null)
                setEditedScript("")
                setError(null)
              }}
            >
              Create Another Video
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
