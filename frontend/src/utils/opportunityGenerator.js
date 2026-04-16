/**
 * Opportunity Layer Generator
 * 
 * For each trend, generates a complete opportunity layer:
 * - Problem (WHY)
 * - Why it matters
 * - Who should care
 * - Opportunity summary
 */

import { generateProblem } from './problemGenerator.js';

const whyMattersTemplates = {
  'Technology': [
    'Reduces engineering complexity and accelerates time-to-market for modern software products.',
    'Enables faster iteration cycles and lower infrastructure costs for tech companies.',
    'Addresses critical scalability bottlenecks that limit product growth and user experience.',
    'Creates new competitive advantages through automation and intelligent systems.',
  ],
  'Software Development': [
    'Improves developer productivity and reduces technical debt across engineering organizations.',
    'Streamlines development workflows, cutting build and deployment times significantly.',
    'Enables engineering teams to ship faster while maintaining code quality and reliability.',
  ],
  'Data Engineering': [
    'Transforms raw data into actionable intelligence at unprecedented speed and scale.',
    'Reduces data pipeline failures and improves data quality across the organization.',
    'Enables real-time decision-making with faster data processing and lower latency.',
  ],
  'Business': [
    'Opens new revenue streams and go-to-market strategies for forward-thinking companies.',
    'Reduces customer acquisition costs while improving retention and lifetime value.',
    'Creates first-mover advantage in rapidly emerging market segments.',
  ],
  'Finance': [
    'Reduces transaction costs and improves financial modeling accuracy.',
    'Enables faster settlement times and more transparent financial operations.',
    'Creates new investment vehicles and democratizes access to financial markets.',
  ],
  'Healthcare': [
    'Improves patient outcomes through earlier diagnostics and personalized treatment.',
    'Reduces operational costs while improving quality of care delivery.',
    'Accelerates drug discovery and clinical trial processes significantly.',
  ],
  'Marketing': [
    'Improves targeting precision and reduces wasted ad spend across channels.',
    'Enables hyper-personalized campaigns that drive higher conversion rates.',
    'Creates data-driven growth loops that compound over time.',
  ],
  'Design': [
    'Accelerates the design-to-development handoff with better tooling and workflows.',
    'Enables more inclusive and accessible product experiences for all users.',
    'Reduces design iteration cycles from weeks to hours.',
  ],
};

const whoShouldCareMap = {
  'Technology': 'AI startups, dev tool companies, cloud infrastructure providers, and enterprise R&D teams',
  'Software Development': 'Engineering leaders, DevOps teams, developer tool startups, and platform engineers',
  'Data Engineering': 'Data platform companies, analytics startups, MLOps teams, and enterprise data architects',
  'Business': 'Startup founders, venture capitalists, growth-stage companies, and strategic consultants',
  'Finance': 'Fintech startups, crypto projects, traditional financial institutions, and regulatory bodies',
  'Healthcare': 'HealthTech startups, hospital systems, pharma R&D teams, and digital health platforms',
  'Marketing': 'Growth marketers, MarTech companies, D2C brands, and performance marketing agencies',
  'Design': 'Design system teams, UI component libraries, no-code platforms, and product design consultancies',
};

const opportunityTemplates = {
  'Technology': [
    'Build developer tools that simplify adoption and integration of this technology.',
    'Create a managed platform-as-a-service that abstracts away infrastructure complexity.',
    'Develop monitoring and observability solutions for teams adopting this approach.',
    'Build debugging and testing tools purpose-built for this emerging paradigm.',
  ],
  'Software Development': [
    'Create IDE plugins and CLI tools that automate common workflows in this space.',
    'Build a managed CI/CD pipeline optimized specifically for this development pattern.',
    'Develop training and certification programs for engineering teams.',
  ],
  'Data Engineering': [
    'Build a unified data platform that simplifies complex pipeline orchestration.',
    'Create data quality and governance tools for this emerging stack.',
    'Develop real-time analytics solutions that leverage this technology.',
  ],
  'Business': [
    'Launch a vertical SaaS product targeting the specific needs of this market segment.',
    'Build a marketplace connecting early adopters with solution providers.',
    'Create consulting and advisory services for enterprises exploring this trend.',
  ],
  'Finance': [
    'Build compliance and regulatory tools for this emerging financial paradigm.',
    'Create portfolio analytics platforms that incorporate these new signals.',
    'Develop risk management solutions tailored to this evolving landscape.',
  ],
  'Healthcare': [
    'Build EHR integration tools that leverage this technology for better patient outcomes.',
    'Create telemedicine platforms enhanced with these emerging capabilities.',
    'Develop clinical decision support systems powered by this innovation.',
  ],
  'Marketing': [
    'Build a marketing automation platform that leverages these emerging strategies.',
    'Create an analytics dashboard that surfaces actionable insights from this trend.',
    'Develop personalization engines powered by this new approach.',
  ],
  'Design': [
    'Build AI-powered design tools that accelerate creative workflows.',
    'Create component libraries and design systems optimized for this paradigm.',
    'Develop collaborative design platforms enhanced with these capabilities.',
  ],
};

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

/**
 * Generate a complete opportunity layer for a trend
 * @param {Object} trend - The trend object { name, category, score, explanation }
 * @returns {Object} { problem, whyMatters, whoShouldCare, opportunity }
 */
export function generateOpportunityLayer(trend) {
  if (!trend || !trend.name) {
    return { problem: '', whyMatters: '', whoShouldCare: '', opportunity: '' };
  }

  const category = trend.category || 'Technology';
  const hash = Math.abs(hashCode(trend.name));

  const problem = generateProblem(trend.name, category);

  const mattersOptions = whyMattersTemplates[category] || whyMattersTemplates['Technology'];
  const whyMatters = mattersOptions[hash % mattersOptions.length];

  const whoShouldCare = whoShouldCareMap[category] || whoShouldCareMap['Technology'];

  const oppOptions = opportunityTemplates[category] || opportunityTemplates['Technology'];
  const opportunity = oppOptions[hash % oppOptions.length];

  return { problem, whyMatters, whoShouldCare, opportunity };
}

export default generateOpportunityLayer;
