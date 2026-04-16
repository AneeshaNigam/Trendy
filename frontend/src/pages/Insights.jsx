import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp, Zap, PieChart, Loader2, AlertTriangle, ArrowUpRight,
  Tag, BarChart3, Globe, Flame, Sparkles, Lightbulb, Info, Users, X
} from 'lucide-react';
import axios from 'axios';
import { normalizeScore } from '../utils/normalizeScore';
import { useTranslation } from 'react-i18next';

// ─── Fully enriched fallback data — 15 "mini insight reports" ────────────────
const fallbackTrends = [
  {
    _id: 'i1', name: 'AI Healthcare Diagnostics', score: 9.4, category: 'HealthTech', createdAt: '2026-04-10',
    explanation: 'AI diagnostic tools in radiology and pathology now match or exceed specialist accuracy, with the FDA clearing 700+ AI medical devices as of 2026.',
    aiInsight: 'The convergence of large multimodal models and clinical-grade labelled datasets has pushed AI diagnostic accuracy past the 95% threshold in several specialties. Major hospital systems — Cleveland Clinic, Mayo, Mass General — are now running AI-assisted reads on every scan. The next bottleneck is workflow integration, not model performance.',
    whyItMatters: 'The global medical imaging AI market will exceed $20B by 2028. Hospitals that standardize on AI-assisted diagnosis now will set clinical workflows that competitors must conform to — creating winner-take-most dynamics in each specialty vertical.',
    startupIdeas: [
      'AI radiologist co-pilot for community hospitals that lack specialist coverage — diagnostic AI-as-a-service on a per-read pricing model',
      'Clinical AI audit and explainability platform — helping hospitals prove to regulators and insurers that AI diagnoses are safe and traceable',
      'Patient pre-screening app using conversational AI and phone camera imaging to triage before expensive specialist visits'
    ],
    whoShouldCare: ['HealthTech founders', 'Medical device investors', 'Hospital CIOs', 'Digital health VCs'],
  },
  {
    _id: 'i2', name: 'Agentic AI Workflows', score: 9.1, category: 'AI & ML', createdAt: '2026-04-08',
    explanation: 'Autonomous AI agents that plan, iterate, and take actions across multi-step enterprise tasks without human intervention are now production-ready.',
    aiInsight: 'The shift from single-turn LLM calls to persistent, memory-equipped agents is the most significant architectural change in enterprise software since the move to SaaS. Teams at Salesforce, ServiceNow, and Workday are embedding agents into core workflows — replacing not just tasks but entire job functions. The agent orchestration layer is the most defensible position in the stack.',
    whyItMatters: 'Agentic AI creates a new category of software — autonomous, goal-directed systems that replace fixed-workflow automation. Every enterprise will need an agent strategy within 18 months, creating demand for tooling, monitoring, and reliability infrastructure that doesn\'t exist yet.',
    startupIdeas: [
      'No-code agent builder for business analysts — drag-and-drop workflow design that compiles to production-grade multi-agent systems without engineering',
      'Agent reliability and observability platform — monitoring, replay debugging, and cost attribution for enterprise multi-agent deployments',
      'Domain-specific legal and compliance agents — autonomous contract review, regulatory monitoring, and filing preparation for mid-market law firms'
    ],
    whoShouldCare: ['AI product managers', 'Enterprise software founders', 'Venture investors', 'CTOs at Series B+ companies'],
  },
  {
    _id: 'i3', name: 'Climate Fintech', score: 8.9, category: 'Climate', createdAt: '2026-04-07',
    explanation: 'Financial products built around carbon markets, ESG scoring infrastructure, and green lending are attracting significant institutional capital in 2026.',
    aiInsight: 'EU mandatory CSRD reporting requirements (live in 2026) are forcing 50,000+ companies to quantify carbon footprint with auditable precision for the first time. This creates immediate demand for structured carbon data, verification, and reporting automation. Voluntary carbon markets are simultaneously professionalizing — shifting from reputational plays to fungible financial assets with clearing infrastructure.',
    whyItMatters: 'CSRD compliance alone represents a multi-billion dollar addressable market in reporting software, data verification, and audit tooling. Companies building the plumbing for mandatory ESG data will be as defensible as credit bureaus within a decade.',
    startupIdeas: [
      'CSRD compliance automation for mid-market European companies — pre-built emissions calculation workflows, supplier data ingestion, and audit-ready report generation',
      'Carbon credit integrity scoring API — ML-powered permanence and additionality verification for institutional buyers who need due diligence at scale',
      'Green loan origination and monitoring platform for regional banks — automated ESG underwriting rules and post-disbursement impact tracking'
    ],
    whoShouldCare: ['Climate tech founders', 'ESG strategists', 'VC funds with sustainability mandates', 'Financial regulators'],
  },
  {
    _id: 'i4', name: 'Synthetic Data Pipelines', score: 8.7, category: 'AI & ML', createdAt: '2026-04-06',
    explanation: 'Programmatically generated synthetic datasets are unlocking model training in data-scarce and privacy-sensitive domains where real data collection is impossible.',
    aiInsight: 'GANs and diffusion-based synthetic data generation have crossed a quality threshold where benchmark results on synthetic data match or exceed real-data baselines in healthcare imaging, financial tabular data, and autonomous vehicle scenarios. NVIDIA, Gretel, and Scale AI have all shipped production-grade synthetic data pipelines. The gap is now in domain-specific generation tooling for the long tail of industries.',
    whyItMatters: 'AI project failure rates remain high in regulated industries because clean, labelled, privacy-compliant training data is either unavailable or prohibitively expensive. Synthetic data removes the data bottleneck without legal liability — directly unlocking billions in AI investment that is currently stalled.',
    startupIdeas: [
      'Healthcare-specific synthetic patient record generator — FHIR-compliant, with configurable disease prevalence and demographic parameters for clinical AI training teams',
      'Synthetic data quality validation service — automated statistical divergence testing that produces reports regulators and compliance teams will accept',
      'Financial fraud scenario generation engine — rare-event synthesis for credit card fraud, AML, and insider trading detection model training'
    ],
    whoShouldCare: ['AI/ML engineers', 'Regulated industry CTOs', 'Data privacy officers', 'AI product teams'],
  },
  {
    _id: 'i5', name: 'Embedded Finance Infrastructure', score: 8.4, category: 'Fintech', createdAt: '2026-04-05',
    explanation: 'Banking, lending, and payments functionality is being composed into non-financial software via BaaS APIs, fundamentally reshaping how financial products reach users.',
    aiInsight: 'Shopify Capital has originated $5B+ in loans to merchants without a banking license. Gusto embeds payroll lending. Toast embeds restaurant financing. The playbook is proven: distribution advantage through captive software relationships eliminates customer acquisition costs that traditional banks cannot compete with. The infrastructure layer enabling this — ledger-as-a-service, compliance APIs, instant account provisioning — is still fragmented and underbuilt.',
    whyItMatters: 'Every vertical SaaS company will eventually embed financial products because monetization per user from payments and lending dwarfs SaaS subscription economics by 3-5x. The infrastructure providers that enable this will become the plumbing for the entire software economy.',
    startupIdeas: [
      'Embedded B2B lending infrastructure for vertical SaaS platforms — plug-and-play revenue-based lending that any SaaS product can offer to their business customers in days',
      'Real-time multi-currency ledger API for global marketplaces — sub-ledger management, FX conversion, and regulatory reporting in one SDK',
      'Embedded finance compliance-as-a-service — automated KYC/AML, transaction monitoring, and SAR filing for tech companies that don\'t want to build a compliance team'
    ],
    whoShouldCare: ['Fintech founders', 'SaaS product leaders', 'Bank partnership teams', 'Payments VCs'],
  },
  {
    _id: 'i6', name: 'Personalized Learning AI', score: 8.1, category: 'EdTech', createdAt: '2026-04-04',
    explanation: 'AI tutoring systems that adapt instruction in real-time to individual student knowledge state are demonstrating 2-3x learning efficiency improvements in controlled studies.',
    aiInsight: 'Khanmigo, Duolingo Max, and Synthesis have each demonstrated that large language models can serve as patient, infinitely knowledgeable tutors that adjust Socratic questioning to exactly the student\'s current knowledge frontier. The bottleneck is no longer model capability — it\'s curriculum design, engagement UX, and outcome measurement. Corporate L&D buyers are moving fastest because they have clear ROI metrics (time-to-competency) and large budgets.',
    whyItMatters: 'The global EdTech market is $300B+ but most of it is digitized legacy content delivery, not true personalization. AI-native platforms that can prove measurable learning outcomes will displace legacy LMS providers across both K-12 and corporate learning at speed.',
    startupIdeas: [
      'AI-powered professional certification prep platform — adaptive study plans, real-time concept gap diagnosis, and mock exam simulations for high-stakes certs (AWS, CPA, Bar exam)',
      'Corporate onboarding and L&D AI — reduces time-to-productivity for new hires by 40% with role-specific adaptive training paths and skills gap analytics for HR teams',
      'AI study partner for K-12 homework — Socratic tutoring that never gives answers directly but guides students to solutions, with parent dashboards showing progression'
    ],
    whoShouldCare: ['EdTech founders', 'Corporate L&D leaders', 'HR tech product managers', 'Education investors'],
  },
  {
    _id: 'i7', name: 'Edge AI Inference', score: 7.9, category: 'AI & ML', createdAt: '2026-04-03',
    explanation: 'Quantized language and vision models running locally on consumer and industrial hardware are enabling a new class of private, real-time, offline-capable AI applications.',
    aiInsight: 'Apple\'s Neural Engine, Qualcomm\'s NPU, and NVIDIA\'s Jetson series have made it economically viable to run GPT-4-class reasoning locally in 2026. MLX, llama.cpp, and GGUF format models have a thriving ecosystem. The architecture shift from cloud-to-edge eliminates three critical blockers for enterprise AI: data privacy/GDPR compliance, latency for real-time applications, and connectivity requirements for field deployments.',
    whyItMatters: 'Healthcare, manufacturing, defense, and legal sectors have historically been unable to adopt cloud AI due to data sovereignty requirements. Edge inference removes this barrier, unlocking the largest and most under-served enterprise AI segments that have been waiting on the sidelines since 2022.',
    startupIdeas: [
      'Edge AI deployment platform for manufacturers — one-click model packaging and deployment to factory floor PLCs and industrial cameras, with OTA update management',
      'Privacy-first AI document intelligence for law firms — fully on-premise LLM that analyzes confidential client documents without any data leaving the network',
      'Offline-capable field operations AI for utilities and telcos — AI-powered fault diagnosis and repair guidance that works in basements, tunnels, and remote infrastructure'
    ],
    whoShouldCare: ['Industrial IoT founders', 'Enterprise AI architects', 'Hardware platform engineers', 'Defense tech investors'],
  },
  {
    _id: 'i8', name: 'Creator Economy Infrastructure', score: 7.6, category: 'Business', createdAt: '2026-04-02',
    explanation: 'Platforms enabling individual creators to build sustainable businesses through subscriptions, digital products, communities, and IP licensing are professionalizing fast.',
    aiInsight: 'MrBeast\'s Feastables and similar creator-brand ventures show that top creators are building media conglomerates, not just profiles. The majority of creators earning $100K+ report that platform tools are their biggest operational bottleneck — invoicing, taxes across jurisdictions, cross-platform analytics, and legal protection are all poorly served by existing products. The creator economy is fundamentally an SMB economy with unique distribution characteristics.',
    whyItMatters: 'Over 200M people globally identify as "content creators" with 2M+ earning primary income from it. The financial, legal, and analytical infrastructure serving this segment is designed for either individuals (too simple) or enterprises (too complex). The gap is a multi-billion dollar SMB market waiting for purpose-built tooling.',
    startupIdeas: [
      'Creator financial OS — business banking, invoicing, cross-border payments, quarterly tax estimation, and expense categorization purpose-built for creator income patterns',
      'Cross-platform audience intelligence platform — unified analytics across YouTube, Instagram, TikTok, Substack, and Patreon with predictive churn detection and monetization optimization',
      'Creator IP licensing and brand deal marketplace — AI-powered matching between creators and brands, with automated contract generation, rights management, and performance reporting'
    ],
    whoShouldCare: ['Creator economy founders', 'Fintech product teams', 'Media executives', 'SMB-focused VCs'],
  },
  {
    _id: 'i9', name: 'B2B AI Sales Intelligence', score: 7.3, category: 'Business', createdAt: '2026-04-01',
    explanation: 'AI systems that identify real-time buying intent signals, predict deal outcomes, and automate contextual outreach are becoming table stakes in enterprise revenue operations.',
    aiInsight: '6sense and Demandbase have proven that account-level intent data measurably improves pipeline quality, but the technology is still out of reach for mid-market companies. The next wave is predictive at the deal level — AI that reads CRM activity, call transcripts, email sentiment, and external signals to surface which deals will close before a rep\'s gut tells them. CROs are prioritizing this over headcount in every RevOps survey from 2025-2026.',
    whyItMatters: 'The average enterprise sales cycle costs $15,000-$50,000 in rep time per deal pursued. AI that cuts the number of unwinnable deals entered and increases win rates on winnable ones generates ROI that directly shows up on the income statement — making it a board-level purchasing decision with short sales cycles.',
    startupIdeas: [
      'Deal intelligence copilot for mid-market CRMs — real-time win probability scoring based on CRM activity patterns, email engagement signals, and cross-industry benchmark data',
      'AI SDR that qualifies inbound leads via multi-turn email/chat conversations and only hands off to human reps when qualification criteria are met',
      'Competitive intelligence agent for sales teams — automated monitoring of competitor pricing, product changes, and win/loss patterns with daily briefings for account executives'
    ],
    whoShouldCare: ['SaaS founders', 'Revenue Operations leaders', 'CROs', 'Sales-led growth VCs'],
  },
  {
    _id: 'i10', name: 'Mental Health Tech', score: 7.1, category: 'HealthTech', createdAt: '2026-03-30',
    explanation: 'Digital mental health platforms — spanning AI-assisted therapy, crisis detection tools, and employer EAP platforms — are seeing accelerating adoption and payer reimbursement.',
    aiInsight: 'The landmark 2025 CMS decision to expand telehealth mental health reimbursement codes permanently has catalyzed a land-grab among digital mental health providers. Spring Health and Lyra Health have each reached $1B+ valuations on employer benefit contracts alone. The next frontier is AI-augmented therapist productivity — tools that handle note-taking, homework tracking, and between-session support so therapists can manage 3x the caseload without burnout.',
    whyItMatters: '1 in 4 adults globally experiences a mental health condition annually, but the therapist shortage means wait times of 3-6 months in most markets. Technology that either expands therapist capacity or provides evidence-based support between sessions is the only scalable solution — and payers are now willing to pay.',
    startupIdeas: [
      'AI-powered therapist productivity platform — automated session notes using clinical NLP, homework assignment tracking, and crisis alert monitoring between sessions',
      'Employer mental health benefits navigation tool — AI triage that matches employees to the right level of care (self-guided, coaching, therapy, psychiatry) based on symptom assessment',
      'Evidence-based digital CBT companion for anxiety and depression — clinically validated exercises, mood tracking with pattern detection, and human escalation pathways for insurers'
    ],
    whoShouldCare: ['HealthTech founders', 'HR benefits innovators', 'Insurance product teams', 'Mental health investors'],
  },
  {
    _id: 'i11', name: 'RPA 2.0 (AI-Enhanced)', score: 6.8, category: 'Technology', createdAt: '2026-03-28',
    explanation: 'Traditional robotic process automation extended with LLM-based document understanding, exception handling, and unstructured data processing is replacing brittle rule-based bots.',
    aiInsight: 'Classic RPA (UiPath, Automation Anywhere) had an 80% failure-at-scale problem — bots breaking on UI changes and unstructured inputs. The addition of vision models and LLMs has fundamentally solved these failure modes. UiPath\'s Autopilot and Microsoft\'s Power Automate Copilot are now handling document-heavy workflows that previously required humans. The market is re-opening for vertical-specific AI-RPA plays targeting industries with high document volume.',
    whyItMatters: 'Back-office automation is a $20B market dominated by expensive integrators and fragile legacy bots accumulated over 10 years. AI-enhanced RPA that handles exceptions intelligently can deliver 10x the reliability at a fraction of the maintenance cost — creating a replacement cycle across healthcare billing, insurance claims, and financial operations.',
    startupIdeas: [
      'Healthcare revenue cycle AI-RPA — automated prior authorization, claims submission, denial management, and ERA posting handling the 40% of healthcare admin that still requires manual intervention',
      'Insurance claims processing automation — AI document extraction and adjudication logic for P&C and health claims that cuts processing time from days to minutes',
      'AP/AR automation for mid-market manufacturing — intelligent invoice matching, PO reconciliation, and exception-based approval workflows that integrate with legacy ERP systems'
    ],
    whoShouldCare: ['Enterprise software founders', 'Operations-focused VCs', 'CFOs at mid-market companies', 'Healthcare billing specialists'],
  },
  {
    _id: 'i12', name: 'Supply Chain Visibility SaaS', score: 6.5, category: 'Business', createdAt: '2026-03-26',
    explanation: 'Real-time supply chain visibility, predictive disruption detection, and supplier financial health monitoring platforms are becoming boardroom priorities after years of costly shocks.',
    aiInsight: 'The 2021-2023 supply chain crisis permanently elevated supply chain risk from an operations topic to a CFO and board priority. Gartner reports that 90% of Fortune 500 procurement teams now have budget for supply chain analytics that didn\'t exist before 2020. The market has been slow to consolidate — established players (E2open, Kinaxis) are expensive and complex, leaving a significant mid-market gap for focused vertical solutions.',
    whyItMatters: 'Supply chain disruptions cost global businesses $3.3T annually. Companies with real-time visibility into multi-tier supplier dependencies recover 4x faster from disruptions — a quantifiable ROI that justifies $100K-$500K annual software budgets without requiring procurement consensus.',
    startupIdeas: [
      'Supplier financial health monitoring service — real-time credit risk scoring for supplier networks using alternative data (payment behavior, news signals, tariff exposure) to flag single-source dependency risks early',
      'Tariff impact modeling tool — real-time calculation of how proposed and enacted trade policy changes affect landed cost across a company\'s sourcing network, with "what-if" scenario modeling',
      'Supply chain carbon footprint tracker — Scope 3 emissions calculation across Tier 1 and Tier 2 suppliers using AI-based emission factor matching for CSRD and CDP reporting'
    ],
    whoShouldCare: ['Supply chain leaders', 'Procurement VPs', 'Risk management functions', 'Manufacturing-focused investors'],
  },
  {
    _id: 'i13', name: 'Vertical AI SaaS', score: 6.2, category: 'AI & ML', createdAt: '2026-03-24',
    explanation: 'AI-native software built for specific industries — construction, agriculture, legal, field services — is consistently outperforming horizontal AI tools in head-to-head deals.',
    aiInsight: 'The "AI for everyone" horizontal tools (ChatGPT Enterprise, Microsoft Copilot) are winning mindshare but losing enterprise deals. Construction firms buying Procore AI, law firms buying Harvey, and agricultural operations buying Granular are each choosing domain-tuned AI with industry-specific data models over generic LLM wrappers. The win rate advantage of vertical AI in competitive evaluations is 3:1 in most sectors surveyed by CB Insights (2025). Domain moats are building fast.',
    whyItMatters: 'Every industry vertical with $1B+ in existing software spend is vulnerable to an AI-native disruptor that understands their workflows, terminology, and data natively. The window to build these vertical moats is 2-3 years before horizontal tools close the gap with fine-tuning and domain-specific plugins.',
    startupIdeas: [
      'AI for multifamily real estate operations — lease abstraction, maintenance ticket triage, vendor invoice reconciliation, and NOI optimization recommendations for property management companies',
      'Construction project intelligence platform — automated subcontractor bid analysis, schedule risk detection from RFI patterns, and cost-to-complete forecasting using historical project data',
      'AI-native wealth management operations — automated client reporting, portfolio drift alerting, rebalancing recommendations, and compliance documentation for RIAs managing $100M-$1B'
    ],
    whoShouldCare: ['Vertical SaaS founders', 'Industry operators turned founders', 'Sector-focused VCs', 'Enterprise software buyers'],
  },
  {
    _id: 'i14', name: 'Open Source AI Infrastructure', score: 5.9, category: 'AI & ML', createdAt: '2026-03-20',
    explanation: 'Community-developed foundational AI infrastructure — model registries, serving frameworks, evaluation harnesses — is accelerating enterprise AI adoption by reducing proprietary lock-in.',
    aiInsight: 'Meta\'s Llama 3 series, Mistral\'s open-weight releases, and Hugging Face\'s Transformers ecosystem have collectively shifted enterprise AI strategy. CTOs who previously planned to standardize on a single proprietary API are now building multi-model architectures. The new requirement is infrastructure that can evaluate, route, and serve models interchangeably — a need that open-source tooling is filling faster than proprietary vendors.',
    whyItMatters: 'Open-source AI infrastructure creates a commercial opportunity paradox: the tools are free, but deployment, customization, and support are enterprise software businesses. Companies like Replicate, Together.ai, and Modal are proving that managed open-source AI infrastructure commands premium enterprise pricing.',
    startupIdeas: [
      'Enterprise MLOps platform for open-source model lifecycle — model registry, A/B evaluation, cost-optimized routing between open and proprietary models, and compliance audit trails',
      'Fine-tuning-as-a-service for regulated industries — privacy-preserving distributed fine-tuning of open-source models on customer data with zero data egress and SOC 2 Type II certification',
      'AI model governance and compliance platform — automated tracking of which model handled which decision, with bias detection and regulatory reporting for financial services and healthcare'
    ],
    whoShouldCare: ['Platform engineers', 'Enterprise ML teams', 'AI infrastructure investors', 'Open-source maintainers'],
  },
  {
    _id: 'i15', name: 'Quantum Computing Startups', score: 5.4, category: 'Technology', createdAt: '2026-03-15',
    explanation: 'Quantum computing is moving from purely theoretical research into narrow but commercially relevant problem domains including drug discovery, logistics optimization, and cryptography.',
    aiInsight: 'IBM\'s 2025 "Quantum Advantage" demonstration on a classically-intractable molecular simulation problem was a genuine inflection point — the first peer-reviewed evidence of commercial quantum utility. The timeline for broad quantum advantage has compressed from "20+ years" to "3-7 years" in expert surveys. The near-term opportunity is hybrid classical-quantum algorithms for optimization problems where even 5% improvements generate millions in savings.',
    whyItMatters: 'Post-quantum cryptography is already a compliance requirement (NIST PQC standards finalized in 2024), creating immediate enterprise spend. Pharmaceutical companies and logistics operators are running quantum-classical hybrid algorithms on optimization problems now, validating commercial use cases ahead of full fault-tolerant quantum computers.',
    startupIdeas: [
      'Quantum-safe cryptography migration service — automated inventory of vulnerable cryptographic assets, migration planning, and implementation support for enterprises facing NIST PQC compliance deadlines',
      'Hybrid quantum-classical optimization API for supply chain — solver-as-a-service for complex routing, scheduling, and inventory optimization problems that outperform classical heuristics at scale',
      'Quantum algorithm consulting and custom development firm — helping pharmaceutical and financial institutions translate their hardest optimization problems into quantum circuit designs ready for near-term hardware'
    ],
    whoShouldCare: ['Deep tech founders', 'Enterprise CISOs', 'Pharmaceutical R&D leads', 'Defense-oriented investors'],
  },
];

