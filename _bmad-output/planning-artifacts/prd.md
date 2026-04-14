---
stepsCompleted:
  - 'Step 1: Workflow Initialization'
  - 'Step 2: Project Discovery'
  - 'Step 2b: Product Vision Discovery'
  - 'Step 2c: Executive Summary Generation'
  - 'Step 3: Success Criteria Definition'
  - 'Step 4: User Journey Mapping'
  - 'Step 5: Domain-Specific Requirements'
  - 'Step 6: Innovation Discovery'
  - 'Step 7: Project-Type Deep Dive'
  - 'Step 8: Scoping Exercise - MVP & Future Features'
  - 'Step 9: Functional Requirements Synthesis'
  - 'Step 10: Non-Functional Requirements'
  - 'Step 11: Document Polish'
inputDocuments:
  - '/Users/jerryinyang/Code/logiq/_bmad-output/brainstorming/brainstorming-session-2026-04-13-001.md'
  - '/Users/jerryinyang/Code/logiq/_bmad-output/brainstorming/brainstorming-session-transcript-2026-04-13.md'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 0
workflowType: 'prd'
classification:
  projectType: 'Web Application (multi-page)'
  domain: 'EdTech/DevTools Crossover'
  complexity: 'Medium-High'
  projectContext: 'greenfield'
---

# Product Requirements Document - logiq

**Author:** 0x01
**Date:** 2026-04-14

## Executive Summary

logiq is an interactive, visual, gamified web application that teaches developers to think critically and solve problems optimally. It targets the foundational cognitive skill that keeps human developers relevant: the ability to break down complex problems, select optimal data structures and algorithms, and reason through solutions independently.

The platform replaces traditional LMS paradigms (videos, articles, syntax-based coding challenges) with a practice-first, no-code approach. Users solve progressively complex challenges through a visual drag-and-drop logic canvas — building reasoning before syntax. Failure is the teacher: the platform makes failure points visible, diagnostic, and productive. The platform rewards the reasoning path, not just correctness — a user who struggles, iterates, and improves scores higher than one who guesses correctly immediately.

### What Makes This Special

logiq differentiates from LeetCode, HackerRank, and Exercism through three core pillars:

1. **No-code reasoning before syntax** — Users construct logic flows visually in plain language, training algorithmic thinking that transfers to any programming language.

2. **Reasoning path scoring** — The platform scores how solutions are built: problem breakdown quality, edge case proactivity, structure efficiency, and iteration improvement. This rewards the cognitive process, not just the output.

3. **Visual metaphor library** — 11 physical metaphors make abstract DSA concepts intuitively graspable: arrays as sliding strips, linked lists as paper clips, stacks as plates, recursion as nesting dolls, dynamic programming as construction. No platform does this systematically.

The product philosophy: **Challenges ARE the curriculum. Failure IS the teacher.**

### Why Now

Problem-solving ability keeps human developers relevant. As AI accelerates code generation, the irreplaceable human capability is optimal problem decomposition and algorithmic thinking — skills that apply across all facets of life.

## Project Classification

| Aspect | Detail |
|--------|--------|
| **Project Type** | Multi-page web application |
| **Domain** | EdTech / DevTools crossover |
| **Complexity** | Medium-High |
| **Project Context** | Greenfield — comprehensive feature set |
| **Target Users** | All developers seeking to improve logical reasoning and DSA problem-solving (unsegmented) |

## Success Criteria

### User Success

- **Reasoning Mastery:** Users can construct correct logic flows for challenges without syntax errors, demonstrating understanding of algorithmic structure independent of programming language
- **Insight Moments:** Users report "I understand why this works" — genuine cognitive breakthroughs where abstract DSA concepts become physically intuitive
- **Transfer Ability:** Users apply problem-solving techniques from solved challenges to new, unfamiliar problems in different domains
- **Reasoning Score Validity:** Platform reasoning scores correlate with expert developer assessment; users with high iteration scores show better long-term retention
- **Clear Progression:** Users always know "what's next" — no decision paralysis, no skipping critical foundations
- **Prediction Accuracy:** Users improve at predicting algorithm behavior before seeing outcomes, demonstrating growing intuition

### Business Success

