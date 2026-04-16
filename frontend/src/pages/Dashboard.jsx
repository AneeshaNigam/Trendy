import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Activity, Radio, Flame, AlertTriangle, Loader2,
  Search, ArrowRight, Zap, RefreshCw, TrendingUp,
  Sparkles, Info, Lightbulb, Users, X
} from 'lucide-react';
import { normalizeScore } from '../utils/normalizeScore';
import { useTranslation } from 'react-i18next';

// ─── Enriched fallback trends — full paragraph insights, specific ideas ──────
const FALLBACK_TRENDS = [
  {
    _id: 'f1', name: 'AI Healthcare Diagnostics', score: 9.4, category: 'HealthTech',
    explanation: 'AI diagnostic tools in radiology and pathology now match or exceed specialist accuracy, with the FDA clearing 700+ AI medical devices as of 2026.',
    aiInsight: 'The convergence of large multimodal models and clinical-grade labelled datasets has pushed AI diagnostic accuracy past the 95% threshold in several specialties. Major hospital systems — Cleveland Clinic, Mayo, Mass General — are now running AI-assisted reads on every scan. The next bottleneck is workflow integration, not model performance.',
    whyItMatters: 'The global medical imaging AI market will exceed $20B by 2028. Hospitals that standardize on AI-assisted diagnosis now will set clinical workflows that competitors must conform to — creating winner-take-most dynamics in each specialty vertical.',
    startupIdeas: ['AI radiologist co-pilot for community hospitals that lack specialist coverage — diagnostic AI-as-a-service on a per-read pricing model', 'Clinical AI audit and explainability platform helping hospitals prove to regulators that AI diagnoses are safe and traceable', 'Patient pre-screening app using conversational AI and phone camera imaging to triage before expensive specialist visits'],
    whoShouldCare: ['HealthTech founders', 'Medical device investors', 'Hospital CIOs', 'Digital health VCs'],
  },
  {
    _id: 'f2', name: 'Agentic AI Workflows', score: 9.1, category: 'AI & ML',
    explanation: 'Autonomous AI agents that plan, iterate, and take actions across multi-step enterprise tasks without human intervention are now production-ready.',
    aiInsight: 'The shift from single-turn LLM calls to persistent, memory-equipped agents is the most significant architectural change in enterprise software since SaaS. Teams at Salesforce, ServiceNow, and Workday are embedding agents into core workflows — replacing not just tasks but entire job functions. The agent orchestration layer is the most defensible position in the stack.',
    whyItMatters: 'Agentic AI creates a new category of software — autonomous, goal-directed systems that replace fixed-workflow automation. Every enterprise will need an agent strategy within 18 months, creating demand for tooling, monitoring, and reliability infrastructure that doesn\'t exist yet.',
    startupIdeas: ['No-code agent builder for business analysts — drag-and-drop workflow design that compiles to production-grade multi-agent systems without engineering', 'Agent reliability and observability platform — monitoring, replay debugging, and cost attribution for enterprise multi-agent deployments', 'Domain-specific legal and compliance agents — autonomous contract review, regulatory monitoring, and filing preparation for mid-market law firms'],
    whoShouldCare: ['AI product managers', 'Enterprise software founders', 'Venture investors', 'CTOs at Series B+ companies'],
  },
  {
    _id: 'f3', name: 'Climate Fintech', score: 8.9, category: 'Climate',
    explanation: 'Financial products built around carbon markets, ESG scoring infrastructure, and green lending are attracting significant institutional capital in 2026.',
    aiInsight: 'EU mandatory CSRD reporting requirements (live in 2026) are forcing 50,000+ companies to quantify carbon footprint with auditable precision for the first time. This creates immediate demand for structured carbon data, verification, and reporting automation. Voluntary carbon markets are simultaneously professionalizing — shifting from reputational plays to fungible financial assets with clearing infrastructure.',
    whyItMatters: 'CSRD compliance alone represents a multi-billion dollar addressable market in reporting software, data verification, and audit tooling. Companies building the plumbing for mandatory ESG data will be as defensible as credit bureaus within a decade.',
    startupIdeas: ['CSRD compliance automation for mid-market European companies — pre-built emissions calculation workflows, supplier data ingestion, and audit-ready report generation', 'Carbon credit integrity scoring API — ML-powered permanence and additionality verification for institutional buyers who need due diligence at scale', 'Green loan origination and monitoring platform for regional banks — automated ESG underwriting rules and post-disbursement impact tracking'],
    whoShouldCare: ['Climate tech founders', 'ESG strategists', 'VC funds with sustainability mandates', 'Financial regulators'],
  },
  {
    _id: 'f4', name: 'Synthetic Data Pipelines', score: 8.7, category: 'AI & ML',
    explanation: 'Programmatically generated synthetic datasets are unlocking model training in data-scarce and privacy-sensitive domains where real data collection is impossible.',
    aiInsight: 'GANs and diffusion-based synthetic data generation have crossed a quality threshold where benchmark results on synthetic data match real-data baselines in healthcare imaging, financial tabular data, and autonomous vehicle scenarios. NVIDIA, Gretel, and Scale AI have all shipped production-grade pipelines. The gap is now in domain-specific generation tooling for industries still waiting.',
    whyItMatters: 'AI project failure rates remain high in regulated industries because clean, labelled, privacy-compliant training data is unavailable or prohibitively expensive. Synthetic data removes the data bottleneck without legal liability — directly unlocking billions in AI investment that is currently stalled.',
    startupIdeas: ['Healthcare-specific synthetic patient record generator — FHIR-compliant, with configurable disease prevalence and demographic parameters for clinical AI training teams', 'Synthetic data quality validation service — automated statistical divergence testing that produces reports regulators and compliance teams will accept', 'Financial fraud scenario generation engine — rare-event synthesis for credit card fraud, AML, and insider trading detection model training'],
    whoShouldCare: ['AI/ML engineers', 'Regulated industry CTOs', 'Data privacy officers', 'AI product teams'],
  },
  {
    _id: 'f5', name: 'Embedded Finance Infrastructure', score: 8.4, category: 'Fintech',
    explanation: 'Banking, lending, and payments functionality is being composed into non-financial software via BaaS APIs, fundamentally reshaping how financial products reach users.',
    aiInsight: 'Shopify Capital has originated $5B+ in loans to merchants without a banking license. Gusto embeds payroll lending. Toast embeds restaurant financing. The playbook is proven: distribution advantage through captive software relationships eliminates customer acquisition costs traditional banks cannot match. The infrastructure enabling this — ledger-as-a-service, compliance APIs, instant account provisioning — is still fragmented.',
    whyItMatters: 'Every vertical SaaS company will eventually embed financial products because monetization per user from payments and lending dwarfs SaaS subscription economics by 3-5x. Infrastructure providers enabling this will become the plumbing for the entire software economy.',
    startupIdeas: ['Embedded B2B lending infrastructure for vertical SaaS platforms — plug-and-play revenue-based lending any SaaS product can offer to business customers in days', 'Real-time multi-currency ledger API for global marketplaces — sub-ledger management, FX conversion, and regulatory reporting in one SDK', 'Embedded finance compliance-as-a-service — automated KYC/AML, transaction monitoring, and SAR filing for tech companies without a compliance team'],
    whoShouldCare: ['Fintech founders', 'SaaS product leaders', 'Bank partnership teams', 'Payments VCs'],
  },
  {
    _id: 'f6', name: 'Personalized Learning AI', score: 8.1, category: 'EdTech',
    explanation: 'AI tutoring systems that adapt instruction in real-time to individual student knowledge state are demonstrating 2-3x learning efficiency improvements in controlled studies.',
    aiInsight: 'Khanmigo, Duolingo Max, and Synthesis have each demonstrated that large language models can serve as infinitely patient tutors adjusting Socratic questioning to exactly the student\'s current knowledge frontier. The bottleneck is no longer model capability — it\'s curriculum design, engagement UX, and outcome measurement. Corporate L&D buyers are moving fastest because they have clear ROI metrics and large budgets.',
    whyItMatters: 'The global EdTech market is $300B+ but most of it is digitized legacy content delivery, not true personalization. AI-native platforms that prove measurable learning outcomes will displace legacy LMS providers across both K-12 and corporate learning at speed.',
    startupIdeas: ['AI-powered professional certification prep platform — adaptive study plans, real-time concept gap diagnosis, and mock exam simulations for high-stakes certs (AWS, CPA, Bar exam)', 'Corporate onboarding and L&D AI — reduces time-to-productivity for new hires by 40% with role-specific adaptive training and skills gap analytics for HR teams', 'AI study partner for K-12 homework — Socratic tutoring that never gives answers directly but guides students to solutions, with parent progression dashboards'],
    whoShouldCare: ['EdTech founders', 'Corporate L&D leaders', 'HR tech product managers', 'Education investors'],
  },
  {
    _id: 'f7', name: 'Edge AI Inference', score: 7.9, category: 'AI & ML',
    explanation: 'Quantized language and vision models running locally on consumer and industrial hardware are enabling a new class of private, real-time, offline-capable AI applications.',
    aiInsight: 'Apple\'s Neural Engine, Qualcomm\'s NPU, and NVIDIA\'s Jetson series have made it economically viable to run GPT-4-class reasoning locally in 2026. MLX, llama.cpp, and GGUF format models have a thriving ecosystem. The architecture shift from cloud-to-edge eliminates three critical enterprise AI blockers: data privacy/GDPR compliance, latency for real-time applications, and connectivity requirements for field deployments.',
    whyItMatters: 'Healthcare, manufacturing, defense, and legal sectors have historically been unable to adopt cloud AI due to data sovereignty requirements. Edge inference removes this barrier, unlocking the largest and most under-served enterprise AI segments that have been waiting on the sidelines since 2022.',
    startupIdeas: ['Edge AI deployment platform for manufacturers — one-click model packaging and deployment to factory floor cameras and PLCs, with OTA update management', 'Privacy-first AI document intelligence for law firms — fully on-premise LLM analyzing confidential client documents without any data leaving the network', 'Offline-capable field operations AI for utilities and telcos — AI-powered fault diagnosis and repair guidance that works in basements, tunnels, and remote infrastructure'],
    whoShouldCare: ['Industrial IoT founders', 'Enterprise AI architects', 'Hardware platform engineers', 'Defense tech investors'],
  },
  {
    _id: 'f8', name: 'Creator Economy Infrastructure', score: 7.6, category: 'Business',
    explanation: 'Platforms enabling individual creators to build sustainable businesses through subscriptions, digital products, communities, and IP licensing are professionalizing rapidly.',
    aiInsight: 'MrBeast\'s Feastables and similar creator-brand ventures show that top creators are building media conglomerates, not just profiles. The majority of creators earning $100K+ report that platform tools are their biggest operational bottleneck — invoicing, taxes across jurisdictions, cross-platform analytics, and legal protection are all poorly served by existing products. The creator economy is fundamentally an SMB economy with unique distribution characteristics.',
    whyItMatters: 'Over 200M people globally identify as content creators with 2M+ earning primary income from it. The financial, legal, and analytical infrastructure serving this segment is designed for either individuals (too simple) or enterprises (too complex). The gap is a multi-billion dollar SMB market waiting for purpose-built tooling.',
    startupIdeas: ['Creator financial OS — business banking, invoicing, cross-border payments, quarterly tax estimation, and expense categorization purpose-built for creator income patterns', 'Cross-platform audience intelligence platform — unified analytics across YouTube, Instagram, TikTok, Substack, and Patreon with predictive churn detection and monetization optimization', 'Creator IP licensing and brand deal marketplace — AI-powered matching between creators and brands, with automated contract generation, rights management, and performance reporting'],
    whoShouldCare: ['Creator economy founders', 'Fintech product teams', 'Media executives', 'SMB-focused VCs'],
  },
  {
    _id: 'f9', name: 'B2B AI Sales Intelligence', score: 7.3, category: 'Business',
    explanation: 'AI systems that identify real-time buying intent signals, predict deal outcomes, and automate contextual outreach are becoming table stakes in enterprise revenue operations.',
    aiInsight: '6sense and Demandbase have proven that account-level intent data measurably improves pipeline quality, but the technology is still out of reach for mid-market companies. The next wave is predictive at the deal level — AI that reads CRM activity, call transcripts, email sentiment, and external signals to surface which deals will close before a rep\'s gut tells them. CROs are prioritizing this over headcount in every RevOps survey.',
    whyItMatters: 'The average enterprise sales cycle costs $15K-$50K in rep time per deal pursued. AI that cuts unwinnable deal entry and increases win rates on winnable ones generates ROI that directly shows up on the income statement — making it a board-level purchasing decision with short sales cycles.',
    startupIdeas: ['Deal intelligence copilot for mid-market CRMs — real-time win probability scoring based on CRM activity patterns, email engagement signals, and cross-industry benchmark data', 'AI SDR that qualifies inbound leads via multi-turn email/chat conversations and only hands off to human reps when qualification criteria are met', 'Competitive intelligence agent for sales teams — automated monitoring of competitor pricing, product changes, and win/loss patterns with daily briefings for account executives'],
    whoShouldCare: ['SaaS founders', 'Revenue Operations leaders', 'CROs', 'Sales-led growth VCs'],
  },
  {
    _id: 'f10', name: 'Mental Health Tech', score: 7.1, category: 'HealthTech',
    explanation: 'Digital mental health platforms — AI-assisted therapy, crisis detection tools, and employer EAP platforms — are seeing accelerating adoption and payer reimbursement in 2026.',
    aiInsight: 'The landmark 2025 CMS decision to expand telehealth mental health reimbursement codes permanently has catalyzed a land-grab among digital mental health providers. Spring Health and Lyra Health have each reached $1B+ valuations on employer benefit contracts alone. The next frontier is AI-augmented therapist productivity — tools that handle note-taking, homework tracking, and between-session support so therapists can manage 3x the caseload without burnout.',
    whyItMatters: '1 in 4 adults globally experiences a mental health condition annually, but the therapist shortage means wait times of 3-6 months in most markets. Technology that either expands therapist capacity or provides evidence-based support between sessions is the only scalable solution — and payers are now willing to pay.',
    startupIdeas: ['AI-powered therapist productivity platform — automated session notes using clinical NLP, homework assignment tracking, and crisis alert monitoring between sessions', 'Employer mental health benefits navigation tool — AI triage that matches employees to the right level of care (self-guided, coaching, therapy, psychiatry) based on symptom assessment', 'Evidence-based digital CBT companion for anxiety and depression — clinically validated exercises, mood tracking with pattern detection, and human escalation pathways for insurers'],
    whoShouldCare: ['HealthTech founders', 'HR benefits innovators', 'Insurance product teams', 'Mental health investors'],
  },
  {
    _id: 'f11', name: 'Supply Chain Visibility SaaS', score: 6.8, category: 'Business',
    explanation: 'Real-time supply chain visibility, predictive disruption detection, and supplier financial health monitoring platforms are becoming boardroom priorities after years of costly shocks.',
    aiInsight: 'The 2021-2023 supply chain crisis permanently elevated supply chain risk from an operations topic to a CFO and board priority. Gartner reports 90% of Fortune 500 procurement teams now have budget for supply chain analytics that didn\'t exist before 2020. Established players (E2open, Kinaxis) are expensive and complex, leaving a significant mid-market gap for focused vertical solutions.',
    whyItMatters: 'Supply chain disruptions cost global businesses $3.3T annually. Companies with real-time visibility into multi-tier supplier dependencies recover 4x faster from disruptions — a quantifiable ROI that justifies $100K-$500K annual software budgets without requiring procurement consensus.',
    startupIdeas: ['Supplier financial health monitoring service — real-time credit risk scoring for supplier networks using alternative data (payment behavior, news signals, tariff exposure) to flag single-source dependency risks early', 'Tariff impact modeling tool — real-time calculation of how proposed trade policy changes affect landed cost across a company\'s sourcing network, with scenario modeling', 'Supply chain carbon footprint tracker — Scope 3 emissions calculation across Tier 1 and Tier 2 suppliers using AI-based emission factor matching for CSRD and CDP reporting'],
    whoShouldCare: ['Supply chain leaders', 'Procurement VPs', 'Risk management functions', 'Manufacturing-focused investors'],
  },
  {
    _id: 'f12', name: 'Vertical AI SaaS', score: 6.5, category: 'AI & ML',
    explanation: 'AI-native software built for specific industries — construction, agriculture, legal, field services — consistently outperforms horizontal AI tools in head-to-head enterprise deals.',
    aiInsight: 'The horizontal tools (ChatGPT Enterprise, Microsoft Copilot) are winning mindshare but losing enterprise deals. Construction firms buying Procore AI, law firms buying Harvey, and agricultural operations buying Granular are each choosing domain-tuned AI with industry-specific data models over generic LLM wrappers. The win rate advantage of vertical AI in competitive evaluations is 3:1 in most sectors surveyed. Domain moats are building fast.',
    whyItMatters: 'Every industry vertical with $1B+ in existing software spend is vulnerable to an AI-native disruptor that understands their workflows, terminology, and data natively. The window to build these vertical moats is 2-3 years before horizontal tools close the gap with fine-tuning and domain-specific plugins.',
    startupIdeas: ['AI for multifamily real estate operations — lease abstraction, maintenance ticket triage, vendor invoice reconciliation, and NOI optimization recommendations for property management companies', 'Construction project intelligence platform — automated subcontractor bid analysis, schedule risk detection from RFI patterns, and cost-to-complete forecasting using historical project data', 'AI-native wealth management operations — automated client reporting, portfolio drift alerting, rebalancing recommendations, and compliance documentation for RIAs managing $100M-$1B'],
    whoShouldCare: ['Vertical SaaS founders', 'Industry operators turned founders', 'Sector-focused VCs', 'Enterprise software buyers'],
  },
];

