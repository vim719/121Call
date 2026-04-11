<template>
  <div class="landing-page">
    <!-- NAVIGATION -->
    <nav :style="{ boxShadow: navBoxShadow }">
      <div class="nav-inner">
        <NuxtLink to="/" class="logo">
          <div class="logo-mark">
            <div class="logo-signal"></div>
          </div>
          167Call
        </NuxtLink>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <NuxtLink to="/login" class="nav-cta">Start for free</NuxtLink>
        </div>
        <button class="nav-menu-btn" aria-label="Menu" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <div class="hero-inner">
          <div class="hero-text">
            <div class="hero-badge">
              <div class="hero-badge-dot"></div>
              Live on 16,212 shop floors worldwide
            </div>
            <h1>Every customer <br>hears from you <em>personally.</em></h1>
            <p class="hero-sub">Send personalized messages to hundreds of your regulars in minutes — each one written just for them, from your real number. Not a 1-800 line. Your number.</p>
            <div class="hero-actions">
              <NuxtLink to="/login" class="btn-primary">
                Start for free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </NuxtLink>
              <a href="#how-it-works" class="btn-ghost">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.25"></circle><path d="M7.5 6.5L11.5 9L7.5 11.5V6.5Z" fill="currentColor"></path></svg>
                See how it works
              </a>
            </div>
            <div class="hero-note">
              <div class="hero-note-dot"></div>
              Free plan available · No credit card required · Setup in 5 minutes
            </div>
          </div>

          <!-- PHONE MOCKUP -->
          <div class="phone-wrap">
            <div class="phone-glow"></div>
            <div class="hero-float hero-float-1">
              <div class="hf-label">Response rate</div>
              <div class="hf-value hf-green">↑ 23.4%</div>
            </div>
            <div class="hero-float hero-float-2">
              <div class="hf-label">Cost per message</div>
              <div class="hf-value hf-orange">$0.00</div>
            </div>
            <div class="phone-frame" :style="phoneTransform">
              <div class="phone-screen">
                <!-- App Header -->
                <div class="phone-bar">
                  <div class="phone-bar-top">
                    <span>9:41</span>
                    <span>▪ ▪ ▪ ◉</span>
                  </div>
                  <div class="phone-bar-title">Summer Drop Campaign</div>
                  <div class="phone-bar-sub">89 contacts · Running now</div>
                  <div class="campaign-pill">
                    <span style="width:6px;height:6px;border-radius:50%;background:#0DBA7F;display:inline-block;"></span>
                    47 delivered · 31 sending
                  </div>
                </div>
                <!-- Contact List -->
                <div class="phone-contacts">
                  <div class="contact-item">
                    <div class="contact-avatar" style="background:#E0EAFF;color:#1352F0;">MJ</div>
                    <div class="contact-info">
                      <div class="contact-name">Maria Johnson</div>
                      <div class="contact-msg">Hey Maria! The new Adidas just landed—thought of you 👟</div>
                    </div>
                    <div class="contact-status">
                      <div class="status-sent">✓✓ Sent</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <div class="contact-avatar" style="background:#E8FAF3;color:#0DBA7F;">SC</div>
                    <div class="contact-info">
                      <div class="contact-name">Sarah Chen</div>
                      <div class="contact-msg">Sarah! Those gold hoops you loved are back in ✨</div>
                    </div>
                    <div class="contact-status">
                      <div class="status-sent">✓✓ Sent</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <div class="contact-avatar" style="background:#FFF3EF;color:#FF5C35;">MW</div>
                    <div class="contact-info">
                      <div class="contact-name">Marcus Williams</div>
                      <div class="contact-msg">Marcus, limited Jordans you asked about are here!</div>
                    </div>
                    <div class="contact-status">
                      <div class="status-pending">Sending…</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <div class="contact-avatar" style="background:#EEF4FF;color:#3B73FF;">PP</div>
                    <div class="contact-info">
                      <div class="contact-name">Priya Patel</div>
                      <div class="contact-msg">Priya! Perfect fit — slim jeans in your size arrived</div>
                    </div>
                    <div class="contact-status">
                      <div class="status-pending">Queued</div>
                    </div>
                  </div>
                </div>
                <!-- Footer Stats -->
                <div class="phone-footer">
                  <div class="phone-stat">
                    <div class="phone-stat-n">47</div>
                    <div class="phone-stat-l">Delivered</div>
                  </div>
                  <div class="phone-stat">
                    <div class="phone-stat-n" style="color:#FF5C35;">3</div>
                    <div class="phone-stat-l">Replied 🔥</div>
                  </div>
                  <div class="phone-stat">
                    <div class="phone-stat-n" style="color:#3B73FF;">89</div>
                    <div class="phone-stat-l">Total</div>
                  </div>
                </div>
              </div>
              <div class="phone-home-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <div class="stats-bar">
      <div class="container">
        <div class="stats-inner">
          <div class="stat-item reveal">
            <div class="stat-n"><span class="counter" data-target="16212">0</span><span>+</span></div>
            <div class="stat-l">Active shops</div>
          </div>
          <div class="stat-item reveal reveal-delay-1">
            <div class="stat-n"><span class="counter" data-target="5921">0</span><span>K+</span></div>
            <div class="stat-l">Messages sent</div>
          </div>
          <div class="stat-item reveal reveal-delay-2">
            <div class="stat-n">$<span>0</span></div>
            <div class="stat-l">Cost per message</div>
          </div>
          <div class="stat-item reveal reveal-delay-3">
            <div class="stat-n">&lt;<span>30</span>s</div>
            <div class="stat-l">Average delivery</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROBLEM SECTION -->
    <section class="section" id="features">
      <div class="container">
        <div class="text-center reveal">
          <div class="section-eyebrow">Why It Works</div>
          <h2 class="section-title">Generic blasts get ignored.<br><em>Personal notes get responses.</em></h2>
          <p class="section-sub" style="margin: 0 auto;">The difference between a 1% response rate and a 23% response rate is whether your customer felt like you were talking to them — or at them.</p>
        </div>
        <div class="problem-grid">
          <div class="problem-card bad reveal reveal-delay-1">
            <div class="pc-tag bad">
              <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" opacity=".5"></circle></svg>
              Old way
            </div>
            <div class="pc-rate bad">1%</div>
            <div class="pc-desc">response rate from bulk blasts</div>
            <div class="message-bubble bubble-generic">
              📣 NEW ARRIVALS IN STORE! Shop now and save 10%. Limited time only. Reply STOP to opt out.
            </div>
          </div>
          <div class="problem-card good reveal reveal-delay-2">
            <div class="pc-tag good">
              <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" opacity=".5"></circle></svg>
              167Call
            </div>
            <div class="pc-rate good">23%</div>
            <div class="pc-desc">response rate with personal messages</div>
            <div class="message-bubble bubble-personal">
              <strong>From: Main St Boutique 📱</strong>
              Hey Maria! Those new Adidas Ultraboosts just landed — the exact style you tried on last month. Grabbed a size 8 for you. Come see! 👟
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <!-- FEATURE 1: IMPORT -->
    <section class="section">
      <div class="container">
        <div class="feature-row">
          <div class="feature-content reveal">
            <div class="section-eyebrow">Smart Import</div>
            <h2 class="section-title">Your customers, already in your pocket.</h2>
            <p class="section-sub">Snap a photo of any paper with phone numbers — handwritten notes, business cards, receipts — and we pull every number out instantly. Or export from your POS in seconds.</p>
            <div style="margin-top: 28px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display:flex;align-items:center;gap:12px;font-size:14px;color:var(--ink-2);">
                <div style="width:20px;height:20px;border-radius:50%;background:var(--green-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#0DBA7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>
                </div>
                Scan handwritten notes with your phone camera
              </div>
              <div style="display:flex;align-items:center;gap:12px;font-size:14px;color:var(--ink-2);">
                <div style="width:20px;height:20px;border-radius:50%;background:var(--green-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#0DBA7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>
                </div>
                Import from CellSmart, Square, Clover, or any CSV
              </div>
              <div style="display:flex;align-items:center;gap:12px;font-size:14px;color:var(--ink-2);">
                <div style="width:20px;height:20px;border-radius:50%;background:var(--green-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#0DBA7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>
                </div>
                Keep or skip each number with one tap
              </div>
            </div>
          </div>
          <div class="feature-visual reveal reveal-delay-2">
            <div class="feature-visual-header">
              <div class="fv-dot"></div>
              <div class="fv-title">Scan &amp; Import</div>
            </div>
            <div class="ocr-visual">
              <div class="ocr-scan-area">
                <div class="scan-line"></div>
                <div class="scan-label">
                  <strong>Reading handwritten note…</strong>
                  "Maria 555-1234, Bob 917-555-0156, Priya (646) 555-8890"
                </div>
              </div>
              <div class="ocr-results">
                <div class="ocr-result-item">
                  <div>
                    <div class="ocr-phone">+1 (555) 123-4567</div>
                    <div style="font-size:10px;color:var(--ink-3);margin-top:2px;">Inferred name: Maria</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="ocr-confidence conf-high">● High</div>
                    <div class="ocr-actions">
                      <button class="ocr-btn ocr-keep">Keep</button>
                      <button class="ocr-btn ocr-skip">Skip</button>
                    </div>
                  </div>
                </div>
                <div class="ocr-result-item">
                  <div>
                    <div class="ocr-phone">+1 (917) 555-0156</div>
                    <div style="font-size:10px;color:var(--ink-3);margin-top:2px;">Inferred name: Bob</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="ocr-confidence conf-high">● High</div>
                    <div class="ocr-actions">
                      <button class="ocr-btn ocr-keep">Keep</button>
                      <button class="ocr-btn ocr-skip">Skip</button>
                    </div>
                  </div>
                </div>
                <div class="ocr-result-item">
                  <div>
                    <div class="ocr-phone">+1 (646) 555-8890</div>
                    <div style="font-size:10px;color:var(--ink-3);margin-top:2px;">Inferred name: Priya</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="ocr-confidence conf-med">● Med</div>
                    <div class="ocr-actions">
                      <button class="ocr-btn ocr-keep">Keep</button>
                      <button class="ocr-btn ocr-skip">Skip</button>
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top:14px;padding:12px;background:var(--green-pale);border-radius:var(--r-md);display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;color:#0A8B5E;font-weight:600;">3 numbers ready to import</span>
                <button style="background:var(--green);color:white;border:none;padding:8px 16px;border-radius:var(--r-full);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-ui);">Import All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURE 2: PERSONALIZATION -->
    <section class="section" style="background: var(--bg-2);">
      <div class="container">
        <div class="feature-row reverse">
          <div class="feature-visual reveal">
            <div class="feature-visual-header">
              <div class="fv-dot"></div>
              <div class="fv-title">Message Preview — 89 contacts</div>
            </div>
            <div class="preview-msgs">
              <div class="preview-msg">
                <div class="pm-contact">
                  <div class="pm-avatar" style="background:#E0EAFF;color:#1352F0;">MJ</div>
                  <div class="pm-name">Maria Johnson</div>
                </div>
                <div class="pm-text">"Hey Maria! Those new Adidas Ultraboosts just landed — the exact style you've been eyeing. Come check them out this week! 👟"</div>
                <div class="pm-chars">✓ 143 chars · personalized from interests: Adidas, running</div>
              </div>
              <div class="preview-msg">
                <div class="pm-contact">
                  <div class="pm-avatar" style="background:#E8FAF3;color:#0DBA7F;">SC</div>
                  <div class="pm-name">Sarah Chen</div>
                </div>
                <div class="pm-text">"Sarah! Those gold hoop earrings similar to the ones you loved? Back in — different finish, just as beautiful. ✨"</div>
                <div class="pm-chars">✓ 128 chars · personalized from interests: gold jewelry, earrings</div>
              </div>
              <div class="preview-msg">
                <div class="pm-contact">
                  <div class="pm-avatar" style="background:#FFF3EF;color:#FF5C35;">MW</div>
                  <div class="pm-name">Marcus Williams</div>
                </div>
                <div class="pm-text">"Marcus! The limited-edition Jordans you asked about last month? They're here. Size 10 with your name on it. 🏀"</div>
                <div class="pm-chars">✓ 131 chars · personalized from: prev inquiry + interests</div>
              </div>
            </div>
            <div style="padding:0 20px 16px;display:flex;gap:10px;">
              <button style="flex:1;padding:11px;border-radius:var(--r-full);background:var(--orange);color:white;font-weight:700;font-size:14px;border:none;cursor:pointer;font-family:var(--font-ui);">Send to All 89 →</button>
              <button style="padding:11px 20px;border-radius:var(--r-full);background:var(--surface-alt);color:var(--ink-2);font-weight:600;font-size:14px;border:1px solid var(--border);cursor:pointer;font-family:var(--font-ui);">Regenerate</button>
            </div>
          </div>
          <div class="feature-content reveal reveal-delay-2">
            <div class="section-eyebrow">Personal At Scale</div>
            <h2 class="section-title">Your personality, multiplied across <em>everyone</em> who loves your shop.</h2>
            <p class="section-sub">Write one message template. We write 500 unique versions — each one referencing what that specific customer loves, from their past visits and known preferences.</p>
            <div style="margin-top:24px;padding:20px;background:var(--orange-pale);border-radius:var(--r-lg);border:1px solid rgba(255,92,53,.15);">
              <div style="font-size:13px;font-weight:700;color:var(--orange-dark);margin-bottom:8px;">The "Weakness" feature</div>
              <div style="font-size:13px;color:var(--ink-2);line-height:1.6;">Every customer has something they can't resist. Record it once — their brand, their style, their price point — and every message we write for them leads with it.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURE 3: CONVERSATIONS -->
    <section class="section">
      <div class="container">
        <div class="feature-row">
          <div class="feature-content reveal">
            <div class="section-eyebrow">Never Miss a Lead</div>
            <h2 class="section-title">Replies that turn into sales. Calls that get answered.</h2>
            <p class="section-sub">When a customer replies, we know instantly if it's a lead. Laura — your always-on voice assistant — answers every call, knows who's calling, and loops you in when it matters.</p>
            <div style="margin-top:28px;display:flex;gap:16px;flex-wrap:wrap;">
              <div style="padding:14px 18px;background:var(--blue-pale);border-radius:var(--r-md);border:1px solid var(--border);">
                <div style="font-size:12px;color:var(--blue);font-weight:700;margin-bottom:4px;">🟢 Lead detected</div>
                <div style="font-size:13px;color:var(--ink-2);">You get a notification the second a customer shows buying intent</div>
              </div>
              <div style="padding:14px 18px;background:var(--green-pale);border-radius:var(--r-md);border:1px solid rgba(13,186,127,.2);">
                <div style="font-size:12px;color:var(--green);font-weight:700;margin-bottom:4px;">📞 Laura answers</div>
                <div style="font-size:13px;color:var(--ink-2);">Every inbound call handled within 2 rings, with your customer's full history</div>
              </div>
            </div>
          </div>
          <div class="feature-visual reveal reveal-delay-2">
            <div class="feature-visual-header">
              <div class="fv-dot"></div>
              <div class="fv-title">Live Inbox — Sarah Chen</div>
            </div>
            <div class="inbox-thread">
              <div class="it-msg out">
                <div class="it-bubble out">Hey Sarah! The gold hoops you loved? They're back — different finish, just as stunning ✨</div>
              </div>
              <div style="text-align:center;font-size:10px;color:var(--ink-3);padding:2px 0;">4 minutes later</div>
              <div class="it-msg">
                <div class="it-bubble in">Omg! Do you have them in store right now? Can I come tomorrow?</div>
              </div>
              <div style="display:flex;justify-content:center;">
                <div class="it-badge it-lead">🔥 Hot lead detected</div>
              </div>
              <div class="it-msg out">
                <div class="it-bubble out" style="font-size:11px;opacity:.85;font-style:italic;">Draft: "Yes! Set aside a pair for you. We're open 10am-7pm tomorrow. See you then!"</div>
              </div>
            </div>
            <div class="it-actions">
              <div class="it-btn it-send">Send reply ✓</div>
              <div class="it-btn it-close">Edit first</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section" id="how-it-works" style="background:var(--bg-2);">
      <div class="container">
        <div class="text-center reveal">
          <div class="section-eyebrow">Three steps</div>
          <h2 class="section-title">Set it up once.<br>It runs while you're on the floor.</h2>
          <p class="section-sub" style="margin:0 auto;">Setup takes under 5 minutes. After that, everything runs on its own.</p>
        </div>
        <div class="how-grid">
          <div class="how-card reveal reveal-delay-1">
            <div class="how-num">01</div>
            <div class="how-icon">📲</div>
            <div class="how-title">Import your contacts</div>
            <div class="how-desc">Scan a photo, upload your POS export, or link your Square account directly. Your contacts are ready in under 60 seconds.</div>
          </div>
          <div class="how-card reveal reveal-delay-2">
            <div class="how-num">02</div>
            <div class="how-icon">✍️</div>
            <div class="how-title">Write once, personalize always</div>
            <div class="how-desc">Type one message. We write a unique version for every person on your list, referencing their specific tastes and history with you.</div>
          </div>
          <div class="how-card reveal reveal-delay-3">
            <div class="how-num">03</div>
            <div class="how-icon">💬</div>
            <div class="how-title">Replies become sales</div>
            <div class="how-desc">Hot leads get flagged immediately. Laura handles calls 24/7. You step in only when a sale needs closing. The rest runs itself.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section">
      <div class="container">
        <div class="text-center reveal">
          <div class="section-eyebrow">From the floor</div>
          <h2 class="section-title">Shop owners, <em>in their words.</em></h2>
        </div>
        <div class="testimonial-grid">
          <div class="t-card reveal reveal-delay-1">
            <div class="t-stars">★★★★★</div>
            <div class="t-quote">"I was paying Twilio almost $90 a month to send texts nobody replied to. First week on 167Call, Maria — a customer I hadn't seen in three months — came in and spent $340."</div>
            <div class="t-person">
              <div class="t-avatar" style="background:#E0EAFF;color:#1352F0;">DP</div>
              <div>
                <div class="t-name">David Park</div>
                <div class="t-biz">Park's Electronics, Houston TX</div>
              </div>
            </div>
          </div>
          <div class="t-card reveal reveal-delay-2">
            <div class="t-stars">★★★★★</div>
            <div class="t-quote">"We don't have virtual numbers in Nigeria. I was stuck. 167Call turned my own Android into a gateway. Now I text 200 customers a week with zero fees."</div>
            <div class="t-person">
              <div class="t-avatar" style="background:#E8FAF3;color:#0DBA7F;">AO</div>
              <div>
                <div class="t-name">Adebayo Okafor</div>
                <div class="t-biz">Adebayo Fashion, Lagos</div>
              </div>
            </div>
          </div>
          <div class="t-card reveal reveal-delay-3">
            <div class="t-stars">★★★★★</div>
            <div class="t-quote">"Laura answered a call at 11pm from my best customer asking about a leather bag. She handled the whole thing and the customer came in the next day. I was asleep."</div>
            <div class="t-person">
              <div class="t-avatar" style="background:#FFF3EF;color:#FF5C35;">RK</div>
              <div>
                <div class="t-name">Rina Kim</div>
                <div class="t-biz">Fifth Ave Leathers, New York</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="section" id="pricing" style="background:var(--bg-2);">
      <div class="container">
        <div class="text-center reveal">
          <div class="section-eyebrow">Pricing</div>
          <h2 class="section-title">Pay for conversations. Not for infrastructure.</h2>
          <p class="section-sub" style="margin:0 auto;">No per-message fees. Ever. The price you see is the full price.</p>
        </div>
        <div class="pricing-grid">
          <div class="price-card reveal reveal-delay-1">
            <div class="price-tier">Free</div>
            <div class="price-amount">$0</div>
            <div class="price-mo">forever</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>200 messages/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>1 Android gateway</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>Basic contacts &amp; import</div>
            <a href="#" class="price-cta outline">Get started</a>
          </div>
          <div class="price-card reveal reveal-delay-2">
            <div class="price-tier">Boutique</div>
            <div class="price-amount">$29</div>
            <div class="price-mo">/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>3,000 messages/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>Personalized messages</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>Weakness profiles</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>Reply intelligence</div>
            <a href="#" class="price-cta outline">Start free trial</a>
          </div>
          <div class="price-card featured reveal reveal-delay-3">
            <div class="price-badge">Most popular</div>
            <div class="price-tier">Shop</div>
            <div class="price-amount">$79</div>
            <div class="price-mo">/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="rgba(255,255,255,.8)" stroke-width="1.75" stroke-linecap="round"></path></svg>10,000 messages/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="rgba(255,255,255,.8)" stroke-width="1.75" stroke-linecap="round"></path></svg>3 Android gateways</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="rgba(255,255,255,.8)" stroke-width="1.75" stroke-linecap="round"></path></svg>Laura voice (100 min)</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="rgba(255,255,255,.8)" stroke-width="1.75" stroke-linecap="round"></path></svg>Promo codes + tracking</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="rgba(255,255,255,.8)" stroke-width="1.75" stroke-linecap="round"></path></svg>Priority support</div>
            <a href="#" class="price-cta solid">Start free trial</a>
          </div>
          <div class="price-card reveal reveal-delay-4">
            <div class="price-tier">Chain</div>
            <div class="price-amount">$199</div>
            <div class="price-mo">/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>30,000 messages/month</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>10 gateway devices</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>Laura voice (500 min)</div>
            <div class="price-feature"><svg class="price-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#0DBA7F" stroke-width="1.75" stroke-linecap="round"></path></svg>Multi-location dashboard</div>
            <a href="#" class="price-cta outline">Contact us</a>
          </div>
        </div>
        <p style="text-align:center;margin-top:32px;font-size:14px;color:var(--ink-3);">All plans include a 14-day free trial · Cancel anytime · No per-message fees, ever</p>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="section">
      <div class="container">
        <div class="cta-section reveal">
          <h2>Start texting like your customers'<br>favorite shopkeeper.</h2>
          <p>Set up in 5 minutes. First campaign in 10.</p>
          <div class="cta-actions">
            <NuxtLink to="/login" class="btn-white">Create your free account</NuxtLink>
            <a href="#how-it-works" class="btn-outline-white">See how it works</a>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <div class="container">
        <div class="footer-inner">
          <div>
            <div class="footer-logo">
              <div class="footer-logo-mark">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="2" rx="1" fill="white"></rect><rect x="2" y="7" width="7" height="2" rx="1" fill="rgba(255,255,255,.5)"></rect><circle cx="11" cy="11" r="2" fill="#FF5C35"></circle></svg>
              </div>
              <div class="footer-logo-text">167Call</div>
            </div>
            <div class="footer-tagline">The personal touch at scale. Built for shops that treat every customer like a regular.</div>
          </div>
          <div class="footer-col">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">How It Works</a>
            <a href="#">Integrations</a>
          </div>
          <div class="footer-col">
            <h4>For Shops</h4>
            <a href="#">CellSmart Import</a>
            <a href="#">Square Sync</a>
            <a href="#">Voice Setup</a>
            <a href="#">Templates</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
            <a href="#">Developers</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 167Call. All rights reserved.</span>
          <div class="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">TCPA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const navBoxShadow = ref('none')