- **Active Progression:** >60% of users who start a challenge cluster complete it within 30 days
- **Retention:** >40% of users return within 7 days after their first session; >25% remain active after 30 days
- **Engagement Depth:** Average session includes 2+ challenges with meaningful reasoning iterations (not rapid guessing)
- **Community Growth:** >30% of users unlock and use post-solve solution sharing; >10% of mastered-concept users create community challenges
- **Skill Map Coverage:** Users traverse the full skill path — completion rate of guided linear path exceeds non-linear alternative benchmarks

### Technical Success

- **Fluid Interaction:** Logic block canvas feels responsive — block snapping and connection feels instant (<100ms response)
- **Smooth Visual Execution:** Algorithm visualization animations are fluid (60fps), making failure points visible and diagnostic
- **Accurate Scoring Engine:** Reasoning path scoring algorithm produces scores that match expert developer judgment within acceptable variance
- **Progressive Content Delivery:** Challenge difficulty calibration stays in the "tear but don't break" zone — users experience productive failure, not frustration or boredom
- **Informative Progress Tracking:** Users can see their reasoning growth, insight moments, and skill progression visually mapped over time

### Measurable Outcomes

| Metric | Target | Measurement |
|--------|--------|-------------|
| Challenge Completion Rate | >60% | Users completing started challenge clusters within 30 days |
| 7-Day Retention | >40% | Users returning within 7 days of first session |
| 30-Day Retention | >25% | Users remaining active after 30 days |
| Average Challenges per Session | 2+ | Meaningful reasoning iterations per session |
| Reasoning Score Correlation | >0.7 | Correlation with expert developer assessment |
| Solution Sharing Adoption | >30% | Users accessing alternative approaches post-completion |
| Community Challenge Creation | >10% | Mastery-level users creating challenges |

## Product Scope

### MVP - Minimum Viable Product

Core interaction, gamification, and post-solve features detailed in Project Scoping section.

### Growth Features (Post-MVP)

Community, collaboration, and advanced learning patterns detailed in Project Scoping section.

## User Journeys

### Journey 1: The Reasoning Breakthrough (Primary User - Success Path)

**Opening Scene:** A developer struggling with DSA interviews discovers logiq. They expect another LeetCode-style platform but encounter a visual drag-and-drop logic canvas instead — no code, no syntax, just pure reasoning.

**Rising Action:** They attempt their first challenge (linear search). They drag blocks: "loop through items," "compare value," "return index." They connect them in sequence and hit Test — it passes. The platform immediately presents a variant: "what if the array is already sorted?" They must adapt their logic, not just replicate it.

**Climax:** After 3 iterations, the platform detects their solution path has dramatically improved — they went from O(n²) thinking to O(n). The "Aha!" Moment Tracker fires. The platform celebrates this breakthrough visually. They see their reasoning score and understand *why* it improved: better problem breakdown, proactive edge case handling, efficient structure choice.

**Resolution:** They unlock the next challenge on the guided linear skill map. They can see the full territory ahead — clear "what's next." They feel genuine understanding, not just "I passed a problem." They continue.

**Journey Requirements:**
- Logic Block Canvas with drag-and-connect interaction
- Progressive Variant System delivering variants after completion
- Aha! Moment Tracker detecting solution path improvement
- Reasoning Path Scoring with visible dimensions
- Guided Linear Skill Map with sequential unlocking
- Visual territory display showing full path ahead

### Journey 2: The Productive Failure (Primary User - Struggle & Recovery)

**Opening Scene:** A developer hits a challenge they can't solve — binary search edge cases. They fail 3 times in a row, each time seeing their logic flow light up red at the failure point.

**Rising Action:** Hints unlock after 2-3 attempts. First hint: "Think about what happens when the target is smaller than the middle element." They try again. Fail. Second hint: "What if the array has only one element?" They add edge case handling blocks. Still fail on duplicate values.

**Climax:** After 5 failures, Bottleneck Detection triggers: "You're struggling with loop termination conditions." The platform offers a targeted mini-challenge focused *only* on that sub-skill. They complete the micro-challenge, understand the pattern, and return to the main challenge — solving it.

**Resolution:** They unlock Post-Solve Solution Sharing and see 3 completely different approaches to the same problem. They realize "there are many right answers." Their Insight Streak grows. They've turned failure into genuine learning.