// ─── Mini insight card (used in Hot Trends section) ───────────────────────────
function InsightMiniCard({ trend, onSelect }) {
  const { t } = useTranslation();
  const score  = normalizeScore(trend.score);
  const status = getStatusLabel(score);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(trend)}
      onKeyDown={e => e.key === 'Enter' && onSelect(trend)}
      className="group bg-white dark:bg-slate-800/60 border border-red-100 dark:border-red-500/15 rounded-2xl p-5 hover:border-red-300 dark:hover:border-red-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {trend.category && (
            <span className="inline-block px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded text-[11px] font-bold mb-1.5">{trend.category}</span>
          )}
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{trend.name}</h3>
        </div>
        <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-lg text-[11px] font-bold shrink-0">
          <TrendingUp className="w-3 h-3" /> {score}
        </span>
      </div>

      {trend.aiInsight && (
        <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{trend.aiInsight}</p>
      )}

      {trend.startupIdeas?.[0] && (
        <div className="bg-amber-50/70 dark:bg-amber-500/6 border border-amber-200/50 dark:border-amber-500/15 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Startup Idea</span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed line-clamp-2">{trend.startupIdeas[0]}</p>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-auto">
        <Sparkles className="w-3 h-3" />
        <span>{t('trends.click_insights')}</span>
      </div>
    </div>
  );
}

