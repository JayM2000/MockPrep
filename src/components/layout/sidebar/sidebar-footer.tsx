export function SidebarFooter() {
  return (
    <div className="shrink-0 mt-auto p-4 border-t border-sidebar-border text-xs text-muted-foreground bg-sidebar">
      <div className="flex items-center justify-between">
        <span>Engine v1.0</span>
        <span
          className="inline-block size-2 rounded-full bg-emerald-500"
          title="System Operational"
          aria-label="System Operational"
        />
      </div>
    </div>
  )
}
