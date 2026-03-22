import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Eyebrow } from '../components/UI'
import styles from './Home.module.css'

const PLANS = [
  {
    name: 'Starter', price: '299', popular: false,
    features: ['Gym erişimi (hafta içi)', 'Temel antrenman programı', 'İlerleme takibi'],
    missing: ['Kişisel antrenör', 'Beslenme danışmanlığı', 'Özel seans planlaması'],
  },
  {
    name: 'Pro', price: '599', popular: true,
    features: ['7/24 Gym erişimi', 'Özel antrenman programı', 'Gerçek zamanlı ilerleme', 'Kişisel antrenör', 'Aylık vücut ölçümü'],
    missing: ['Beslenme danışmanlığı'],
  },
  {
    name: 'Elite', price: '999', popular: false,
    features: ['7/24 VIP Gym erişimi', 'Tam kişiselleştirilmiş program', 'Anlık koç takibi', 'Özel antrenör (3x/hafta)', 'Profesyonel analiz', 'Beslenme & supplement planı'],
    missing: [],
  },
]

const FEATURES = [
  { icon: '⚡', name: 'Akıllı Antrenman', desc: 'Antrenörünüz tarafından özel olarak hazırlanan, hedeflerinize uygun dinamik antrenman programları. Her seans detaylı olarak planlanır ve takip edilir.' },
  { icon: '📊', name: 'Gerçek Zamanlı İlerleme', desc: 'Vücut ölçümleriniz, güç artışlarınız ve fitness skorunuz anlık olarak kaydedilir. Grafiklerle ilerlemenizi görsel olarak takip edin.' },
  { icon: '🤝', name: 'Antrenör Eşleştirme', desc: 'Hedeflerinize ve tercihlerinize göre en uygun kişisel antrenörle eşleştirilirsiniz. Doğrudan iletişim ve seans planlaması ile tam destek.' },
  { icon: '🔐', name: 'Güvenli JWT Auth', desc: 'Endüstri standardı JWT token tabanlı kimlik doğrulama. Rol bazlı yetkilendirme ile üye, antrenör ve admin rolleri tam güvenlikle yönetilir.' },
]