// ─── Full insight detail modal ────────────────────────────────────────────────
function InsightModal({ trend, onClose }) {
  const { t } = useTranslation();
  const score  = normalizeScore(trend.score);
  const status = getStatusLabel(score);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
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
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800 z-10 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {trend.category && <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-bold">{trend.category}</span>}
              <span className={`px-2 py-0.5 rounded border text-xs font-bold ${status.cls}`}>{status.label} {status.emoji}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{trend.name}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> {score}/10
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {trend.explanation && (
            <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/60 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{trend.explanation}</p>
            </div>
          )}
          {trend.aiInsight && (
            <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-500/8 dark:to-orange-500/5 border border-amber-200/80 dark:border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5"><Sparkles className="w-4 h-4 text-amber-500" /><h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</h3></div>
              <p className="text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">{trend.aiInsight}</p>
            </section>
          )}
          {(trend.whyItMatters) && (
            <section className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200/80 dark:border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5"><Info className="w-4 h-4 text-blue-500" /><h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">{t('trends.why_matters')}</h3></div>
              <p className="text-sm text-blue-900 dark:text-blue-200/90 leading-relaxed">{trend.whyItMatters}</p>
            </section>
          )}
          {trend.startupIdeas?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-amber-500" /><h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.startup_ideas')}</h3></div>
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
          {trend.whoShouldCare?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-purple-500" /><h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.who_cares')}</h3></div>
              <div className="flex flex-wrap gap-2">
                {trend.whoShouldCare.map((role, i) => (
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

// ─── Animated counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        const end = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(end)) { setDisplay(value); return; }
        let start = 0;
        const steps = 60, stepTime = 20, increment = end / steps;
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) { setDisplay(end); clearInterval(timer); }
          else setDisplay(Math.round(start * 10) / 10);
        }, stepTime);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{typeof display === 'number' ? (Number.isInteger(display) ? display : display.toFixed(1)) : display}{suffix}</span>;
}

function getStatusLabel(score) {
  if (score >= 8) return { label: 'Hot',     emoji: '🔥', cls: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' };
  if (score >= 5) return { label: 'Rising',   emoji: '📈', cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
  return { label: 'Emerging', emoji: '🌱', cls: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' };
}

// ─── Main Insights page ────────────────────────────────────────────────────────
export default function Insights() {
  const { t } = useTranslation();
  const [trends, setTrends]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trends', { withCredentials: true });
        const api = res.data.trends || [];
        // Merge API trends with our enriched fallback (fallback provides insight content)
        const merged = api.length > 0
          ? api.map(apiT => {
              const enriched = fallbackTrends.find(f => f.name === apiT.name);
              return { ...apiT, ...(enriched || {}) };
            })
          : fallbackTrends;
        setTrends(merged);
      } catch (err) {
        console.warn('Insights API unavailable:', err.message);
        setTrends(fallbackTrends);
        setError('Showing sample insights — API unavailable.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" /></div>;

  const normTrends     = trends.map(t => ({ ...t, score: normalizeScore(t.score) }));
  const totalTrends    = normTrends.length;
  const hotTrends      = normTrends.filter(t => t.score >= 8);
  const risingTrends   = normTrends.filter(t => t.score >= 5 && t.score < 8);
  const emerging       = normTrends.filter(t => t.score < 5);
  const earlyPct       = totalTrends > 0 ? Math.round((emerging.length / totalTrends) * 100) : 0;
  const sorted         = [...normTrends].sort((a, b) => b.score - a.score);
  const fastestGrowing = sorted[0];
  const avgScore       = totalTrends > 0 ? normTrends.reduce((s, t) => s + (t.score || 0), 0) / totalTrends : 0;
  const categoryMap    = {};
  normTrends.forEach(t => { const c = t.category || 'Uncategorized'; categoryMap[c] = (categoryMap[c] || 0) + 1; });
  const topCategory    = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
  const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const catColors = ['from-amber-400 to-orange-500','from-blue-400 to-indigo-500','from-emerald-400 to-teal-500','from-purple-400 to-violet-500','from-pink-400 to-rose-500','from-cyan-400 to-sky-500','from-lime-400 to-green-500','from-red-400 to-pink-500'];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
          <PieChart className="w-8 h-8 text-amber-500" /> {t('insights.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('insights.subtitle')}</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { icon: <Zap className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10', value: earlyPct, suffix: '%', label: t('insights.emerging_pct'), accent: 'group-hover:text-amber-500' },
          { icon: <Tag className="w-5 h-5 text-blue-500" />,  bg: 'bg-blue-50 dark:bg-blue-500/10',   value: topCategory?.[0] ?? 'N/A', label: t('insights.top_category'), accent: 'group-hover:text-blue-500', isText: true },
          { icon: <TrendingUp className="w-5 h-5 text-green-500" />, bg: 'bg-green-50 dark:bg-green-500/10', value: fastestGrowing?.name ?? 'N/A', label: t('insights.fastest_growing'), accent: 'group-hover:text-green-500', isText: true, extra: fastestGrowing?.score },
          { icon: <BarChart3 className="w-5 h-5 text-rose-500" />,  bg: 'bg-rose-50 dark:bg-rose-500/10',  value: avgScore, label: t('insights.avg_score'), accent: 'group-hover:text-rose-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 ${kpi.bg} rounded-xl`}>{kpi.icon}</div>
              <ArrowUpRight className={`w-4 h-4 text-gray-300 dark:text-gray-600 ${kpi.accent} transition-colors`} />
            </div>
            <div className={`font-extrabold text-gray-900 dark:text-white mb-1 ${kpi.isText ? 'text-xl leading-tight line-clamp-2' : 'text-3xl'}`} title={kpi.isText ? String(kpi.value) : ''}>
              {kpi.isText ? kpi.value : <AnimatedCounter value={kpi.value} suffix={kpi.suffix || ''} />}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {kpi.label}{kpi.extra && <span className="text-amber-500 font-bold ml-1">({Number(kpi.extra).toFixed(1)})</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { count: hotTrends.length,    label: t('insights.hot'),      emoji: '🔥', bg: 'bg-red-50 dark:bg-red-500/10',     border: 'border-red-200 dark:border-red-500/20',     text: 'text-red-600 dark:text-red-400',     sub: 'Score ≥ 8.0' },
          { count: risingTrends.length,  label: t('insights.rising'),   emoji: '📈', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', sub: 'Score 5.0–7.9' },
          { count: emerging.length,      label: t('insights.emerging'), emoji: '🌱', bg: 'bg-blue-50 dark:bg-blue-500/10',   border: 'border-blue-200 dark:border-blue-500/20',   text: 'text-blue-600 dark:text-blue-400',   sub: 'Score < 5.0' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-6 text-center shadow-sm`}>
            <div className={`text-4xl font-extrabold ${s.text} mb-2`}>{s.count}</div>
            <div className={`text-sm font-bold ${s.text} uppercase tracking-wider`}>{s.label} {s.emoji}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown + Status table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-amber-500" /> {t('insights.by_category')}</h2>
          <div className="space-y-3">
            {categoryEntries.map(([cat, count], idx) => {
              const pct = Math.round((count / totalTrends) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{cat}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0 ml-2">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${catColors[idx % catColors.length]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('insights.status_overview')}</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[480px] overflow-y-auto">
            {sorted.map((trend, idx) => {
              const status = getStatusLabel(trend.score);
              return (
                <div
                  key={trend._id || idx}
                  onClick={() => setSelectedTrend(trend)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-5 shrink-0">{idx + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{trend.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{trend.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 pl-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400">
                      <TrendingUp className="w-3.5 h-3.5" /> {Number(trend.score).toFixed(1)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.cls}`}>{status.label} {status.emoji}</span>
                  </div>
                </div>
              );
            })}
            {sorted.length === 0 && <div className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">{t('insights.no_data')}</div>}
          </div>
        </div>
      </div>

      {/* Hot Trends — FULL mini-report cards */}
      {hotTrends.length > 0 && (
        <div>
          <div className="mb-5 pb-2 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('insights.hot')} Trends — Mini Reports</h2>
            <span className="ml-2 px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded text-xs font-bold">{hotTrends.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {hotTrends.map(trend => (
              <InsightMiniCard key={trend._id} trend={trend} onSelect={setSelectedTrend} />
            ))}
          </div>
        </div>
      )}

      {/* Rising Trends mini-cards */}
      {risingTrends.length > 0 && (
        <div className="mt-10">
          <div className="mb-5 pb-2 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('insights.rising')} Trends</h2>
            <span className="ml-2 px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded text-xs font-bold">{risingTrends.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {risingTrends.map(trend => (
              <InsightMiniCard key={trend._id} trend={trend} onSelect={setSelectedTrend} />
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedTrend && <InsightModal trend={selectedTrend} onClose={() => setSelectedTrend(null)} />}
    </div>
  );
}