const POPULAR_SEARCHES = ['AI agents', 'climate fintech', 'mental health tech', 'robotics automation', 'embedded finance', 'vertical AI'];

// ─── Status helpers ───────────────────────────────────────────────────────────
function getStatus(score) {
  if (score >= 8) return { label: 'Hot',     emoji: '🔥', cls: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' };
  if (score >= 6) return { label: 'Rising',   emoji: '📈', cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
  return           { label: 'Emerging', emoji: '🌱', cls: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' };
}

function relativeTime(date) {
  const ms  = Date.now() - new Date(date).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1)  return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)  return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// ─── Trend detail modal ───────────────────────────────────────────────────────
function TrendModal({ trend, onClose }) {
  const { t } = useTranslation();
  const score  = normalizeScore(trend.score);
  const status = getStatus(score);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between gap-4 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {trend.category && (
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-bold">{trend.category}</span>
              )}
              <span className={`px-2 py-0.5 rounded border text-xs font-bold ${status.cls}`}>{status.label} {status.emoji}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{trend.name}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> {score}/10
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Context */}
          {trend.explanation && (
            <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/60 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{trend.explanation}</p>
            </div>
          )}

          {/* AI Insight */}
          {trend.aiInsight && (
            <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-500/8 dark:to-orange-500/5 border border-amber-200/80 dark:border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</h3>
              </div>
              <p className="text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">{trend.aiInsight}</p>
            </section>
          )}

          {/* Why It Matters */}
          {(trend.whyItMatters || trend.whyMatters) && (
            <section className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200/80 dark:border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">{t('trends.why_matters')}</h3>
              </div>
              <p className="text-sm text-blue-900 dark:text-blue-200/90 leading-relaxed">{trend.whyItMatters || trend.whyMatters}</p>
            </section>
          )}

          {/* Startup Ideas */}
          {trend.startupIdeas?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.startup_ideas')}</h3>
              </div>
              <div className="space-y-2.5">
                {trend.startupIdeas.map((idea, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-xl p-4 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors">
                    <span className="text-lg font-extrabold text-gray-200 dark:text-slate-700 shrink-0 w-5">{i + 1}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{idea}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Who Should Care */}
          {trend.whoShouldCare?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.who_cares')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(trend.whoShouldCare) ? trend.whoShouldCare : [trend.whoShouldCare]).map((role, i) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">{role}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Clickable trend card — expanded body ─────────────────────────────────────
function TrendCard({ trend, onSelect }) {
  const { t } = useTranslation();
  const score  = normalizeScore(trend.score);
  const status = getStatus(score);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(trend)}
      onKeyDown={e => e.key === 'Enter' && onSelect(trend)}
      className="group bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-500/40"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/0 group-hover:bg-amber-400/5 dark:group-hover:bg-amber-500/5 rounded-full blur-[40px] transition-all duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {trend.category && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-[11px] font-bold">{trend.category}</span>
            )}
            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${status.cls}`}>{status.label} {status.emoji}</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug text-[15px]">{trend.name}</h3>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs font-bold shrink-0 ml-2">
          <TrendingUp className="w-3.5 h-3.5" />{score}
        </div>
      </div>

      {/* AI Insight — 3 lines */}
      <div className="mb-3 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
          {trend.aiInsight || trend.explanation || 'Trend intelligence being generated…'}
        </p>
      </div>

      {/* Why It Matters — 1 line teaser */}
      {(trend.whyItMatters || trend.whyMatters) && (
        <div className="mb-3 relative z-10">
          <div className="flex items-center gap-1.5 mb-1">
            <Info className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t('trends.why_matters')}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
            {trend.whyItMatters || trend.whyMatters}
          </p>
        </div>
      )}

      {/* Startup ideas count + CTA */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-3 mt-auto relative z-10">
        <div className="flex items-center gap-2">
          {trend.startupIdeas?.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-500/8 border border-amber-200/60 dark:border-amber-500/20 rounded-full text-[10px] font-bold text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-3 h-3" /> {trend.startupIdeas.length} ideas
            </span>
          )}
          {trend.whoShouldCare?.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-500/8 border border-purple-200/60 dark:border-purple-500/20 rounded-full text-[10px] font-bold text-purple-600 dark:text-purple-400">
              <Users className="w-3 h-3" /> {trend.whoShouldCare.length}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          {t('trends.click_insights')} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}

// ─── Live Signal Feed ─────────────────────────────────────────────────────────
async function fetchLiveSignals() {
  const results = [];
  try {
    const hn = await axios.get('https://hn.algolia.com/api/v1/search?query=AI+business+startup+innovation&tags=story&hitsPerPage=8', { timeout: 6000 });
    (hn.data?.hits || []).slice(0, 5).forEach(h => {
      if (h.title && h.points >= 5) results.push({ id: `hn-${h.objectID}`, text: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, metric: h.points, createdAt: h.created_at || new Date().toISOString(), hot: h.points > 100 });
    });
  } catch { /* silent */ }
  try {
    const rd = await axios.get('https://www.reddit.com/r/startups+entrepreneur+MachineLearning/hot.json?limit=8', { timeout: 6000, headers: { 'User-Agent': 'Trendy-App/1.0' } });
    (rd.data?.data?.children || []).slice(0, 4).forEach(c => {
      const p = c.data;
      if (p.title && p.ups > 10) results.push({ id: `rd-${p.id}`, text: p.title, url: `https://reddit.com${p.permalink}`, metric: p.ups, createdAt: new Date(p.created_utc * 1000).toISOString(), hot: p.ups > 500 });
    });
  } catch { /* silent */ }
  return results.filter(r => r.text?.length > 10).sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.metric - a.metric).slice(0, 8);
}