**Journey Requirements:**
- Failure Visualization Engine showing where/why logic broke
- Hint Gating System unlocking after attempts, revealing one layer at a time
- Bottleneck Detection & Intervention for 5+ failures on same challenge
- Edge Case Stress Test running logic against known edge cases
- Post-Solve Solution Sharing gated behind completion
- Insight Streaks tracking consecutive learning moments

### Journey 3: From Learner to Creator (Community Builder)

**Opening Scene:** A user who has mastered several concepts sees the invitation: "Design a challenge for the community." This is the Challenge Design Mode — the highest level of understanding proof.

**Rising Action:** They define a problem, set edge cases, and create the visual logic solution. They think deeply about what makes a problem hard — what edge cases matter, how to scaffold difficulty. The platform guides them through challenge design: problem definition, edge case specification, solution validation.

**Climax:** Their challenge goes live. Other users attempt it. They see how others solved their challenge — different logic block arrangements, different approaches entirely. They see their own thinking reflected in others' solutions and discover approaches they'd never considered.

**Resolution:** They've proven mastery through creation. They earn community recognition badges. They continue designing challenges, becoming a content creator and deepening their own understanding through teaching.

**Journey Requirements:**
- Challenge Design Mode for mastery-level users
- Community challenge publication system
- Solution viewing for challenge creators
- Community recognition/badges system
- Challenge quality submission workflow

### Journey 4: Quality & Scoring Integrity (Admin/Platform Moderator)

**Opening Scene:** A platform administrator reviews the reasoning scoring engine's accuracy against expert developer judgment — the core differentiator must remain valid.

**Rising Action:** They analyze correlation data between platform scores and expert assessments across all users. They review community-created challenges for quality before publication. They monitor failure pattern libraries for accuracy — are the "80% of developers make this mistake" claims still valid?

**Climax:** They identify a scoring dimension producing outlier results — "iteration improvement" scoring is too generous on a specific challenge type. They recalibrate the algorithm, test against expert judgment, and confirm correlation returns above 0.7.

**Resolution:** Platform scoring maintains >0.7 correlation with expert judgment. Community content quality remains high. The platform delivers on its core differentiator promise. Users trust their reasoning scores as accurate reflections of their thinking quality.

**Journey Requirements:**
- Admin dashboard for scoring correlation analysis
- Community challenge review and approval workflow
- Failure pattern library accuracy monitoring
- Scoring algorithm calibration tools
- Expert judgment comparison dataset management

### Journey Requirements Summary

| Journey | Revealed Capabilities |
|---------|----------------------|
| Reasoning Breakthrough | Core canvas, variant system, aha tracking, reasoning scoring, skill map |
| Productive Failure | Failure visualization, hint gating, bottleneck detection, edge case testing, solution sharing |
| Learner to Creator | Challenge design mode, community publishing, solution viewing, recognition system |
| Quality & Scoring | Admin dashboard, content review, scoring calibration, pattern monitoring |

## Domain-Specific Requirements

### EdTech Domain Concerns

**Learning Effectiveness Validation:**
- Platform must demonstrate actual learning outcomes, not just engagement metrics
- Reasoning score correlation with expert developer judgment is the primary validation metric (>0.7 target)
- Progressive difficulty calibration must maintain "tear but don't break" zone

**Content Quality Assurance:**
- Challenge accuracy validated before publication
- Progressive difficulty sequences follow pedagogical soundness principles
- Visual metaphors tested with users before publication

**Data Privacy:**
- User learning data, progress tracking, and behavioral analytics handled responsibly
- Transparent data practices — users understand what's tracked and why
- No selling or sharing of user learning behavioral data

### DevTools Domain Concerns

**Technical Accuracy:**
- Algorithm visualizations technically correct — no simplifications that misrepresent concepts
- Logic block semantics accurately represent computational primitives
- Scoring algorithms align with established CS education research

**Browser Compatibility:**
- Must work across Chrome, Firefox, Safari, Edge (latest 2 versions)
- Canvas-based interactions degrade gracefully on lower-end devices

### Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Teaching incorrect algorithms/concepts | Expert review pipeline for all challenge content |
| Gamification undermining learning | Anti-gaming measures: Explain Your Thinking Gate, insight streaks over login streaks |
| Users gaming the scoring system | Multi-dimensional scoring, iteration tracking, reasoning explanation requirement |
| Poor learning outcomes despite engagement | Reasoning score correlation validation against expert judgment |
| Visual metaphor confusion | User testing of metaphors before publication |

## Innovation & Novel Patterns

### Detected Innovation Areas

**No-Code Reasoning Before Syntax:** Challenges the assumption that learning to code requires writing code. Users construct algorithmic thinking visually in plain language — cognitive skill that transfers to any language. No major DSA platform teaches reasoning without code first.

**Reasoning Path Scoring Over Correctness:** Replaces binary pass/fail with multi-dimensional process scoring: problem breakdown quality, edge case proactivity, structure efficiency, iteration improvement. Users who struggle, iterate, and improve score higher than those who guess correctly immediately.

**Systematic Visual Metaphor Library:** 11 physical metaphors make abstract DSA concepts physically intuitive — arrays as sliding strips (O(n) becomes visible effort), linked lists as paper clips (pointers become connections), recursion as nesting dolls (call stack becomes spatial). No platform does this systematically.

**Prediction-Based Learning Gates:** Users predict "what happens next" before seeing algorithm execution. Wrong predictions highlight the gap between intuition and reality — the "oh, I was wrong" moment where genuine learning occurs. Research-backed, rare in practice.

**Challenge Design Mode as Mastery Proof:** Users create challenges for the community after mastering concepts. Designing good challenges forces highest-level understanding. Generates infinite community content while proving mastery.

### Validation Approach

- **Reasoning Score Correlation:** Validate reasoning scoring against expert developer judgment — target >0.7 correlation across challenge types
- **Visual Metaphor User Testing:** Test each metaphor with 5-10 developers before publication — validate that users report "this makes the concept clearer"
- **Prediction Gate Effectiveness:** Measure learning retention for users who use prediction gates vs. passive observation — target improved retention
- **Challenge Design Quality:** Validate community-created challenges meet pedagogical standards before publication — expert review pipeline

### Risk Mitigation

| Innovation Risk | Mitigation |
|-----------------|------------|
| No-code approach doesn't transfer to actual coding | Progressive variant system includes code export option; users who master reasoning can apply to any language |
| Reasoning scoring feels subjective to users | Multi-dimensional scoring with visible rubrics; expert correlation validation; explanation requirement |
| Visual metaphors confuse more than clarify | Rigorous user testing before publication; fallback to standard representations if metaphor fails |
| Prediction gates frustrate rather than engage | Only used for new concepts; progressive difficulty; wrong predictions become learning moments, not failures |
| Community-created challenges vary wildly in quality | Expert review pipeline before publication; community rating system; creator mastery requirements |

## Web Application Specific Requirements

### Project-Type Overview

logiq is a multi-page interactive web application featuring a visual drag-and-drop canvas, animated algorithm visualizations, progressive skill mapping, and optional real-time collaboration.

### Technical Architecture Considerations

**Browser Support Matrix:**
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iPad Safari for tablet-like usage
- Canvas interactions degrade gracefully on lower-end devices

**Responsive Design:**
- Desktop-first (primary usage at workstations)
- Tablet support for iPad Safari
- Mobile responsive for account management, progress viewing, community — not core canvas interaction

**Performance Targets:** Detailed in Non-Functional Requirements section.

**SEO Strategy:**
- Public landing pages SEO-optimized
- Application content behind authentication — SEO not required
- Focus: "visual DSA learning," "no-code reasoning," "developer problem-solving platform"

**Accessibility Level:** Detailed in Non-Functional Requirements section (WCAG 2.1 AA).

### Implementation Considerations

**Real-Time Collaboration:**
- Optional feature (Shared Visual Canvas for group challenges)
- WebSocket-based synchronization
- Conflict resolution for simultaneous edits
- Presence indicators
- Graceful degradation on connection drop

**Canvas Technology:**
- HTML5 Canvas or SVG for drag-and-drop logic blocks
- WebGL for complex algorithm visualizations
- Touch support for tablet usage
- Block snapping physics and connection validation

