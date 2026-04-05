<script lang="ts" setup>
/**
 * Instant Printable Profile
 *
 * This component provides an instant printing mechanism by rendering
 * the PrintTemplate directly on the page but keeping it hidden from the screen.
 *
 * When window.print() is called, CSS @media print rules hide the dashboard
 * and only show this template, using the data already available in memory.
 */
import DashboardPrintTemplate from '~/components/dashboard/PrintTemplate.vue'

const printProfile = () => {
  // It's instant because the data is already in Pinia stores shared by the parent
  window.print()
}

// Expose for parent components (like the Dashboard Index)
defineExpose({
  printProfile
})
</script>

<template>
  <div class="instant-print-container">
    <DashboardPrintTemplate mode="print" />
  </div>
</template>

<style>
/*
  Global styles because we need to affect the entire app body during print.
  Scoped styles wouldn't be able to hide the dashboard's "chrome".
*/
@media screen {
  .instant-print-container {
    display: none !important;
  }
}

@media print {
  /* 1. Hide the entire Dashboard UI */
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

  /* 2. Show ONLY our instant print container */
  .instant-print-container {
    display: block !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    z-index: 999999 !important;
    background: white !important;
  }

  /* 3. Reset body and html for clean print */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
    height: auto !important;
  }

  /* Force background colors for print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
