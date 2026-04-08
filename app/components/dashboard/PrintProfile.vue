<script lang="ts" setup>
/**
 * Student Profile Print Wrapper
 *
 * This component reuses DashboardDisplayProfile but applies strict
 * A4 styling and color overrides for professional printing.
 */

const printProfile = () => {
  window.print()
}

// Expose the print trigger for parent components
defineExpose({
  printProfile
})
</script>

<template>
  <!-- Force light mode for print layout -->
  <div class="print-profile-wrapper light">
    <DashboardDisplayProfile />
  </div>
</template>

<style>
/* Ensure hidden during normal browsing */
@media screen {
  .print-profile-wrapper {
    display: none !important;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  /* 1. Hide everything but the print wrapper */
  header,
  nav,
  aside,
  footer,
  .dashboard-sidebar,
  .dashboard-navbar,
  .dashboard-panel-header,
  [class*="UDashboard"],
  button {
    display: none !important;
  }

  /* 2. Reset Page Foundation */
  html, body {
    height: auto !important;
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    font-size: 11pt;
  }

  /* 3. Setup A4 Workspace */
  .print-profile-wrapper {
    display: block !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 210mm !important;
    min-height: 297mm !important;
    z-index: 999999 !important;
    background: white !important;
    color: #111 !important;
    /* font-family: 'Outfit', 'Inter', sans-serif !important; */
    color-scheme: light !important; /* Force light scheme */
  }

  /* 4. Layout Overrides for DisplayProfile's internal structure */
  .print-profile-wrapper * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* Force Layout Grid */
  .print-profile-wrapper > div > div {
    display: grid !important;
    grid-template-columns: 75mm 1fr !important;
    min-height: 297mm !important;
    width: 210mm !important;
  }

  /* Sidebar styling (First child of UPageGrid) */
  .print-profile-wrapper .flex.flex-col.items-center.justify-between {
    /* background-color: #f8fafc !important; */
    border-right: 1px solid #e2e8f0 !important;
    padding: 15mm 10mm !important;
    gap: 8mm !important;
    height: 100% !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
  }

  /* Main Content Area (Second child of UPageGrid) */
  .print-profile-wrapper .col-span-2 {
    grid-column: span 1 !important;
    padding: 12mm 12mm 15mm 12mm !important;
    gap: 8mm !important;
    background: white !important;
    display: flex !important;
    flex-direction: column !important;
  }

  /* Typography & Color Overrides */
  /* .print-profile-wrapper h1,
  .print-profile-wrapper h2,
  .print-profile-wrapper h3 {
    color: #0f172a !important;
    font-weight: 800 !important;
  } */

  /* .print-profile-wrapper .text-muted,
  .print-profile-wrapper .text-neutral-500 {
    color: #64748b !important;
  } */

  /* Avatar size fix */
  /* .print-profile-wrapper [class*="UAvatar"] {
    width: 45mm !important;
    height: 45mm !important;
    border-radius: 8px !important;
    margin-bottom: 5mm !important;
    border: 3px solid white !important;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
    background-color: #f1f5f9 !important;
  } */

  /* Content Fields Sections */
  /* .print-profile-wrapper [class*="AppContentFields"] {
    width: 100% !important;
    padding: 4mm 0 !important;
    border: none !important;
    gap: 4mm !important;
  } */

  /* Icons fix: Nuxt UI icons use background-color + mask/svg */
  /* .print-profile-wrapper [class*="i-"],
  .print-profile-wrapper .icon {
    display: inline-block !important;
    background-color: currentColor !important;
    color: #1e293b !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    opacity: 1 !important;
  } */

  /* Progress bars fix: Target both the container and the bar */
  /* .print-profile-wrapper .u-progress,
  .print-profile-wrapper [class*="UProgress"] {
    height: 2.5mm !important;
    background-color: #e2e8f0 !important;
    border-radius: 999px !important;
    overflow: hidden !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  } */

  /* .print-profile-wrapper .u-progress-bar,
  .print-profile-wrapper [class*="UProgress"] div {
    background-color: #0f172a !important;
    height: 100% !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  } */
}
</style>