**State Management:**
- Complex state: user progress, reasoning scores, insight moments, challenge variants
- Local storage for offline draft work
- Server-synced progress for account continuity

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — core value is the "aha!" moment of genuine understanding. Minimum useful product: working logic block canvas, visual feedback on success/failure, clear next step on skill map.

**Resource Requirements:** Minimum viable team of 5 roles working collaboratively on parallel tracks:
- Frontend Developer (canvas interactions, visualization, responsive UI)
- Backend Developer (scoring engine, progression system, data management)
- UX/UI Designer (visual metaphors, canvas UX, skill map, gamification UI)
- Content Designer (challenge design, progressive difficulty, variant creation)
- Domain Expert (CS education research alignment, scoring validation)

Tasks designed for collaborative parallel work with clear interface contracts.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Reasoning Breakthrough — first challenge, aha moment, progression
- Productive Failure — failure visualization, hint gating, bottleneck detection

**Must-Have Capabilities:**
- Logic Block Canvas with drag-and-connect interaction (full block vocabulary)
- Guided Linear Skill Path with sequential unlocking (1-3 challenges at a time)
- Reasoning Path Scoring engine (4 dimensions)
- Progressive Variant System (2-3 variants per challenge)
- Visual Metaphor Library (all 11 metaphors)
- Failure Visualization Engine with step-through execution
- Micro-Concept Cards for new concept introductions
- Hint Gating System (unlock after 2-3 attempts)
- Checkpoint Gating for skill cluster progression
- Edge Case Stress Test with red failure highlighting
- Prediction Gate for new concepts
- Insight Streaks tracking
- Aha! Moment Tracker
- Post-Solve Solution Sharing (gated behind completion)

### Post-MVP Features

**Phase 2 (Growth):**
- Friend Activity Feed & Micro-Leaderboards
- Group Challenge Projects (optional team projects)
- Bottleneck Detection & Intervention (automated mini-challenges)
- Shared Visual Canvas (real-time co-editing for collaboration)
- Challenge Design Mode (user-generated community content)
- Faded Worked Examples (progressive scaffolding)
- Solution Comparison Mode (trade-off evaluation)
- Error-Finding Challenges (debugging practice)
- Multiple Solution Exploration (revisit with different approaches)
- Failure Pattern Library (common failure patterns display)
- Explain Your Thinking Gate (reasoning articulation before progression)

**Phase 3 (Expansion):**
- Immune System Learning Model paradigm refinement
- Progressive Overload Training calibration optimization
- Neural Network Trial-and-Error metaphor integration
- Multi-language code export from visual logic solutions
- Advanced analytics dashboard for deep reasoning pattern analysis
- Complete community-driven content ecosystem at scale

### Risk Mitigation Strategy

**Technical Risks:** Complex technicalities across canvas interaction, scoring engine accuracy, visualization performance, real-time synchronization. Mitigation: parallel development with clear interface contracts, early prototyping of highest-risk components (canvas + scoring), iterative validation against expert judgment.

**Market Risks:** Core assumption — developers will engage with no-code visual approach when expecting to write code. Mitigation: early user testing (5-10 developers) with canvas prototype, clear positioning that reasoning transfers to any language, code export option in progressive variants.

**Resource Risks:** Complex feature set requires sustained collaborative effort. Mitigation: phased development focuses MVP on core learning experience, growth features added incrementally, community features depend on user base maturity.

## Functional Requirements

### Challenge Interaction

- FR1: Users can drag and connect visual logic blocks to construct algorithm solutions on a canvas
- FR2: Users can test their visual logic solution against challenge test cases
- FR3: Users can add edge case handling blocks to their logic flow
- FR4: Users can revise and iterate on their logic solution after failure
- FR5: Users can view the execution steps of their constructed logic flow

### Learning Progression

- FR6: Users can view the full skill map territory showing all concepts ahead
- FR7: Users can access sequentially unlocked challenges (1-3 at a time)
- FR8: Users can receive challenge variants after completing a challenge
- FR9: Users can complete checkpoint challenges to unlock next skill clusters
- FR10: Users can receive targeted mini-challenges when stuck on specific sub-skills
- FR11: Users can access hints after multiple failed attempts on a challenge

### Reasoning Evaluation

