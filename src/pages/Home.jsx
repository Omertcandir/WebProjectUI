import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subscriptionsApi } from '../api'
import Navbar from '../components/Navbar'
import { Eyebrow } from '../components/UI'
import styles from './Home.module.css'

const DEFAULT_PLANS = [
  {
    name: 'Starter', price: '299', popular: false,
    features: ['Gym access (weekdays)', 'Basic training program', 'Progress tracking'],
    missing: ['Personal coach', 'Nutrition coaching', 'Private session planning'],
  },
  {
    name: 'Pro', price: '599', popular: true,
    features: ['24/7 gym access', 'Custom training program', 'Real-time progress', 'Personal coach', 'Monthly body measurements'],
    missing: ['Nutrition coaching'],
  },
  {
    name: 'Elite', price: '999', popular: false,
    features: ['24/7 VIP gym access', 'Fully personalized program', 'Live coach tracking', 'Private coach (3x/week)', 'Professional analysis', 'Nutrition & supplement plan'],
    missing: [],
  },
]

const FEATURES = [
  { icon: '⚡', name: 'Smart Training', desc: 'Dynamic workout plans tailored to your goals and prepared by your coach. Every session is planned and tracked in detail.' },
  { icon: '📊', name: 'Real-Time Progress', desc: 'Your body metrics, strength gains, and fitness score are logged instantly. Track your progress visually with charts.' },
  { icon: '🤝', name: 'Coach Matching', desc: 'Get matched with the best personal trainer based on your goals and preferences. Direct communication and scheduling included.' },
  { icon: '🔐', name: 'Secure JWT Auth', desc: 'Industry-standard JWT authentication with role-based authorization for members, trainers, and admins.' },
]

export default function Home() {
  const [plans, setPlans] = useState(DEFAULT_PLANS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionsApi.getPlans()
        const apiPlans = Array.isArray(data) ? data : data?.plans || []
        if (apiPlans.length > 0) {
          // Map API plans to display format
          const formattedPlans = apiPlans.map((plan, idx) => ({
            name: plan.title || `Plan ${idx + 1}`,
            price: Math.round(plan.monthlyPrice || 0),
            popular: idx === Math.floor(apiPlans.length / 2), // Mark middle one as popular
            features: [
              `${plan.durationInMonths} month duration`,
              plan.canFreeze ? 'Freeze option available' : 'No freeze option',
              plan.description || 'Access to all features',
            ],
            missing: [],
          }))
          setPlans(formattedPlans)
        }
      } catch (err) {
        console.warn('Could not load plans from API, using defaults:', err)
        setPlans(DEFAULT_PLANS)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroGrid} />
            <div className={styles.heroGlow} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>Elite Fitness Platform</div>
            <h1 className={styles.heroTitle}>
              Forge<br />
              Your <span className={styles.accent}>Best</span><br />
              <span className={styles.outline}>Self</span>
            </h1>
            <p className={styles.heroDesc}>
              Level up your fitness journey with personal coaching, smart training programs, and real-time progress tracking.
            </p>
            <div className={styles.heroActions}>
              <Link to="/register" className={styles.btnHeroPrimary}>Get Started</Link>
              <a href="#plans" className={styles.btnHeroGhost}>View Plans</a>
            </div>
            <div className={styles.heroStats}>
              <div><div className={styles.statNum}>2<span>K+</span></div><div className={styles.statLabel}>Active Members</div></div>
              <div><div className={styles.statNum}>48<span>+</span></div><div className={styles.statLabel}>Trainers</div></div>
              <div><div className={styles.statNum}>99<span>%</span></div><div className={styles.statLabel}>Satisfaction</div></div>
            </div>
          </div>

          {/* Floating cards */}
          <div className={styles.heroVisual}>
            <div className={`${styles.floatCard} ${styles.cardA}`} style={{ animationDelay: '0s' }}>
              <div className={styles.cardChip}>Today's Program</div>
              <div className={styles.cardBig}>Upper Body Strength</div>
              <div className={styles.cardRow}><span>Exercises</span><span>8 moves</span></div>
              <div className={styles.cardRow}><span>Duration</span><span>55 min</span></div>
              <div className={styles.cardRow}><span>Difficulty</span><span style={{ color: 'var(--orange)' }}>Intermediate-Advanced</span></div>
              <div className={styles.progWrap}><div className={styles.progFill} style={{ width: '65%' }} /></div>
            </div>
            <div className={`${styles.floatCard} ${styles.cardB}`} style={{ animationDelay: '-3s' }}>
              <div className={styles.cardChip}>Monthly Progress</div>
              <div className={styles.cardBig}>+4.2 kg Muscle</div>
              <div className={styles.cardRow}><span>Body Fat</span><span style={{ color: 'var(--green)' }}>↓ 2.1%</span></div>
              <div className={styles.cardRow}><span>Sessions</span><span>18 / 20</span></div>
              <div className={styles.progWrap}><div className={styles.progFill} style={{ width: '90%' }} /></div>
            </div>
            <div className={`${styles.floatCard} ${styles.cardC}`} style={{ animationDelay: '-1.5s' }}>
              <div className={styles.cardChip}>Membership</div>
              <div className={styles.cardBig}>Pro Plan</div>
              <div className={styles.cardRow}><span>Status</span><span className={styles.greenBadge}>Active</span></div>
              <div className={styles.cardRow}><span>Coach</span><span>Assigned ✓</span></div>
            </div>
          </div>
        </section>

        {/* ── PLANS ── */}
        <section className={styles.section} id="plans">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className={styles.sectionTitle}>Membership <span className={styles.accent}>Plans</span></h2>
          <p className={styles.sectionSub}>Choose the plan that fits your needs and start your fitness journey today.</p>
          <div className={styles.plansGrid}>
            {plans.map(plan => (
              <div key={plan.name} className={`${styles.planCard} ${plan.popular ? styles.planFeatured : ''}`}>
                {plan.popular && <span className={styles.popularBadge}>Popular</span>}
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}><sup>₺</sup>{plan.price}<sub>/month</sub></div>
                <div className={styles.planDivider} />
                <ul className={styles.planFeatures}>
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                  {plan.missing.map(f => <li key={f} className={styles.planMissing}>{f}</li>)}
                </ul>
                <Link to="/register" className={plan.popular ? styles.planBtnFill : styles.planBtnOutline}>
                  Start
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className={styles.section} id="features">
          <Eyebrow>Platform</Eyebrow>
          <h2 className={styles.sectionTitle}>Everything in <span className={styles.accent}>One Place</span></h2>
          <p className={styles.sectionSub}>Workouts, progress tracking, and coach coordination on a single platform.</p>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.name} className={styles.featureItem}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureName}>{f.name}</div>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={styles.cta}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaTitle}>Start Your <span className={styles.accent}>Transformation</span></div>
          <p className={styles.ctaSub}>Sign up today and get your first week free. No credit card required.</p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.btnHeroPrimary}>Start Free</Link>
            <Link to="/login" className={styles.btnHeroGhost}>Sign In</Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className={styles.footer}>
          <div className={styles.footerLogo}>IRON<span>FORGE</span></div>
          <div className={styles.footerLinks}>
            <a href="#">Privacy</a><a href="#">Terms</a>
            <a href="#">Support</a><a href="#">API</a>
          </div>
          <div className={styles.footerCopy}>© 2026 IronForge. All rights reserved.</div>
        </footer>
      </main>
    </>
  )
}
