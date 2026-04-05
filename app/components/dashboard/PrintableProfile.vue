<script lang="ts" setup>
/**
 * PrintableProfile.vue
 *
 * Generates a print-optimized, A4-sized personal profile document.
 * Designed like a premium 2-column resume.
 * Provides an iframe-based printing mechanism for perfect pagination.
 */
import { storeToRefs } from 'pinia'

// Data Sources
const authStore = useAuthStore()
const profileStore = useProfileStore()
const academicStore = useAcademicStore()
const interestsStore = useInterestsStore()
const guardianStore = useGuardianStore()

const iframeRef = ref<HTMLIFrameElement | null>(null)

// Computed data with strict mapping to avoid deep type instantiation
const { profile } = storeToRefs(profileStore)
const { academic } = storeToRefs(academicStore)
const { interests: interestsRaw } = storeToRefs(interestsStore)
const { guardian } = storeToRefs(guardianStore)

// Formatters
const d = (val: unknown) => val || 'Not Provided'
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Provided'

// The Print Logic
const printProfile = () => {
  if (!iframeRef.value) return

  const doc = iframeRef.value.contentWindow?.document
  if (!doc) return

  // Unpack interests safely
  interface SubjectLiking { name: string, liking: number }
  const iData = interestsRaw.value as Record<string, unknown>
  const subjectList = (Array.isArray(iData.subject_ranking) ? iData.subject_ranking : []) as unknown as SubjectLiking[]

  // Basic styles for A4 printing
  const styles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        font-family: 'Inter', sans-serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #18181b;
        background: white;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        margin: auto;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body { margin: 0; }
        .page { margin: 0; width: 210mm; min-height: 297mm; }
      }

      /* Header */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2pt solid #1e40af;
        padding-bottom: 5mm;
        margin-bottom: 8mm;
      }

      .student-name {
        font-size: 24pt;
        font-weight: 800;
        letter-spacing: -0.025em;
        color: #1e3a8a;
      }

      .student-id {
        font-size: 12pt;
        font-weight: 600;
        color: #3b82f6;
        text-transform: uppercase;
      }

      .ga-logo {
        text-align: right;
        font-weight: 900;
        font-size: 14pt;
        color: #1e3a8a;
      }

      /* Layout */
      .content-grid {
        display: grid;
        grid-template-columns: 70mm 1fr;
        gap: 8mm;
        flex-grow: 1;
      }

      /* Columns */
      .sidebar {
        border-right: 0.5pt solid #e5e7eb;
        padding-right: 6mm;
      }

      .main-body {
        padding-left: 2mm;
      }

      /* Sidebar Elements */
      .avatar-container {
        width: 100%;
        aspect-ratio: 1;
        background: #f1f5f9;
        border: 2pt solid #e2e8f0;
        border-radius: 4mm;
        margin-bottom: 6mm;
        overflow: hidden;
      }
      .avatar-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .section-label {
        font-size: 9pt;
        font-weight: 700;
        text-transform: uppercase;
        color: #3b82f6;
        letter-spacing: 0.05em;
        margin-bottom: 3mm;
        display: block;
      }

      .sidebar-info-block {
        margin-bottom: 6mm;
      }

      .info-row {
        margin-bottom: 2mm;
      }
      .info-row-label {
        font-size: 8pt;
        font-weight: 600;
        color: #71717a;
        margin-bottom: 0.5mm;
      }
      .info-row-value {
        font-size: 9pt;
        font-weight: 500;
      }

      /* Main Body Elements */
      .academic-headline {
        background: #eff6ff;
        padding: 4mm;
        border-radius: 3mm;
        margin-bottom: 6mm;
        border-left: 3pt solid #1e40af;
      }
      .academic-headline-title {
        font-size: 14pt;
        font-weight: 700;
        color: #1e3a8a;
      }
      .academic-headline-meta {
        font-size: 10pt;
        color: #3b82f6;
        font-weight: 500;
      }

      .section-title {
        font-size: 14pt;
        font-weight: 700;
        margin-top: 6mm;
        margin-bottom: 4mm;
        color: #18181b;
        display: flex;
        align-items: center;
        gap: 2mm;
      }
      .section-divider {
        height: 0.5pt;
        background: #e5e7eb;
        flex-grow: 1;
      }

      .data-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4mm;
      }

      .interest-tag {
        display: inline-block;
        background: #f4f4f5;
        padding: 1mm 3mm;
        border-radius: 10mm;
        font-size: 9pt;
        font-weight: 500;
        margin-right: 2mm;
        margin-bottom: 2mm;
      }

      .liking-meter {
        width: 100%;
        margin-bottom: 3mm;
      }
      .liking-meter-header {
        display: flex;
        justify-content: space-between;
        font-size: 9pt;
        font-weight: 600;
        margin-bottom: 1mm;
      }
      .liking-bar-bg {
        height: 1.5mm;
        background: #e5e7eb;
        border-radius: 1mm;
        overflow: hidden;
      }
      .liking-bar-fill {
        height: 100%;
        background: #1e40af;
      }

      .footer-note {
        text-align: center;
        font-size: 8pt;
        color: #a1a1aa;
        margin-top: auto;
        padding-top: 10mm;
        border-top: 0.5pt solid #f4f4f5;
      }
    </style>
  `

  // The Actual HTML Construction
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Student Profile: ${profileStore.fullName}</title>
        ${styles}
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <p class="student-id">Student Record</p>
              <h1 class="student-name">${profileStore.fullName}</h1>
              <p class="academic-headline-meta">Student ID: ${academic.value.student_id ?? 'PENDING ASSIGNMENT'}</p>
            </div>
            <div class="ga-logo">
              GALAXY ACADEMY<br>JHANG
            </div>
          </div>

          <div class="content-grid">
            <!-- Sidebar (Left) -->
            <div class="sidebar">
              <div class="avatar-container">
                <img src="${profileStore.displayAvatarUrl}" alt="Student Avatar" />
              </div>

              <div class="sidebar-info-block">
                <span class="section-label">CONTACT DETAILS</span>
                <div class="info-row">
                  <p class="info-row-label">Primary Phone</p>
                  <p class="info-row-value">${d(guardian.value.phone)}</p>
                </div>
                <div class="info-row">
                  <p class="info-row-label">Email Address</p>
                  <p class="info-row-value">${d(authStore.user?.email)}</p>
                </div>
                <div class="info-row">
                  <p class="info-row-label">Current Address</p>
                  <p class="info-row-value">${d(profile.value.address)}, ${d(profile.value.city)}</p>
                </div>
              </div>

              <div class="sidebar-info-block">
                <span class="section-label">PERSONAL INFO</span>
                <div class="info-row">
                  <p class="info-row-label">CNIC / B-Form</p>
                  <p class="info-row-value">${d(profile.value.cnic)}</p>
                </div>
                <div class="info-row">
                  <p class="info-row-label">Date of Birth</p>
                  <p class="info-row-value">${formatDate(profile.value.dob || '')}</p>
                </div>
                <div class="info-row">
                  <p class="info-row-label">Gender</p>
                  <p class="info-row-value">${d(profile.value.gender)}</p>
                </div>
                <div class="info-row">
                  <p class="info-row-label">Blood Group</p>
                  <p class="info-row-value">${d(profile.value.blood_group)}</p>
                </div>
              </div>

              <div class="sidebar-info-block">
                <span class="section-label">GUARDIAN & EMERGENCY</span>
                <div class="info-row">
                  <p class="info-row-label">Guardian Name (${d(guardian.value.relationship)})</p>
                  <p class="info-row-value">${d(guardian.value.name)}</p>
                </div>
                <div class="info-row">
                  <p class="info-row-label">Emergency Contact (${d(guardian.value.emergency_relationship)})</p>
                  <p class="info-row-value">${d(guardian.value.emergency_name)}: ${d(guardian.value.emergency_phone)}</p>
                </div>
              </div>
            </div>

            <!-- Main Body (Right) -->
            <div class="main-body">
              <div class="academic-headline">
                <p class="academic-headline-title">${d(academic.value.current_class)} - ${d(academic.value.current_group)}</p>
                <p class="academic-headline-meta">${d(academic.value.current_school)} | ${d(academic.value.current_medium)} Medium</p>
              </div>

              <div class="section-title">Academic Details <div class="section-divider"></div></div>
              <div class="data-grid">
                <div class="info-row">
                  <p class="info-row-label">Hafiz-e-Quran</p>
                  <p class="info-row-value">${academic.value.is_hafiz ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div class="section-title">Interests & Hobbies <div class="section-divider"></div></div>
              <div class="sidebar-info-block">
                <p class="info-row-label">Career Aspirations</p>
                <p class="info-row-value">${d(interestsRaw.value.career_aspiration)}</p>
              </div>
              <div class="sidebar-info-block">
                <p class="info-row-label">Personal Hobbies</p>
                <p class="info-row-value">${d(interestsRaw.value.hobby)}</p>
              </div>

              <div class="section-title">Subject Performance Liking <div class="section-divider"></div></div>
              <div class="data-grid">
                ${subjectList.map((s: SubjectLiking) => `
                  <div class="liking-meter">
                    <div class="liking-meter-header">
                      <span>${s.name}</span>
                      <span style="color: #3b82f6;">${s.liking}/5</span>
                    </div>
                    <div class="liking-bar-bg">
                      <div class="liking-bar-fill" style="width: ${(s.liking / 5) * 100}%"></div>
                    </div>
                  </div>
                `).join('') || '<p>Not Provided</p>'}
              </div>

              <div class="section-title">Achievements <div class="section-divider"></div></div>
              <p class="info-row-value">${d(academic.value.achievements)}</p>
            </div>
          </div>

          <div class="footer-note">
            This student profile was officially generated by Galaxy Academy Jhang.
            All information provided is subject to verification. | Generated on ${new Date().toLocaleDateString()}
          </div>
        </div>
      </body>
    </html>
  `

  doc.open()
  doc.write(html)
  doc.close()

  // Give some time for resources (fonts/images) to load in iframe before printing
  setTimeout(() => {
    iframeRef.value?.contentWindow?.focus()
    iframeRef.value?.contentWindow?.print()
  }, 500)
}

// Expose the print method to parent components
defineExpose({
  printProfile
})
</script>

<template>
  <!-- Hidden Iframe to handle the print document -->
  <iframe
    ref="iframeRef"
    style="position: absolute; width: 0; height: 0; border: none;"
    aria-hidden="true"
  />
</template>
