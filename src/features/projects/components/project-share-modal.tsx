"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Share2,
  Mail,
  Globe,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Ban,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { inviteService } from "@/services/invites/invite.service"
import type { Project } from "@/services/projects/project.types"
import type { InviteStatus } from "@/types/invite.types"
import { cn } from "@/lib/utils"

interface ProjectShareModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getStatusBadge(status: InviteStatus) {
  switch (status) {
    case "sent":
      return <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500 bg-blue-500/10">Sent</Badge>
    case "opened":
      return <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-500 bg-purple-500/10">Opened</Badge>
    case "accepted":
      return <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10">Accepted</Badge>
    case "in_progress":
      return <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">In Progress</Badge>
    case "completed":
      return <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500 bg-green-500/10">Completed</Badge>
    case "expired":
      return <Badge variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground">Expired</Badge>
    case "revoked":
      return <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive bg-destructive/10">Revoked</Badge>
  }
}

export function ProjectShareModal({
  project,
  open,
  onOpenChange,
}: ProjectShareModalProps) {
  const queryClient = useQueryClient()
  const isPublic = project?.visibility === "public"

  const [activeTab, setActiveTab] = React.useState<string>("email")
  const [emailsInput, setEmailsInput] = React.useState("")
  const [messageInput, setMessageInput] = React.useState("")
  const [expiryDays, setExpiryDays] = React.useState(7)
  const [maxCandidates, setMaxCandidates] = React.useState(50)

  const [copiedLink, setCopiedLink] = React.useState<string | null>(null)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [lastCreatedToken, setLastCreatedToken] = React.useState<string | null>(null)

  // Fetch invites for this project
  const { data: invites = [], isLoading: isLoadingInvites } = useQuery({
    queryKey: ["project-invites", project?.id],
    queryFn: () => (project?.id ? inviteService.listProjectInvites(project.id) : Promise.resolve([])),
    enabled: Boolean(open && project?.id),
  })

  // Send email invites mutation
  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      if (!project?.id) return []
      const rawList = emailsInput
        .split(/[\n,;]+/)
        .map((e) => e.trim())
        .filter(Boolean)

      if (rawList.length === 0) {
        throw new Error("Please enter at least one candidate email address.")
      }

      return inviteService.sendEmailInvites(
        project.id,
        rawList,
        messageInput.trim() || undefined,
        expiryDays
      )
    },
    onSuccess: (data) => {
      setEmailsInput("")
      setMessageInput("")
      setErrorMsg(null)
      if (data && data.length > 0 && data[0].rawToken) {
        setLastCreatedToken(data[0].rawToken)
      }
      queryClient.invalidateQueries({ queryKey: ["project-invites", project?.id] })
    },
    onError: (err) => {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send email invites.")
    },
  })

  // Public link mutation (create or rotate)
  const publicLinkMutation = useMutation({
    mutationFn: async () => {
      if (!project?.id) throw new Error("No project selected")
      return inviteService.createOrRotatePublicLink(project.id, maxCandidates, expiryDays)
    },
    onSuccess: (data) => {
      setErrorMsg(null)
      if (data.rawToken) {
        setLastCreatedToken(data.rawToken)
      }
      queryClient.invalidateQueries({ queryKey: ["project-invites", project?.id] })
    },
    onError: (err) => {
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate public link.")
    },
  })

  // Disable public link mutation
  const disablePublicLinkMutation = useMutation({
    mutationFn: async () => {
      if (!project?.id) throw new Error("No project selected")
      return inviteService.disablePublicLink(project.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-invites", project?.id] })
    },
  })

  // Revoke invite mutation
  const revokeMutation = useMutation({
    mutationFn: async (inviteId: string) => inviteService.revokeInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-invites", project?.id] })
    },
  })

  // Resend invite mutation
  const resendMutation = useMutation({
    mutationFn: async (inviteId: string) => inviteService.resendInvite(inviteId),
    onSuccess: (data) => {
      if (data.rawToken) {
        setLastCreatedToken(data.rawToken)
      }
      queryClient.invalidateQueries({ queryKey: ["project-invites", project?.id] })
    },
  })

  const handleCopy = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(key)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch {
      // Fallback
    }
  }

  if (!project) return null

  // Check if an active public link already exists in invites
  const activePublicInvite = invites.find(
    (inv) => inv.type === "public_link" && inv.status !== "revoked"
  )

  const activeToken = lastCreatedToken || activePublicInvite?.rawToken
  const publicShareUrl = activeToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${activeToken}`
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] gap-1 py-0 px-2 font-semibold",
                isPublic
                  ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
              )}
            >
              {isPublic ? (
                <>
                  <Globe className="size-3" />
                  <span>Public Project</span>
                </>
              ) : (
                <>
                  <Lock className="size-3" />
                  <span>Private Project</span>
                </>
              )}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span>Share & Invitations: {project.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isPublic
              ? "Distribute access via email invites or manage open public candidate links."
              : "Private projects are strictly email-bound. Only specified candidate emails can access this assessment."}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-2.5 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Selection: Public has Email + Public Link; Private has Email Only */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val ?? "email")}>
          {isPublic ? (
            <TabsList className="grid grid-cols-2 w-full mb-3">
              <TabsTrigger value="email" className="text-xs gap-1.5 cursor-pointer">
                <Mail className="size-3.5" />
                <span>Invite by Email</span>
              </TabsTrigger>
              <TabsTrigger value="public-link" className="text-xs gap-1.5 cursor-pointer">
                <Globe className="size-3.5" />
                <span>Public Share Link</span>
              </TabsTrigger>
            </TabsList>
          ) : (
            <div className="mb-3 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Confidential Private Flow:</strong> Public links are disabled. Candidates must receive an email-bound single-use token.
              </span>
            </div>
          )}

          {/* TAB 1: Invite by Email */}
          <TabsContent value="email" className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="candidate-emails" className="text-xs font-semibold">
                Candidate Emails *
              </Label>
              <Textarea
                id="candidate-emails"
                placeholder="candidate1@example.com, candidate2@company.org (comma or newline separated)"
                rows={2}
                value={emailsInput}
                onChange={(e) => setEmailsInput(e.target.value)}
                className="text-xs resize-none"
                disabled={sendEmailMutation.isPending}
              />
              <p className="text-[11px] text-muted-foreground">
                Each candidate receives a distinct, single-use access link bound to their email.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invite-message" className="text-xs font-medium">
                Personalized Note / Instructions (Optional)
              </Label>
              <Input
                id="invite-message"
                placeholder="e.g. Please complete the assessment before Friday 5 PM."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="h-8 text-xs"
                disabled={sendEmailMutation.isPending}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span>Link validity: <strong>{expiryDays} days</strong></span>
              </div>

              <Button
                size="sm"
                onClick={() => sendEmailMutation.mutate()}
                disabled={sendEmailMutation.isPending || !emailsInput.trim()}
                className="text-xs gap-1.5 font-semibold bg-primary text-primary-foreground"
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Sending Invites...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Send Invites</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: Public Link (Public Projects Only) */}
          {isPublic && (
            <TabsContent value="public-link" className="space-y-3.5">
              <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">Universal Candidate Link</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Anyone with this link can register or sign in and review the project.
                    </p>
                  </div>
                  {activePublicInvite ? (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 text-[10px]">
                      Active Link
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      Unpublished
                    </Badge>
                  )}
                </div>

                {/* Copy Link Input Row */}
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={publicShareUrl || "No active public link. Click 'Generate Link' below."}
                    placeholder="No active public link"
                    className={cn(
                      "text-xs h-9 font-mono",
                      publicShareUrl ? "bg-muted/40 text-foreground" : "bg-muted/20 text-muted-foreground italic"
                    )}
                  />
                  <Button
                    size="sm"
                    className="h-9 px-3 gap-1.5 text-xs font-semibold shrink-0"
                    onClick={() => publicShareUrl && handleCopy(publicShareUrl, "public-link")}
                    disabled={!publicShareUrl}
                  >
                    {copiedLink === "public-link" ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Candidate Limits & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Expires:</span>
                      <Input
                        type="number"
                        min={1}
                        max={90}
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(Math.max(1, Number(e.target.value) || 1))}
                        className="w-14 h-7 text-xs text-center"
                      />
                      <span className="text-muted-foreground text-[11px]">days</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Max Uses:</span>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        value={maxCandidates}
                        onChange={(e) => setMaxCandidates(Math.max(1, Number(e.target.value) || 1))}
                        className="w-14 h-7 text-xs text-center"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activePublicInvite && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disablePublicLinkMutation.mutate()}
                        disabled={disablePublicLinkMutation.isPending}
                        className="h-7 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                      >
                        <Ban className="size-3 mr-1" />
                        Disable Link
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => publicLinkMutation.mutate()}
                      disabled={publicLinkMutation.isPending}
                      className="h-7 text-xs gap-1"
                    >
                      <RefreshCw className={cn("size-3", publicLinkMutation.isPending && "animate-spin")} />
                      <span>{activePublicInvite ? "Rotate Token" : "Generate Link"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Section 4: Invite List (Audit Trail & Status Table) */}
        <div className="mt-4 pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Share2 className="size-3 text-primary" />
              <span>Invite Activity & Candidate Statuses ({invites.length})</span>
            </h4>
            <span className="text-[10px] text-muted-foreground">
              Sent → Opened → Accepted → In Progress → Completed
            </span>
          </div>

          {isLoadingInvites ? (
            <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Loading invites...</span>
            </div>
          ) : invites.length === 0 ? (
            <div className="p-4 text-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
              No invites have been dispatched for this project yet.
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-medium text-[11px]">
                  <tr>
                    <th className="text-left py-2 px-3">Candidate / Link</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Sent Date</th>
                    <th className="text-right py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invites.map((inv) => {
                    const isRevoked = inv.status === "revoked"
                    const sentDate = new Date(inv.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })

                    const inviteToken = inv.rawToken || (inv.id === activePublicInvite?.id ? activeToken : undefined)
                    const inviteUrl = inviteToken
                      ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteToken}`
                      : ""

                    return (
                      <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2 px-3 font-medium truncate max-w-[160px]">
                          {inv.type === "email" ? (
                            <span>{inv.email}</span>
                          ) : (
                            <span className="font-mono text-muted-foreground">Universal Public Link</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-[11px] text-muted-foreground capitalize">
                          {inv.type === "email" ? "Email" : "Public"}
                        </td>
                        <td className="py-2 px-2">{getStatusBadge(inv.status)}</td>
                        <td className="py-2 px-2 text-muted-foreground text-[11px]">{sentDate}</td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copy Link */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              onClick={() => inviteUrl && handleCopy(inviteUrl, inv.id)}
                              disabled={isRevoked || !inviteUrl}
                              title={
                                isRevoked
                                  ? "This invite link has been revoked"
                                  : !inviteUrl
                                  ? "No token available"
                                  : "Copy candidate invite URL"
                              }
                            >
                              {copiedLink === inv.id ? (
                                <Check className="size-3 text-emerald-400" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </Button>

                            {/* Resend (Email only) */}
                            {inv.type === "email" && !isRevoked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-[10px]"
                                onClick={() => resendMutation.mutate(inv.id)}
                                disabled={resendMutation.isPending}
                                title="Resend fresh invite"
                              >
                                <RefreshCw className={cn("size-2.5 mr-0.5", resendMutation.isPending && "animate-spin")} />
                                <span>Resend</span>
                              </Button>
                            )}

                            {/* Revoke */}
                            {!isRevoked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-[10px] text-destructive hover:bg-destructive/10"
                                onClick={() => revokeMutation.mutate(inv.id)}
                                disabled={revokeMutation.isPending}
                                title="Revoke access"
                              >
                                <span>Revoke</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
