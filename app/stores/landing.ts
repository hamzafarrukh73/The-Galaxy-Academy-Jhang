import type { ButtonProps, PricingPlanProps, TabsItem } from '@nuxt/ui'

export const useLandingStore = defineStore('landingStore', () => {
  // --- STATE ---
  const heroLinks = ref<ButtonProps[]>([
    {
      label: 'Enroll Now',
      icon: ICONS.nav.education,
      variant: 'solid',
      size: 'xl',
      to: URLS.auth.registration.home
    },
    {
      label: 'Learn More',
      icon: ICONS.info.help,
      variant: 'soft',
      size: 'xl',
      to: URLS.landing.benefits
    }
  ])

  const benefits = ref([
    {
      title: 'Conceptual Clarity',
      description:
        'Master core academic theories through structured lessons that simplify complex textbook topics into clear, understandable concepts.',
      icon: ICONS.info.feature
    },
    {
      title: 'Disciplined Study Environment',
      description:
        'Benefit from a physical classroom dedicated to focused learning, free from the distractions of home or digital environments.',
      icon: ICONS.nav.education
    },
    {
      title: 'Exam Preparation Strategy',
      description:
        'Learn systematic approaches to academic assessments, focusing on curriculum requirements and effective test-taking techniques.',
      icon: ICONS.action.edit
    }
  ])

  const pricingTabs = ref<TabsItem[]>([
    {
      label: 'Matriculation',
      slot: 'matriculation' as const
    }, {
      label: 'Intermediate',
      slot: 'intermediate' as const
    }
  ])

  const matriculationPlans = ref<PricingPlanProps[]>([
    {
      title: 'Arts Only',
      price: 'Rs. 1200',
      billingCycle: '/month',
      features: [
        'Urdu',
        'English',
        'Islamiyat'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }, {
      title: 'Science Only',
      price: 'Rs. 2800',
      billingCycle: '/month',
      features: [
        'Physics',
        'Mathematics',
        'Chemistry',
        'Biology',
        'Computer Science'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }, {
      title: 'All Subjects',
      price: 'Rs. 4000',
      billingCycle: '/month',
      discount: 'Rs. 3200',
      billingPeriod: '20% off',
      features: [
        'Urdu',
        'English',
        'Islamiyat',
        'Physics',
        'Mathematics',
        'Chemistry',
        'Biology',
        'Computer Science'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }
  ])

  const intermediatePlans = ref<PricingPlanProps[]>([
    {
      title: 'Arts Only',
      price: 'Rs. 1500',
      billingCycle: '/month',
      features: [
        'Urdu',
        'English',
        'Islamiyat'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }, {
      title: 'Science Only',
      price: 'Rs. 3000',
      billingCycle: '/month',
      features: [
        'Physics',
        'Mathematics',
        'Biology',
        'Chemistry',
        'Computer Science'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }, {
      title: 'All Subjects',
      price: 'Rs. 4500',
      billingCycle: '/month',
      discount: 'Rs. 3600',
      billingPeriod: '20% off',
      features: [
        'Urdu',
        'English',
        'Islamiyat',
        'Physics',
        'Mathematics',
        'Biology',
        'Chemistry',
        'Computer Science'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }
  ])
  const ctaLinks = ref<ButtonProps[]>([
    {
      label: 'Join Now',
      icon: ICONS.action.start,
      variant: 'solid',
      size: 'xl',
      to: URLS.auth.registration.home
    }, {
      label: 'Contact Us',
      icon: ICONS.action.call,
      variant: 'soft',
      size: 'xl',
      to: EXTERNAL_URLS.social.whatsapp,
      target: '_blank'
    }

  ])

  const contacts = ref([
    {
      description: 'Monday to Saturday, 4 PM to 7 PM',
      icon: ICONS.info.time
    },
    {
      description: '+923326283024',
      icon: ICONS.action.call
    },
    {
      description: 'thegalaxyacademyjhang@gmail.com',
      icon: ICONS.info.mail
    }
  ])

  const contactLinks = ref([
    {
      label: 'Whatsapp',
      icon: ICONS.brand.whatsapp,
      to: EXTERNAL_URLS.social.whatsapp
    }
  ])

  const faqs = [
    {
      label: 'Are there separate batches for students who start late?',
      content: 'Yes, we offer dedicated batches for students who join mid-session. Our system is designed to integrate late-joiners without disrupting the progress of existing classes.'
    }, {
      label: 'What is the qualification of the teachers?',
      content: 'Our faculty consists of subject specialists with years of experience. We use a "Concept First" approach, ensuring students understand the "Why" before the "How."'
    }, {
      label: 'How do you track student progress?',
      content: 'We conduct chapter-wise tests and before the board exams, we run a dedicated Test Session to simulate the actual exam environment.'
    }
  ]
  // --- GETTERS ---

  // --- EXPOSE ---
  return {
    heroLinks,
    benefits,
    pricingTabs,
    matriculationPlans,
    intermediatePlans,
    ctaLinks,
    contacts,
    contactLinks,
    faqs
  }
})
