import { defineStore } from 'pinia'
import type { PricingPlanProps, ButtonProps, TabsItem } from '@nuxt/ui'

export const useLandingStore = defineStore('landingStore', () => {
  // --- STATE ---
  const heroLinks = ref<ButtonProps[]>([
    {
      label: 'Get Started',
      variant: 'solid',
      size: 'xl',
      to: URLS.auth.registration.home
    },
    {
      label: 'Learn More',
      variant: 'soft',
      size: 'xl',
      to: URLS.benefits
    }
  ])

  const benefits = ref([
    {
      title: 'Conceptual Clarity',
      description:
        'Master core academic theories through structured lessons that simplify complex textbook topics into clear, understandable concepts.',
      icon: ICONS.benefits.automation
    },
    {
      title: 'Disciplined Study Environment',
      description:
        'Benefit from a physical classroom dedicated to focused learning, free from the distractions of home or digital environments.',
      icon: ICONS.benefits.analytics
    },
    {
      title: 'Exam Preparation Strategy',
      description:
        'Learn systematic approaches to academic assessments, focusing on curriculum requirements and effective test-taking techniques.',
      icon: ICONS.benefits.integration
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
        'English',
        'Urdu',
        'Islamiat'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    },{
      title: 'Science Only',
      price: 'Rs. 2800',
      billingCycle: '/month',
      features: [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology/Computer Science'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    }, {
      title: 'All Subjects',
      price: 'Rs. 4000',
      billingCycle: '/month',
      discount: 'Rs. 2800',
      billingPeriod: '20% off',
      features: [
        'English',
        'Urdu',
        'Islamiat',
        'Physics',
        'Mathematics',
        'Chemistry',
        'Computer Science/Biology'
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
        'English',
        'Urdu',
        'Islamiat'
      ],
      button: {
        label: 'Register Now',
        to: URLS.auth.registration.home
      }
    },{
      title: 'Science Only',
      price: 'Rs. 3000',
      billingCycle: '/month',
      features: [
        'Physics',
        'Mathematics/Biology',
        'Computer Science/Chemistry',
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
        'English',
        'Urdu',
        'Islamiat',
        'Physics',
        'Mathematics/Biology',
        'Computer Science/Chemistry',
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
      icon: ICONS.nav.getStarted,
      variant: 'solid',
      size: 'xl',
      to: URLS.auth.registration.home
    }, {
      label: 'Contact Us',
      icon: ICONS.nav.contact,
      variant: 'soft',
      size: 'xl',
      to: 'https://wa.me/923147864828',
      target: '_blank'
    }

  ])

  // --- GETTERS ---

  // --- EXPOSE ---
  return {
    heroLinks,
    ctaLinks,
    pricingTabs,
    matriculationPlans,
    intermediatePlans,
    benefits
  }
})