- FR12: Users can see their reasoning path score across multiple dimensions (problem breakdown, edge case proactivity, structure efficiency, iteration improvement)
- FR13: Users can view the reasoning scoring rubric explaining how scores are calculated
- FR14: Users can receive dimension-specific feedback on their reasoning quality

### Visual Learning

- FR15: Users can interact with 11 visual metaphors representing core DSA concepts (arrays, linked lists, stacks, queues, trees, graphs, hash maps, binary search, recursion, DP, two pointers)
- FR16: Users can watch algorithm execution visualized step-by-step
- FR17: Users can see failure points highlighted in their logic flow when tests fail
- FR18: Users can predict algorithm behavior before seeing execution results (prediction gates)
- FR19: Users can access micro-concept cards introducing new concepts with visual diagrams

### Gamification & Motivation

- FR20: Users can track consecutive insight moments as streaks
- FR21: Users can see their "aha!" moments when solution paths dramatically improve
- FR22: Users can view their personal breakthrough timeline showing cognitive growth over time

### Community & Collaboration

- FR23: Users can view alternative solution approaches after completing a challenge
- FR24: Users can view friends' progress and activity in a personal feed
- FR25: Users can participate in optional group challenge projects
- FR26: Users can design and publish challenges for the community after mastering concepts
- FR27: Users can attempt community-created challenges
- FR28: Users can view multiple solution approaches to the same problem
- FR29: Users can earn and view community recognition badges

### User Account & Progress

- FR30: Users can create and manage their learning account
- FR31: Users can view their progress across all skill areas over time
- FR32: Users can see their reasoning growth metrics visualized
- FR33: Users can access their challenge history and completion status

### Content Management

- FR34: Content designers can create challenges with test cases and edge cases
- FR35: Content designers can define progressive difficulty sequences for skill paths
- FR36: Expert reviewers can validate challenge content for technical accuracy
- FR37: Expert reviewers can calibrate reasoning scoring algorithms against expert judgment

### Administration & Analytics

- FR38: Administrators can review scoring correlation data against expert judgment
- FR39: Administrators can review and approve community-created challenges
- FR40: Administrators can monitor failure pattern library accuracy
- FR41: Administrators can recalibrate scoring algorithm parameters
- FR42: Administrators can analyze user learning outcome data

## Non-Functional Requirements

### Performance

- NFR1: Logic block canvas interactions (drag, snap, connect) respond within 100ms
- NFR2: Algorithm visualization animations render at 60fps
- NFR3: Initial application page loads within 3 seconds on broadband connection
- NFR4: Skill map and dashboard interactions feel instant (<500ms response)
- NFR5: Real-time co-editing sessions maintain <200ms synchronization latency
- NFR6: Reasoning score calculation completes within 2 seconds after solution submission
- NFR7: System supports concurrent usage of 10,000 active users without performance degradation

### Security

- NFR8: All user data encrypted at rest and in transit (TLS 1.3)
- NFR9: User authentication sessions expire after 30 days of inactivity
- NFR10: User learning behavioral data is never sold or shared with third parties
- NFR11: API endpoints protected against common web vulnerabilities (XSS, CSRF, SQL injection)
- NFR12: Community-created challenges scanned for malicious content before publication

### Scalability

- NFR13: System supports 10x user growth from initial launch with <10% performance degradation
- NFR14: Challenge content delivery scales to support concurrent access during peak usage periods
- NFR15: Community challenge storage scales to support infinite user-generated content growth
- NFR16: Database architecture supports horizontal scaling for read-heavy workloads (progress tracking, solution viewing)

### Accessibility

- NFR17: Web application meets WCAG 2.1 AA compliance standards
- NFR18: Visual canvas supports keyboard navigation for all logic block interactions
- NFR19: Screen reader alternatives provided for all visual metaphors and algorithm visualizations
- NFR20: Color choices in visualizations accommodate color-blind users (no red-green dependency)
- NFR21: Focus management implemented for all interactive canvas elements with ARIA labels

### Reliability

- NFR22: Application uptime target of 99.5% during business hours (learning sessions)
- NFR23: User progress and reasoning scores persisted with zero data loss on session completion
- NFR24: Graceful degradation when real-time collaboration connection drops — local work saved
- NFR25: Failed challenge submissions automatically retry without user intervention