function SignalFeed({ navigate }) {
  const { t } = useTranslation();
  const [signals, setSignals]         = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newIds, setNewIds]           = useState(new Set());
  const prevIds = useRef(new Set());

  const load = useCallback(async () => {
    try {
      const fresh = await fetchLiveSignals();
      if (fresh.length > 0) {
        const incoming = new Set(fresh.map(s => s.id));
        const added    = new Set([...incoming].filter(id => !prevIds.current.has(id)));
        prevIds.current = incoming;
        setNewIds(added);
        setSignals(fresh);
        setLastUpdated(new Date());
        setTimeout(() => setNewIds(new Set()), 3000);
      }
    } catch { /* silent */ }
    setFeedLoading(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 45000); return () => clearInterval(t); }, [load]);

  return (
    <div className="bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-800 rounded-xl p-5 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-500" /> {t('dashboard.live_feed')}
        </h2>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-[10px] text-gray-400 dark:text-gray-500">{relativeTime(lastUpdated)}</span>}
          <button onClick={load} title="Refresh" className="p-1 text-gray-400 hover:text-amber-500 transition-colors rounded">
            <RefreshCw className={`w-3.5 h-3.5 ${feedLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {feedLoading && signals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8">
          <Loader2 className="w-5 h-5 animate-spin text-gray-300 dark:text-gray-600" />
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('dashboard.fetching')}</p>
        </div>
      ) : signals.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">{t('dashboard.no_signals')}</p>
      ) : (
        <ul className="space-y-3 relative before:absolute before:left-2 before:-translate-x-px before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-slate-700 before:to-transparent">
          {signals.map(signal => (
            <li key={signal.id} className={`relative pl-6 transition-all duration-500 ${newIds.has(signal.id) ? 'animate-pulse' : ''}`}>
              <span className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ring-2 ring-gray-50 dark:ring-[#0f1115] ${signal.hot ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'bg-gray-300 dark:bg-slate-600'}`} />
              <a href={signal.url} target="_blank" rel="noopener noreferrer" className="block group/link">
                <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 group-hover/link:text-amber-600 dark:group-hover/link:text-amber-400 transition-colors leading-snug line-clamp-2">{signal.text}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{signal.metric >= 1000 ? `${(signal.metric / 1000).toFixed(1)}k` : signal.metric} {t('dashboard.engagement')}</span>
                  <span className="text-[11px] text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{relativeTime(signal.createdAt)}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/trends')} className="w-full mt-5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all">
        {t('dashboard.search_trends')}
      </button>
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t } = useTranslation();
  const [trends, setTrends]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trends', { withCredentials: true });
        const apiTrends = (res.data.trends || []).map(t => ({ ...t, score: normalizeScore(t.score) })).filter(t => t.name !== 'General Tech News');
        setTrends(apiTrends.length > 0 ? apiTrends : FALLBACK_TRENDS);
      } catch (err) {
        console.warn('Dashboard API unavailable:', err.message);
        setTrends(FALLBACK_TRENDS);
        setError(t('dashboard.api_error'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted   = [...trends].sort((a, b) => b.score - a.score);
  const top3     = sorted.slice(0, 3);
  const rest     = sorted.slice(3);
  const hot      = trends.filter(t => normalizeScore(t.score) >= 8);
  const rising   = trends.filter(t => { const s = normalizeScore(t.score); return s >= 6 && s < 8; });
  const emerging = trends.filter(t => normalizeScore(t.score) < 6);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header — no export button */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Live search CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" /> {t('dashboard.live_search')}
            </h2>
            <p className="text-slate-400 text-sm mb-4">{t('dashboard.live_search_desc')}</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map(q => (
                <button key={q} onClick={() => navigate(`/trends?q=${encodeURIComponent(q)}`)} className="px-3 py-1.5 bg-slate-700 hover:bg-amber-500/20 border border-slate-600 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 rounded-full text-xs font-medium transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/trends')} className="shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]">
            {t('dashboard.open_search')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">

          {/* Top 3 */}
          {!loading && top3.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> {t('dashboard.top_trends')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3.map(trend => (
                  <div key={trend._id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-300" />
                    <div className="relative h-full">
                      <TrendCard trend={trend} onSelect={setSelectedTrend} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All trends */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5" /> {t('dashboard.all_trends')}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl p-5 animate-pulse h-40">
                    <div className="flex gap-2 mb-3"><div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded" /><div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded" /></div>
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-4/5 mb-2" />
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-full mb-1" />
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : rest.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map(t => <TrendCard key={t._id} trend={t} onSelect={setSelectedTrend} />)}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-900/30 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                {t('dashboard.no_trends')}
              </div>
            )}
          </div>

          {/* Status breakdown — no export */}
          {!loading && trends.length > 0 && (
            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{t('dashboard.status_breakdown')}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-1">{hot.length}</div>
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">{t('dashboard.hot')} 🔥</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.score_gte8')}</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-1">{rising.length}</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t('dashboard.rising')} 📈</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.score_5_8')}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">{emerging.length}</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t('dashboard.emerging')} 🌱</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.score_lt5')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: live feed */}
        <div><SignalFeed navigate={navigate} /></div>
      </div>

      {/* Trend detail modal */}
      {selectedTrend && <TrendModal trend={selectedTrend} onClose={() => setSelectedTrend(null)} />}
    </div>
  );
}
