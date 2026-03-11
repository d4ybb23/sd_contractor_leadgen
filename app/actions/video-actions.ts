"use server"

import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const ScriptSchema = z.object({
  title: z.string().describe("A catchy title for the video"),
  script: z.string().describe("The full video script with natural pauses marked by [PAUSE]"),
  scenes: z.array(z.object({
    text: z.string().describe("The narration text for this scene"),
    visualDescription: z.string().describe("Description of what should be shown visually"),
    duration: z.number().describe("Estimated duration in seconds"),
  })).describe("Array of scenes that make up the video"),
  hashtags: z.array(z.string()).describe("Relevant hashtags for social media"),
  estimatedDuration: z.number().describe("Total estimated video duration in seconds"),
})

export async function generateVideoScript(
  keyword: string,
  format: string,
  language: string
) {
  const formatInstructions = {
    "9:16": "short-form vertical video for TikTok, Instagram Reels, or YouTube Shorts (30-60 seconds)",
    "16:9": "long-form horizontal video for YouTube (2-5 minutes)",
    "1:1": "square video for Instagram feed or Facebook (1-2 minutes)",
  }[format] || "standard video"

  const result = await generateText({
    model: "openai/gpt-4o-mini",
    output: Output.object({ schema: ScriptSchema }),
    prompt: `Create an engaging video script about "${keyword}" for a ${formatInstructions}.

The script should be in ${language} language and optimized for:
- Hook: Start with an attention-grabbing opening
- Value: Provide useful, interesting, or entertaining content
- CTA: End with a clear call-to-action

Make the content engaging, conversational, and suitable for the target platform.
Include natural pacing with appropriate scene breaks.`,
  })

  return result.output
}

export async function createVideoProject(
  title: string,
  keyword: string,
  format: string,
  language: string,
  voice: string,
  script: string,
  scenes: Array<{ text: string; visualDescription: string; duration: number }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Create project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: title,
      description: `Video about ${keyword}`,
    })
    .select()
    .single()

  if (projectError) {
    throw new Error(`Failed to create project: ${projectError.message}`)
  }

  // Create video
  const { data: video, error: videoError } = await supabase
    .from("videos")
    .insert({
      user_id: user.id,
      project_id: project.id,
      title,
      script,
      format,
      language,
      voice,
      status: "processing",
      duration: scenes.reduce((acc, s) => acc + s.duration, 0).toString(),
    })
    .select()
    .single()

  if (videoError) {
    throw new Error(`Failed to create video: ${videoError.message}`)
  }

  // Create scenes
  const scenesData = scenes.map((scene, index) => ({
    video_id: video.id,
    order_index: index,
    text: scene.text,
    visual_description: scene.visualDescription,
    duration: scene.duration,
  }))

  const { error: scenesError } = await supabase
    .from("video_scenes")
    .insert(scenesData)

  if (scenesError) {
    throw new Error(`Failed to create scenes: ${scenesError.message}`)
  }

  // Simulate video processing (in production, this would trigger actual video generation)
  // Update status to completed after a delay
  setTimeout(async () => {
    const supabase = await createClient()
    await supabase
      .from("videos")
      .update({ status: "completed" })
      .eq("id", video.id)
  }, 5000)

  return { project, video }
}

export async function getUserVideos() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("videos")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`)
  }

  return data
}

export async function getUserProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, videos(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return data
}

export async function deleteVideo(videoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Delete scenes first (cascade should handle this, but being explicit)
  await supabase
    .from("video_scenes")
    .delete()
    .eq("video_id", videoId)

  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", videoId)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`)
  }

  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`)
  }

  return { success: true }
}