const mobileMenuOpen = ref(false)
const phoneTransform = ref('perspective(1000px) rotateY(-8deg) rotateX(3deg)')

onMounted(() => {
  // Intersection Observer — reveal animations
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.target || '0');
      const duration = 1800;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // Scroll events
  window.addEventListener('scroll', () => {
    navBoxShadow.value = window.scrollY > 20 ? '0 1px 20px rgba(19,82,240,.08)' : 'none'

    const scrolled = window.scrollY;
    const rotate = Math.max(-8, -8 + scrolled * 0.01);
    phoneTransform.value = `perspective(1000px) rotateY(${rotate}deg) rotateX(${3 - scrolled * 0.002}deg)`
  }, { passive: true });
})

definePageMeta({
  layout: false
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

.landing-page {
  --bg: #EEF4FF;
  --bg-2: #F5F9FF;
  --surface: #FFFFFF;
  --surface-alt: #F0F5FF;
  --blue: #1352F0;
  --blue-mid: #3B73FF;
  --blue-dark: #0B3BBF;
  --blue-pale: #E0EAFF;
  --orange: #FF5C35;
  --orange-dark: #E0401B;
  --orange-pale: #FFF3EF;
  --green: #0DBA7F;
  --green-pale: #E8FAF3;
  --cyan: #00B4D8;
  --ink: #08091A;
  --ink-2: #3D4561;
  --ink-3: #8A91AB;
  --border: rgba(19,82,240,.1);
  --border-strong: rgba(19,82,240,.2);
  --font-d: 'Fraunces', Georgia, serif;
  --font-ui: 'Plus Jakarta Sans', system-ui, sans-serif;
  --r-sm: 8px; --r-md: 16px; --r-lg: 24px; --r-xl: 32px; --r-full: 9999px;

  font-family: var(--font-ui);
  background: var(--bg);
  color: var(--ink);
  line-height: 1.6;
}

.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section { padding: 96px 0; }

nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 24px;
  height: 64px;
  display: flex; align-items: center;
  background: rgba(238,244,255,.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
  transition: all .3s ease;
}
.nav-inner { max-width: 1200px; width: 100%; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
.logo {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-ui); font-weight: 700; font-size: 20px; letter-spacing: -.4px; color: var(--ink);
}
.logo-mark {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg, var(--blue) 0%, #0B6FFF 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.logo-mark::before {
  content: ''; position: absolute;
  width: 16px; height: 2.5px; background: white; border-radius: 2px;
  top: 9px; left: 9px;
}
.logo-mark::after {
  content: ''; position: absolute;
  width: 10px; height: 2.5px; background: rgba(255,255,255,.6); border-radius: 2px;
  top: 14px; left: 9px;
}
.logo-signal {
  position: absolute; bottom: 8px; right: 8px;
  width: 7px; height: 7px; background: var(--orange); border-radius: 50%;
}
.nav-links { display: flex; align-items: center; gap: 32px; }
.nav-links a { font-size: 14px; font-weight: 500; color: var(--ink-2); transition: color .2s; }
.nav-links a:hover { color: var(--blue); }
.nav-cta {
  background: var(--orange); color: white;
  padding: 9px 20px; border-radius: var(--r-full);
  font-size: 14px; font-weight: 600; letter-spacing: -.1px;
  transition: background .2s, transform .15s, box-shadow .2s;
  box-shadow: 0 2px 12px rgba(255,92,53,.3);
}
.nav-cta:hover { background: var(--orange-dark); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,92,53,.4); }
.nav-menu-btn { display: none; background: none; padding: 8px; }
.nav-menu-btn span { display: block; width: 22px; height: 2px; background: var(--ink); border-radius: 2px; transition: all .2s; }
.nav-menu-btn span + span { margin-top: 5px; }

.hero {
  padding: 148px 0 80px;
  position: relative; overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(19,82,240,.06) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 10% 80%, rgba(0,180,216,.05) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--blue-pale); color: var(--blue);
  padding: 6px 14px; border-radius: var(--r-full);
  font-size: 13px; font-weight: 600; letter-spacing: .3px;
  margin-bottom: 24px;
}
.hero-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
.hero h1 {
  font-family: var(--font-d);
  font-size: clamp(38px, 5.5vw, 66px);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -.03em;
  color: var(--ink);
  margin-bottom: 24px;
}
.hero h1 em {
  font-style: italic;
  background: linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: clamp(16px, 1.8vw, 19px);
  color: var(--ink-2); line-height: 1.65; max-width: 480px;
  margin-bottom: 36px;
}
.hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.btn-primary {
  background: var(--orange); color: white;
  padding: 14px 28px; border-radius: var(--r-full);
  font-size: 16px; font-weight: 700; letter-spacing: -.15px;
  transition: all .2s; box-shadow: 0 4px 20px rgba(255,92,53,.35);
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-primary:hover { background: var(--orange-dark); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,92,53,.45); }
.btn-ghost {
  color: var(--ink-2); font-size: 15px; font-weight: 500;
  display: inline-flex; align-items: center; gap: 6px;
  transition: color .2s;
}
.btn-ghost:hover { color: var(--blue); }
.hero-note { margin-top: 20px; font-size: 13px; color: var(--ink-3); display: flex; align-items: center; gap: 6px; }
.hero-note-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); }