export default function Home() {
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
              Kişisel antrenörler, akıllı antrenman programları ve gerçek zamanlı ilerleme takibi ile fitness yolculuğunuzu bir üst seviyeye taşıyın.
            </p>
            <div className={styles.heroActions}>
              <Link to="/register" className={styles.btnHeroPrimary}>Hemen Başla</Link>
              <a href="#plans" className={styles.btnHeroGhost}>Planları Gör</a>
            </div>
            <div className={styles.heroStats}>
              <div><div className={styles.statNum}>2<span>K+</span></div><div className={styles.statLabel}>Aktif Üye</div></div>
              <div><div className={styles.statNum}>48<span>+</span></div><div className={styles.statLabel}>Antrenör</div></div>
              <div><div className={styles.statNum}>99<span>%</span></div><div className={styles.statLabel}>Memnuniyet</div></div>
            </div>
          </div>

          {/* Floating cards */}
          <div className={styles.heroVisual}>
            <div className={`${styles.floatCard} ${styles.cardA}`} style={{ animationDelay: '0s' }}>
              <div className={styles.cardChip}>Bugünkü Program</div>
              <div className={styles.cardBig}>Üst Vücut Güç</div>
              <div className={styles.cardRow}><span>Egzersiz</span><span>8 hareket</span></div>
              <div className={styles.cardRow}><span>Süre</span><span>55 dk</span></div>
              <div className={styles.cardRow}><span>Zorluk</span><span style={{ color: 'var(--orange)' }}>Orta–İleri</span></div>
              <div className={styles.progWrap}><div className={styles.progFill} style={{ width: '65%' }} /></div>
            </div>
            <div className={`${styles.floatCard} ${styles.cardB}`} style={{ animationDelay: '-3s' }}>
              <div className={styles.cardChip}>Aylık İlerleme</div>
              <div className={styles.cardBig}>+4.2 kg Kas</div>
              <div className={styles.cardRow}><span>Yağ Oranı</span><span style={{ color: 'var(--green)' }}>↓ 2.1%</span></div>
              <div className={styles.cardRow}><span>Seans</span><span>18 / 20</span></div>
              <div className={styles.progWrap}><div className={styles.progFill} style={{ width: '90%' }} /></div>
            </div>
            <div className={`${styles.floatCard} ${styles.cardC}`} style={{ animationDelay: '-1.5s' }}>
              <div className={styles.cardChip}>Üyelik</div>
              <div className={styles.cardBig}>Pro Plan</div>
              <div className={styles.cardRow}><span>Durum</span><span className={styles.greenBadge}>Aktif</span></div>
              <div className={styles.cardRow}><span>Antrenör</span><span>Atanmış ✓</span></div>
            </div>
          </div>
        </section>

        {/* ── PLANS ── */}
        <section className={styles.section} id="plans">
          <Eyebrow>Fiyatlandırma</Eyebrow>
          <h2 className={styles.sectionTitle}>Üyelik <span className={styles.accent}>Planları</span></h2>
          <p className={styles.sectionSub}>İhtiyacınıza uygun planı seçin ve hemen fitness yolculuğunuza başlayın.</p>
          <div className={styles.plansGrid}>
            {PLANS.map(plan => (
              <div key={plan.name} className={`${styles.planCard} ${plan.popular ? styles.planFeatured : ''}`}>
                {plan.popular && <span className={styles.popularBadge}>Popüler</span>}
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}><sup>₺</sup>{plan.price}<sub>/ay</sub></div>
                <div className={styles.planDivider} />
                <ul className={styles.planFeatures}>
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                  {plan.missing.map(f => <li key={f} className={styles.planMissing}>{f}</li>)}
                </ul>
                <Link to="/register" className={plan.popular ? styles.planBtnFill : styles.planBtnOutline}>
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className={styles.section} id="features">
          <Eyebrow>Platform</Eyebrow>
          <h2 className={styles.sectionTitle}>Her Şey Bir <span className={styles.accent}>Yerde</span></h2>
          <p className={styles.sectionSub}>Antrenman, ilerleme takibi ve antrenör koordinasyonu tek platformda.</p>
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

        {/* ── ROLES ── */}
        <section className={styles.section} id="roles">
          <Eyebrow>Kullanıcı Rolleri</Eyebrow>
          <h2 className={styles.sectionTitle}>Kim İçin <span className={styles.accent}>Tasarlandı?</span></h2>
          <div className={styles.rolesGrid}>
            {[
              { n: '01', name: 'Üye', desc: 'Fitness hedeflerine ulaşmak isteyen bireyler.', perms: ['Antrenman seansı görüntüleme & tamamlama', 'İlerleme verisi giriş ve görüntüleme', 'Üyelik planı seçimi'] },
              { n: '02', name: 'Antrenör', desc: 'Müşterilerini yönetmek isteyen profesyoneller.', perms: ['Üye programı oluşturma & düzenleme', 'Antrenman seansı planlama', 'Üye ilerlemesini takip etme', 'Üyelik planı atama'] },
              { n: '03', name: 'Admin', desc: 'Platformun tamamını yöneten sistem yöneticileri.', perms: ['Tüm kullanıcı yönetimi', 'Üyelik planı tanımlama', 'Antrenör – üye eşleştirme', 'Platform istatistikleri'] },
            ].map(r => (
              <div key={r.n} className={styles.roleCard}>
                <div className={styles.roleNum}>{r.n}</div>
                <div className={styles.roleName}>{r.name}</div>
                <p className={styles.roleDesc}>{r.desc}</p>
                <ul className={styles.rolePerms}>
                  {r.perms.map(p => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={styles.cta}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaTitle}>Dönüşümünü <span className={styles.accent}>Başlat</span></div>
          <p className={styles.ctaSub}>Bugün kayıt ol, ilk haftan ücretsiz. Kredi kartı gerekmez.</p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.btnHeroPrimary}>Ücretsiz Başla</Link>
            <Link to="/login" className={styles.btnHeroGhost}>Giriş Yap</Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className={styles.footer}>
          <div className={styles.footerLogo}>IRON<span>FORGE</span></div>
          <div className={styles.footerLinks}>
            <a href="#">Gizlilik</a><a href="#">Kullanım Şartları</a>
            <a href="#">Destek</a><a href="#">API</a>
          </div>
          <div className={styles.footerCopy}>© 2026 IronForge. Tüm hakları saklıdır.</div>
        </footer>
      </main>
    </>
  )
}
