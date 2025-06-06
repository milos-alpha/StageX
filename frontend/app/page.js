import { Metadata } from 'next'
import HeroSection from '@/components/home/hero'
import FeaturedJobs from '@/components/jobs/featured-jobs'
import PopularCompanies from '@/components/companies/popular-companies'
import HowItWorks from '@/components/home/how-it-works'
import Testimonials from '@/components/home/testimonials'

export const metadata: Metadata = {
  title: 'Find Your Dream Job | Job Portal',
  description: 'Discover thousands of job opportunities and find your perfect match',
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedJobs />
      <PopularCompanies />
      <HowItWorks />
      <Testimonials />
    </main>
  )
}