.phone-wrap {
  display: flex; justify-content: center; align-items: center;
  position: relative;
}
.phone-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(ellipse, rgba(19,82,240,.15) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
}
.phone-frame {
  width: 280px;
  background: var(--ink);
  border-radius: 44px;
  padding: 12px;
  box-shadow: 0 40px 80px rgba(8,9,26,.3), 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 2px rgba(255,255,255,.04);
  position: relative; z-index: 1;
  transition: transform .5s ease;
}
.phone-screen {
  background: var(--bg);
  border-radius: 34px;
  overflow: hidden;
  height: 520px;
  position: relative;
}
.phone-bar {
  background: var(--blue);
  padding: 14px 16px 12px;
  color: white;
}
.phone-bar-top { display: flex; justify-content: space-between; align-items: center; font-size: 11px; opacity: .8; margin-bottom: 10px; }
.phone-bar-title { font-weight: 700; font-size: 15px; }
.phone-bar-sub { font-size: 11px; opacity: .75; margin-top: 2px; }
.campaign-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.18); border-radius: var(--r-full);
  padding: 4px 10px; font-size: 11px; margin-top: 8px;
}
.phone-contacts { padding: 0; }
.contact-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: white;
}
.contact-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.contact-info { flex: 1; min-width: 0; }
.contact-name { font-size: 12px; font-weight: 600; color: var(--ink); }
.contact-msg { font-size: 11px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.status-sent { display: flex; align-items: center; gap: 3px; font-size: 10px; color: var(--green); font-weight: 600; }
.status-pending { font-size: 10px; color: var(--ink-3); }
.phone-footer {
  background: white; border-top: 1px solid var(--border);
  padding: 10px 14px;
  display: flex; justify-content: space-between; align-items: center;
  position: absolute; bottom: 0; left: 0; right: 0;
}
.phone-stat { text-align: center; }
.phone-stat-n { font-size: 15px; font-weight: 700; color: var(--green); }
.phone-stat-l { font-size: 9px; color: var(--ink-3); margin-top: 1px; }
.phone-home-bar {
  width: 100px; height: 4px; background: var(--ink);
  border-radius: var(--r-full); margin: 6px auto 0;
  opacity: .2;
}

.hero-float {
  position: absolute; background: white;
  border-radius: var(--r-md); padding: 10px 14px;
  box-shadow: 0 8px 32px rgba(8,9,26,.12);
  border: 1px solid var(--border);
  font-size: 12px;
  animation: float 3s ease-in-out infinite;
  z-index: 2;
}
.hero-float-1 { left: -20px; top: 30%; animation-delay: 0s; }
.hero-float-2 { right: -20px; bottom: 25%; animation-delay: 1.5s; }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.hf-label { color: var(--ink-3); font-size: 10px; margin-bottom: 4px; }
.hf-value { font-weight: 700; color: var(--ink); font-size: 14px; }
.hf-green { color: var(--green); }
.hf-orange { color: var(--orange); }

.stats-bar {
  background: white; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 28px 0;
}
.stats-inner { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; }
.stat-item {
  text-align: center; padding: 12px 40px;
  border-right: 1px solid var(--border);
}
.stat-item:last-child { border-right: none; }
.stat-n { font-size: clamp(22px, 3vw, 32px); font-weight: 700; color: var(--ink); letter-spacing: -.03em; font-family: var(--font-d); }
.stat-n span { color: var(--blue); }
.stat-l { font-size: 13px; color: var(--ink-3); margin-top: 3px; }

.section-eyebrow {
  display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
  color: var(--blue); background: var(--blue-pale); padding: 5px 12px; border-radius: var(--r-full);
  margin-bottom: 16px;
}
.section-title {
  font-family: var(--font-d); font-size: clamp(28px, 4vw, 48px);
  font-weight: 700; letter-spacing: -.03em; line-height: 1.1;
  color: var(--ink); margin-bottom: 16px;
}
.section-title em { font-style: italic; color: var(--blue); }
.section-sub { font-size: clamp(15px, 1.8vw, 18px); color: var(--ink-2); line-height: 1.65; max-width: 540px; }

.problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 56px; }
.problem-card {
  background: white; border-radius: var(--r-xl); padding: 32px;
  border: 1px solid var(--border);
  transition: transform .3s, box-shadow .3s;
}
.problem-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(19,82,240,.08); }
.problem-card.bad { border-color: rgba(255,92,53,.2); background: #FFFBFA; }
.problem-card.good { border-color: rgba(13,186,127,.2); background: #F6FEFB; }
.pc-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  padding: 4px 10px; border-radius: var(--r-full); margin-bottom: 20px;
}
.pc-tag.bad { background: rgba(255,92,53,.12); color: #C0361A; }
.pc-tag.good { background: rgba(13,186,127,.12); color: #0A8B5E; }
.pc-rate { font-family: var(--font-d); font-size: 48px; font-weight: 900; line-height: 1; margin-bottom: 6px; }
.pc-rate.bad { color: #E04020; }
.pc-rate.good { color: var(--green); }
.pc-desc { font-size: 13px; color: var(--ink-3); margin-bottom: 20px; }
.message-bubble {
  border-radius: 16px; padding: 12px 16px; font-size: 13px; line-height: 1.5;
  margin-bottom: 8px; max-width: 90%;
}
.bubble-generic { background: #F0F0F0; color: var(--ink-2); border-radius: 16px 16px 16px 4px; }
.bubble-personal { background: var(--blue); color: white; border-radius: 16px 16px 4px 16px; margin-left: auto; }
.bubble-personal strong { display: block; font-size: 11px; opacity: .75; margin-bottom: 4px; }

.feature-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  padding: 80px 0;
}
.feature-row.reverse { direction: rtl; }
.feature-row.reverse > * { direction: ltr; }
.feature-content { max-width: 480px; }
.feature-visual {
  background: white; border-radius: var(--r-xl);
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(19,82,240,.07);
}
.feature-visual-header {
  background: var(--blue); color: white;
  padding: 16px 20px;
  display: flex; align-items: center; gap: 10px;
}
.fv-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.3); }
.fv-title { font-size: 13px; font-weight: 600; }

.ocr-visual { padding: 24px; }
.ocr-scan-area {
  border: 2px dashed var(--border-strong); border-radius: var(--r-lg);
  height: 120px; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; margin-bottom: 16px;
  background: var(--surface-alt);
}
.scan-line {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--blue), transparent);
  animation: scan 2s ease-in-out infinite;
}
@keyframes scan { 0%,100% { top: 10%; } 50% { top: 90%; } }
.scan-label { font-size: 12px; color: var(--ink-3); text-align: center; }
.scan-label strong { display: block; color: var(--blue); font-weight: 600; font-size: 13px; margin-bottom: 4px; }
.ocr-results { display: flex; flex-direction: column; gap: 8px; }
.ocr-result-item {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface-alt); border-radius: var(--r-sm);
  padding: 10px 14px;
  border: 1px solid var(--border);
}
.ocr-phone { font-size: 13px; font-weight: 600; color: var(--ink); font-family: monospace; }
.ocr-confidence {
  display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600;
}
.conf-high { color: var(--green); }
.conf-med { color: #F59E0B; }
.ocr-actions { display: flex; gap: 6px; }
.ocr-btn {
  padding: 4px 10px; border-radius: var(--r-full); font-size: 11px; font-weight: 600;
}
.ocr-keep { background: var(--green-pale); color: #0A8B5E; border: 1px solid rgba(13,186,127,.3); }
.ocr-skip { background: var(--orange-pale); color: #C0361A; border: 1px solid rgba(255,92,53,.2); }

.preview-msgs { display: flex; flex-direction: column; gap: 10px; padding: 20px; }
.preview-msg { background: var(--surface-alt); border-radius: var(--r-md); padding: 14px; border: 1px solid var(--border); }
.pm-contact { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.pm-avatar { width: 26px; height: 26px; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.pm-name { font-size: 12px; font-weight: 600; color: var(--ink); }
.pm-text { font-size: 12px; color: var(--ink-2); line-height: 1.5; }
.pm-chars { font-size: 10px; color: var(--green); font-weight: 600; margin-top: 6px; }

.inbox-thread { display: flex; flex-direction: column; gap: 8px; padding: 16px 20px; }
.it-msg { display: flex; gap: 8px; align-items: flex-end; }
.it-msg.out { flex-direction: row-reverse; }
.it-bubble {
  max-width: 80%; border-radius: 14px; padding: 10px 14px; font-size: 12px; line-height: 1.5;
}
.it-bubble.in { background: var(--surface-alt); color: var(--ink); border-radius: 14px 14px 14px 4px; }
.it-bubble.out { background: var(--blue); color: white; border-radius: 14px 14px 4px 14px; }
.it-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: var(--r-full); font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  align-self: center; margin: 4px 0;
}
.it-lead { background: rgba(13,186,127,.12); color: #0A8B5E; }
.it-actions { display: flex; gap: 8px; padding: 0 20px 16px; }
.it-btn {
  flex: 1; padding: 10px; border-radius: var(--r-md);
  font-size: 12px; font-weight: 600; text-align: center;
}
.it-send { background: var(--blue); color: white; }
.it-close { background: var(--surface-alt); color: var(--ink-2); border: 1px solid var(--border); }

.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
.how-card {
  background: white; border-radius: var(--r-xl); padding: 36px 28px;
  border: 1px solid var(--border); position: relative; overflow: hidden;
  transition: transform .3s, box-shadow .3s;
}
.how-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(19,82,240,.1); }
.how-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
}
.how-card:nth-child(1)::before { background: var(--blue); }
.how-card:nth-child(2)::before { background: var(--orange); }
.how-card:nth-child(3)::before { background: var(--green); }
.how-num {
  font-family: var(--font-d); font-size: 64px; font-weight: 900; line-height: 1;
  letter-spacing: -.05em; margin-bottom: 16px; opacity: .07; color: var(--ink);
  position: absolute; top: 20px; right: 24px;
}
.how-icon { font-size: 28px; margin-bottom: 16px; }
.how-title { font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 10px; letter-spacing: -.02em; }
.how-desc { font-size: 14px; color: var(--ink-2); line-height: 1.6; }

.pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 56px; }
.price-card {
  background: white; border-radius: var(--r-xl); padding: 28px 24px;
  border: 1px solid var(--border);
  transition: transform .3s, box-shadow .3s;
  position: relative;
}
.price-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(19,82,240,.1); }
.price-card.featured {
  background: var(--blue); border-color: var(--blue);
  transform: scale(1.03);
  box-shadow: 0 20px 60px rgba(19,82,240,.35);
}
.price-badge {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: var(--orange); color: white;
  font-size: 11px; font-weight: 700; padding: 4px 12px;
  border-radius: var(--r-full); white-space: nowrap;
}
.price-tier { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 12px; color: var(--ink-3); }
.price-card.featured .price-tier { color: rgba(255,255,255,.7); }
.price-amount { font-family: var(--font-d); font-size: 36px; font-weight: 800; letter-spacing: -.03em; color: var(--ink); margin-bottom: 4px; }
.price-card.featured .price-amount { color: white; }
.price-mo { font-size: 14px; color: var(--ink-3); margin-bottom: 20px; }
.price-card.featured .price-mo { color: rgba(255,255,255,.6); }
.price-feature { font-size: 13px; color: var(--ink-2); margin-bottom: 10px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
.price-card.featured .price-feature { color: rgba(255,255,255,.85); }
.price-check { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
.price-cta {
  display: block; text-align: center; padding: 11px; border-radius: var(--r-full);
  font-size: 14px; font-weight: 700; margin-top: 24px; transition: all .2s;
}
.price-cta.outline { border: 1.5px solid var(--border-strong); color: var(--ink); background: transparent; }
.price-cta.solid { background: white; color: var(--blue); }

.testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
.t-card {
  background: white; border-radius: var(--r-xl); padding: 28px;
  border: 1px solid var(--border);
}
.t-stars { color: #F59E0B; font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
.t-quote { font-size: 14px; color: var(--ink-2); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
.t-person { display: flex; align-items: center; gap: 10px; }
.t-avatar { width: 36px; height: 36px; border-radius: 50%; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.t-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.t-biz { font-size: 12px; color: var(--ink-3); }

.cta-section {
  background: linear-gradient(135deg, var(--blue) 0%, #0B6FFF 60%, var(--cyan) 100%);
  border-radius: var(--r-xl); padding: 80px 64px; text-align: center;
  margin: 0 24px 80px; position: relative; overflow: hidden;
}
.cta-section h2 { font-family: var(--font-d); font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: white; margin-bottom: 16px; letter-spacing: -.03em; }
.cta-section p { font-size: 18px; color: rgba(255,255,255,.8); margin-bottom: 36px; }
.cta-actions { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
.btn-white { background: white; color: var(--blue); padding: 14px 32px; border-radius: var(--r-full); font-weight: 700; font-size: 16px; }
.btn-outline-white { color: white; padding: 14px 24px; border-radius: var(--r-full); font-weight: 600; font-size: 15px; border: 1.5px solid rgba(255,255,255,.4); }

footer {
  background: var(--ink); color: rgba(255,255,255,.7);
  padding: 64px 0 40px;
}
.footer-inner { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-logo-mark { width: 30px; height: 30px; background: var(--blue); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.footer-logo-text { font-weight: 700; font-size: 17px; color: white; }
.footer-tagline { font-size: 13px; line-height: 1.6; max-width: 200px; }
.footer-col h4 { font-size: 13px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 16px; }
.footer-col a { display: block; font-size: 13px; margin-bottom: 10px; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,.1); padding-top: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.footer-legal { display: flex; gap: 20px; }

.reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity .7s ease, transform .7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }
.reveal-delay-3 { transition-delay: .3s; }
.reveal-delay-4 { transition-delay: .4s; }

.divider { height: 1px; background: var(--border); }

@media (max-width: 960px) {
  .hero-inner { grid-template-columns: 1fr; gap: 48px; }
  .phone-wrap { display: none; }
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-menu-btn { display: flex; flex-direction: column; }
  .feature-row { grid-template-columns: 1fr; gap: 40px; }
  .feature-row.reverse { direction: ltr; }
  .how-grid { grid-template-columns: 1fr; }
  .testimonial-grid { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 640px) {
  .problem-grid { grid-template-columns: 1fr; }
  .cta-section { padding: 48px 28px; margin: 0 16px 64px; }
}
</style>