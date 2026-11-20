"use client"

import * as React from "react"
import {
  ShieldCheck,
  Loader2,
  Sparkles,
  Building2,
  Briefcase,
  Layers,
  GraduationCap,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserRole } from "@/context/user-role-context"

interface AssessorActivationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const EVALUATION_TRACKS = [
  "Full-Stack Web Engineering",
  "Backend & Distributed Systems",
  "Frontend & UI Architecture",
  "Cloud Infrastructure & DevOps",
  "System Design & Scalability",
  "Data Engineering & Pipelines",
  "General Software Engineering",
]

const TARGET_LEVELS = [
  "All Levels (Flexible)",
  "Entry / Junior (0–2 years)",
  "Mid-Level (2–5 years)",
  "Senior / Lead (5+ years)",
  "Staff / Principal (8+ years)",
]

export function AssessorActivationModal({
  open,
  onOpenChange,
  onSuccess,
}: AssessorActivationModalProps) {
  const { activateAssessor } = useUserRole()

  // Mandatory fields (Required)
  const [organization, setOrganization] = React.useState("")
  const [title, setTitle] = React.useState("")

  // Optional fields
  const [evaluationTrack, setEvaluationTrack] = React.useState("")
  const [targetLevel, setTargetLevel] = React.useState("")
  const [websiteOrLinkedin, setWebsiteOrLinkedin] = React.useState("")
  const [bio, setBio] = React.useState("")

  // Toggle for optional advanced section
  const [showOptionalFields, setShowOptionalFields] = React.useState(true)

  const [agreed, setAgreed] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedOrg = organization.trim()
    const trimmedTitle = title.trim()

    // Validate 1st 2 mandatory fields
    if (!trimmedOrg) {
      setError("Organization or Team Name is required.")
      return
    }

    if (!trimmedTitle) {
      setError("Professional Role / Title is required.")
      return
    }

    if (!agreed) {
      setError("Please acknowledge the project management guidelines to proceed.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await activateAssessor({
        organization: trimmedOrg,
        title: trimmedTitle,
        evaluationTrack: evaluationTrack || undefined,
        targetLevel: targetLevel || undefined,
        websiteOrLinkedin: websiteOrLinkedin.trim() || undefined,
        bio: bio.trim() || undefined,
      })

      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate Assessor role. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-amber-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1 text-[11px]"
            >
              <ShieldCheck className="size-3" />
              <span>Assessor Onboarding</span>
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span>Activate Assessor Workspace</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Configure your Assessor profile to unlock interview project creation, custom expiration limits, and candidate assessment tools.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          {/* Section 1: Mandatory Fields */}
          <div className="space-y-3 p-3.5 rounded-lg border border-border bg-card/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Primary Information (Mandatory)
              </span>
              <span className="text-[10px] text-destructive font-medium">* Required</span>
            </div>

            {/* 1. Organization (Mandatory) */}
            <div className="space-y-1.5">
              <Label htmlFor="org-name" className="text-xs font-semibold flex items-center gap-1.5">
                <Building2 className="size-3.5 text-amber-500" />
                <span>Organization or Team Name</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-name"
                placeholder="e.g. Acme Corp, Stripe, Personal Lab, Freelance Mentor"
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value)
                  if (error) setError(null)
                }}
                className="h-9 text-xs"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* 2. Professional Role / Title (Mandatory) */}
            <div className="space-y-1.5">
              <Label htmlFor="assessor-title" className="text-xs font-semibold flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-amber-500" />
                <span>Professional Role / Title</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assessor-title"
                placeholder="e.g. Senior Backend Engineer, Tech Lead, Engineering Manager"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError(null)
                }}
                className="h-9 text-xs"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Section 2: Optional Extended Profile Fields */}
          <div className="space-y-3 p-3.5 rounded-lg border border-border bg-muted/20">
            <button
              type="button"
              onClick={() => setShowOptionalFields((prev) => !prev)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" />
                <span>Additional Assessor Profile (Optional)</span>
              </span>
              <span className="text-muted-foreground hover:text-foreground">
                {showOptionalFields ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </span>
            </button>

            {showOptionalFields && (
              <div className="space-y-3 pt-1">
                {/* 3. Primary Evaluation Track (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="evaluation-track" className="text-xs font-medium flex items-center gap-1.5">
                    <Layers className="size-3.5 text-muted-foreground" />
                    <span>Primary Evaluation Track</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Select value={evaluationTrack} onValueChange={(val) => setEvaluationTrack(val ?? "")} disabled={isSubmitting}>
                    <SelectTrigger id="evaluation-track" className="h-9 text-xs">
                      <SelectValue placeholder="Select primary engineering track" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVALUATION_TRACKS.map((track) => (
                        <SelectItem key={track} value={track} className="text-xs">
                          {track}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Target Candidate Seniority (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="target-level" className="text-xs font-medium flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-muted-foreground" />
                    <span>Candidate Target Seniority</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Select value={targetLevel} onValueChange={(val) => setTargetLevel(val ?? "")} disabled={isSubmitting}>
                    <SelectTrigger id="target-level" className="h-9 text-xs">
                      <SelectValue placeholder="Select target seniority level" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_LEVELS.map((level) => (
                        <SelectItem key={level} value={level} className="text-xs">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Organization Website or LinkedIn Profile (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="website-linkedin" className="text-xs font-medium flex items-center gap-1.5">
                    <Globe className="size-3.5 text-muted-foreground" />
                    <span>Organization Website or LinkedIn</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="website-linkedin"
                    placeholder="https://company.com or https://linkedin.com/in/..."
                    value={websiteOrLinkedin}
                    onChange={(e) => setWebsiteOrLinkedin(e.target.value)}
                    className="h-9 text-xs"
                    disabled={isSubmitting}
                  />
                </div>

                {/* 6. Assessor Bio / Note to Candidates (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="assessor-bio" className="text-xs font-medium flex items-center gap-1.5">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <span>Candidate Welcome Note / Evaluation Note</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="assessor-bio"
                    placeholder="Share any guidance or expectations for candidates taking your assessments (e.g. Focus on clean modular code and robust test coverage)..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="text-xs resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Policy Context Box */}
          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs space-y-1.5 text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300 text-[11px]">
              <Sparkles className="size-3.5" />
              <span>Assessor Capabilities</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Create public projects visible in Discover or private secret link projects</li>
              <li>Projects auto-expire in 7 to 30 days to keep environments ephemeral</li>
              <li>Dual-persona: You can switch back to Candidate anytime in 1 click</li>
            </ul>
          </div>

          {/* Acknowledgement Checkbox */}
          <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-border"
              disabled={isSubmitting}
            />
            <span>
              I understand assessor project guidelines and wish to activate my Assessor studio.
            </span>
          </label>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !organization.trim() || !title.trim() || !agreed}
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Activating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5" />
                  <span>Complete Registration & Switch</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
