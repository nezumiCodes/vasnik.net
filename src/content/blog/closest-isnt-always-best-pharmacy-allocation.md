---
title: "Closest isn't always best: what a pharmacy allocation review taught me"
description: "Why clients in drug and alcohol treatment don't always use their nearest pharmacy, and why that's a question to ask rather than an error to fix."
pubDate: 2026-11-11
tags:
  - health-and-care
  - public-health
  - service-design
  - data-analysis
  - harm-reduction
  - accessibility
  - pharmacy-access
heroImage: ../../assets/blog/closest-isnt-always-best-pharmacy-allocation/hero.png
heroAlt: "\"People aren't crows.\" beside a map where a crow flies a straight 0.4-mile line from home across a river to the nearest pharmacy, while the real route crosses a bridge and passes a bus stop to a different pharmacy 2.3 miles away."
heroCredit:
  author: Crow Vectors
  authorUrl: https://www.vecteezy.com/free-vector/crow
  source: Vecteezy
  sourceUrl: https://www.vecteezy.com
medium:
  url: https://medium.com/@nezuminet/closest-isnt-always-best-what-a-pharmacy-allocation-review-taught-me-6d01586e3aac
  original: true
---

Recently we reviewed which pharmacies our clients are picking up their prescriptions from, and a pattern jumped out straight away; a good number of clients weren't collecting from their nearest approved pharmacy. Some were travelling noticeably further than they needed to.

My first instinct was to treat it as a data and optimisation problem. Find everyone's nearest pharmacy from our approved list, compare it with the one they use, list the gaps. I did write that script (Part 2 covers it), but once I had the results I realised that working out the nearest pharmacy was the easy bit. Numbers are great for showing us an image of what's happening, but not the why. What I actually wanted to know was *why* people end up where they do, and whether some of them are struggling with a journey nobody has asked them about.

This is Part 1 of a three-post series and covers the people and the service around them. Part 2 looks at what "closest" means and the tools you can use to measure it. Part 3 will offer a working self-hosted solution that anyone can use while keeping sensitive client data secure.

## Why distance matters more than the prescription

First, some numbers for scale. In England, an estimated [310,718 people used opiates, crack cocaine or both in 2022 to 2023](https://www.gov.uk/government/publications/opiate-and-crack-cocaine-use-prevalence-estimates-2022-to-2023/estimates-of-opiate-and-crack-use-in-england-2022-to-2023-main-points-and-methodology) \[1\]. In the same year, [138,604 adults were in treatment for opiates (with or without crack), and another 8,045 for crack without opiates](https://www.gov.uk/government/statistics/substance-misuse-treatment-for-adults-statistics-2022-to-2023/adult-substance-misuse-treatment-statistics-2022-to-2023-report) \[2\] - a little under half of the estimated total. The two figures cover slightly different age ranges (15 to 64 for the estimate, 18 and over for treatment), so treat it as a rough guide rather than an exact rate. Around 40,000 people started treatment for opiates or crack that year: 14,300 for opiates alone, 20,158 for opiates and crack together, and 5,444 for crack alone \[2\].

Prescribing is where pharmacies come in. In 2022 to 2023, 53% of adults in treatment received at least one prescribing intervention, and 85% of them were in the opiate group \[2\]. For many of them, treatment means regular trips to a community pharmacy.

If you collect a repeat prescription once a month, a pharmacy two miles away is a mild inconvenience. For many people in drug treatment the maths is very different.

People starting opioid substitution treatment (methadone or buprenorphine) usually take their dose under a pharmacist's supervision, often daily, and [UK clinical guidance](https://assets.publishing.service.gov.uk/media/5a821e3340f0b62305b92945/clinical_guidelines_2017.pdf) suggests this normally lasts for [about the first three months](https://cpci.communitypharmacy.org.uk/wp-content/uploads/sites/145/2024/08/Islington-SSA-Specification-2023-2025-FINAL.pdf), depending on the person's circumstances  \[3\]\[4\]. Supervision makes sure the dose is taken as prescribed and reduces the risk of medication being diverted. It also gives the pharmacist regular contact with the person, which could help identify further client considerations and potential safeguarding issues.

The catch is a trip to the pharmacy most days, whatever the weather and whatever else is going on that week. A detour that adds twenty minutes each way comes to around four hours a week, and travel costs money. An Australian survey found people in opioid agonist treatment spent around [an eighth of their income on treatment-related out-of-pocket costs, travel included](https://ro.uow.edu.au/test2021/3947), and the burden was heaviest for people newer to treatment, who get fewer take-home (unsupervised) doses [5].

Research also links distance with how treatment goes. Most of it comes from the US, where specialist clinics dispense methadone rather than high street pharmacies, so it doesn't transfer neatly. The findings do point the same way, though: in one US county, [people living further from their clinic missed more doses, particularly in the first 90 days](https://labs.wsu.edu/chase/?p=361) [6], and a larger US study found [retention was higher for people living five miles or less from treatment](https://stacks.cdc.gov/view/cdc/155116) [7].

These US distances need translating, however. Methadone there is dispensed from specialist clinics as mentioned, which are far outnumbered by pharmacies. A nationwide study counted [1,682 clinics against 69,475 pharmacies](https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2768026), roughly 40 pharmacies for every clinic, and found the average one-way drive was 20.4 minutes to a clinic but 4.5 minutes to a pharmacy [8]. Against that backdrop, living within five miles of treatment counts as close, and US research has linked [distances beyond 10 miles with people dropping out of methadone treatment](https://pmc.ncbi.nlm.nih.gov/articles/PMC9020371) [9]. England is the opposite case: an estimated [89% of people live within a 20-minute walk of a community pharmacy](https://bmjopen.bmj.com/content/4/8/e005764) [10], so a five-mile trip to collect a daily dose would be unusually far.

In the UK, supervision in community pharmacies already spares people a daily trip to one central clinic. Getting the most out of that means checking that the pharmacy each person uses actually suits them.

## So why doesn't everyone use the nearest one?

Once I stopped treating "not the nearest" as an error, most of the reasons were easy to guess. Some were in case notes and keyworkers knew others (which raised a separate question: why is information this important buried in free-text notes and word-of-mouth?). For some clients, nobody had recorded anything.

### Life doesn't happen at home

Distance is measured from the home postcode, but people are often somewhere else when they need their dose. If you work in the town centre, a pharmacy next to your workplace beats one round the corner from home that's only open while you're at work. The school run, a partner's house, a regular appointment and the bus route you already take all pull the same way.

Local service specifications ask that the need for supervised consumption takes account of social factors such as [employment and childcare](https://halton-st-helens-knowsley.communitypharmacy.org.uk/wp-content/uploads/sites/45/2025/04/Supervised-Consumption-Service-Specification-25-26-Final.docx) [11]. I'd apply the same thinking to *where* the supervision happens.

### Relationships and how people are treated

A Glasgow study of more than 500 patients receiving opioid substitution treatment from community pharmacies found that [positive staff attitudes, privacy and the other health services on offer were key factors in choosing a pharmacy](https://stir.ac.uk/research/hub/publication/575096) [12].

That matches what you'd expect. If a pharmacist has been kind to you through a rough patch, you're unlikely to swap them for one 400 metres closer. One bad experience can work the other way and have someone walking past a pharmacy every day to get to another.

### Privacy, anonymity and stigma

A distance calculation can't see this at all. A UK qualitative study of people's journeys through opioid agonist treatment found [pharmacies were a particularly strong source of stigma](https://mdpi.com/1660-4601/20/2/1526/htm), both experienced and anticipated [13]. People described worrying about being seen and judged in places where staff or other customers might know them.

So the nearest pharmacy might be the one where your neighbour works, where your friends collect their prescriptions, or where the person behind the counter went to school with you. Choosing one a bus ride away is a reasonable way to keep your treatment to yourself. Unfortunately we can't erase stigma, so we learn to avoid it.

National guidance for pharmacies says people shouldn't normally be required to use separate entrances or queues, although [they may choose to](https://avonwilts.communitypharmacy.org.uk/wp-content/uploads/sites/148/2026/03/Pharmacy-Supervised-Consumption.pdf) [14]. The guidance leaves that choice with the person, and I think a pharmacy review should too.

### Hours, safety and circumstances

A few other reasons came up, or are ones I'd now look for.

Opening hours matter; a pharmacy that closes at 5.30pm and shuts on Sundays isn't much use to someone who finishes work at 6pm. Some people avoid particular pharmacies because of who else uses them, whether that's people they're keeping away from as part of their recovery or someone they're in conflict with.

For people who are homeless there's no meaningful home postcode to measure from. The pharmacy near the day centre or hostel may be the only sensible answer, and that's fine, but their living situation might change quicker than it takes for their prescription to be refreshed and issued to another pharmacy. Other people stay where they were placed years ago, before they moved house, because changing feels like more hassle (or more risk) than it's worth.

### Access needs

For some clients the distance on a map hardly matters. A pharmacy 800 metres away up a steep hill, or across a busy road with no crossing, can be harder to reach than one two miles away on a direct, step-free bus, especially for someone who uses a wheelchair or can't walk far. Steps at the entrance or a consultation room that's hard to get into can rule a pharmacy out as well. The Equality Act 2010 expects service providers to [anticipate disabled people's needs and make reasonable adjustments](https://www.legislation.gov.uk/ukpga/2010/15/notes/division/3/16/19) [15], but that's little comfort if the pharmacy nearest your home is the one you can't get into.

Language and communication come into it too. Someone may stay with a pharmacy where the staff speak their language, or where the team already knows how to support their hearing loss, sight loss or learning disability. Pharmacies, like other NHS and public health services, must follow the [Accessible Information Standard](https://adultsocialcare.standards.nhs.uk/published-standards/accessible-information), which covers communication needs linked to a disability, impairment or sensory loss [16].

Support for other languages is trickier. A pharmacist writing in The Pharmaceutical Journal cited a survey in which [86% of community pharmacy professionals had no access to language services at all](https://pharmaceutical-journal.com/article/opinion/pharmacy-is-failing-patients-with-language-barriers-we-must-do-better) [17], even though NHS England's [guidance for commissioners](https://www.england.nhs.uk/interpreting/) says a patient's language shouldn't affect the quality of their care [18]. If a client has found a pharmacy where people understand them, I wouldn't move them for a shorter journey.

Busy shops can also be hard for some people to manage, for example because of anxiety or sensory overload, and a quieter independent pharmacy further away may be the only one they can face every day.

## The system side: the nearest pharmacy might not want you (or be open)

Even when a client would happily use their nearest pharmacy, the service can't always put them there.

Pharmacies have limited space and staff time for supervised consumption, often with a single private area to do it in. Service specifications typically require the prescriber or keyworker to [contact the pharmacy first to check it has capacity to take the person](https://hw.communitypharmacy.org.uk/wp-content/uploads/sites/132/2026/03/Supervised-Consumption-Service-Specification.pdf) [19]. If the nearest one is full, the client goes to the next nearest, and that arrangement can stick long after a space frees up. One more issue that arises here is that there is no centralised system to check pharmacy capacities at any time, putting extra manual work on service staff to contact pharmacies for every new client or every change.

Not every pharmacy is signed up to deliver the service either, so the nearest pharmacy and the nearest *approved* pharmacy can be two different places.

The network itself is shrinking. England fell below 10,000 bricks-and-mortar community pharmacies [for the first time in decades, with 9,944 in March 2026](https://www.pharmacy.biz/england-pharmacies-below-10000-report/) [20], and closures have hit deprived areas hardest, with [35% of closures since 2015/16 in the most deprived fifth of the country](https://pharmaceutical-journal.com/?p=311220) [21]. Temporary closures add to the problem. Healthwatch England counted [nearly 14,000 temporary pharmacy closures in 2023](https://pharmaceutical-journal.com/?p=343713) [22], and the Pharmacists' Defence Association has warned how badly these affect [people who need supervised methadone every day](https://www.the-pda.org/wp-content/uploads/PDA-written-evidence-to-the-Public-Account-Inquiry-Reducing-the-harm-from-illegal-drugs.pdf) [23]. A client's nearest pharmacy can change without them moving, so an allocation that made sense two years ago may not make sense now.

Underneath all of this, Community Pharmacy England is clear that [patients have a free choice of community pharmacy](https://cpe.org.uk/wp-content/uploads/2026/02/Patient-Choice-.pdf), and that steering that choice can damage trust [24]. Any review of allocations has to start from there.

## Reframing the question

A review that counts people "not at their nearest pharmacy" is really asking who is in the wrong place. We should be asking who might be travelling further than works for them without anyone having checked.

The first question sounds like an audit and puts people on the defensive. The second is a check-in, and only a keyworker who knows the person can really do it.

It changed how I use the output of the analysis:

1. A big gap between someone's current pharmacy and the nearest approved one is a reason to ask, nothing more. Plenty of people will have a good reason and be happy where they are.
2. Record the reason. "Near work", "prefers privacy" and "pharmacy at capacity when referred" are all valid answers. Once they're written down, nobody gets asked the same question at every review, and patterns show up: if lots of people avoid one pharmacy, the service should know.
3. Follow up the long journeys with no known reason. Those are the people who might have been placed somewhere temporarily and never moved, or who might be finding the journey hard.
4. Re-run the analysis when a pharmacy closes, changes its hours or comes off the approved list, because the nearest option changes for everyone around it.
5. Make sure anyone who'd *like* a closer or more convenient pharmacy knows they can ask, and help them move when they do (checking capacity first).

## Next up in Part 2

We have laid out the groundwork and considerations we need, as one should before building any solution. Next comes working out which pharmacy is actually nearest, and that's harder than it sounds. As the crow flies? On foot? By bus on a Tuesday morning? Councils have argued about this for school admissions for years, and the method you pick changes the answer.

In Part 2 I am planning to cover what "closest" can mean, the tools for measuring it (free, self-hosted and commercial), how to get from "nearest" to an allocation that respects capacity, and the data protection questions to ask before you send anyone's postcode to an API.

## Sources

1. Department of Health and Social Care and UK Health Security Agency (2025). *Estimates of opiate and crack use in England 2022 to 2023: main points and methodology*. GOV.UK. [https://www.gov.uk/government/publications/opiate-and-crack-cocaine-use-prevalence-estimates-2022-to-2023/estimates-of-opiate-and-crack-use-in-england-2022-to-2023-main-points-and-methodology](https://www.gov.uk/government/publications/opiate-and-crack-cocaine-use-prevalence-estimates-2022-to-2023/estimates-of-opiate-and-crack-use-in-england-2022-to-2023-main-points-and-methodology)
2. Office for Health Improvement and Disparities (2023). *Adult substance misuse treatment statistics 2022 to 2023: report*. GOV.UK. [https://www.gov.uk/government/statistics/substance-misuse-treatment-for-adults-statistics-2022-to-2023/adult-substance-misuse-treatment-statistics-2022-to-2023-report](https://www.gov.uk/government/statistics/substance-misuse-treatment-for-adults-statistics-2022-to-2023/adult-substance-misuse-treatment-statistics-2022-to-2023-report)
3. Department of Health (2017). *Drug misuse and dependence: UK guidelines on clinical management*. [https://assets.publishing.service.gov.uk/media/5a821e3340f0b62305b92945/clinical_guidelines_2017.pdf](https://assets.publishing.service.gov.uk/media/5a821e3340f0b62305b92945/clinical_guidelines_2017.pdf)
4. North Central London ICB (2023). *Islington Supervised Self Administration (SSA) of Methadone/Buprenorphine service specification 2023–2025*. Accessed 4 November 2026. [https://cpci.communitypharmacy.org.uk/wp-content/uploads/sites/145/2024/08/Islington-SSA-Specification-2023-2025-FINAL.pdf](https://cpci.communitypharmacy.org.uk/wp-content/uploads/sites/145/2024/08/Islington-SSA-Specification-2023-2025-FINAL.pdf)
5. University of Wollongong Research Online (n.d.). *Economic analysis of out-of-pocket costs among people in opioid agonist treatment: a cross-sectional survey in three Australian jurisdictions*. International Journal of Drug Policy. Accessed 4 November 2026. [https://ro.uow.edu.au/test2021/3947](https://ro.uow.edu.au/test2021/3947)
6. CHASE Lab, Washington State University (n.d.). *Spatial access to opioid treatment program and alcohol and cannabis outlets: analysis of missed doses of methadone*. Accessed 4 November 2026. [https://labs.wsu.edu/chase/?p=361](https://labs.wsu.edu/chase/?p=361)
7. Centers for Disease Control and Prevention (2024). *Barriers to retention in medications for opioid use disorder treatment in real-world practice*. Journal of Substance Use and Addiction Treatment, 160. [https://stacks.cdc.gov/view/cdc/155116](https://stacks.cdc.gov/view/cdc/155116)
8. Kleinman, R.A. (2020). *Comparison of driving times to opioid treatment programs and pharmacies in the US*. JAMA Psychiatry, 77(11), 1163. [https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2768026](https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2768026)
9. Joudrey, P.J. et al. (2020). *Methadone for opioid use disorder: decades of effectiveness but still miles away in the US*. JAMA Psychiatry, 77(11), 1105–1106. [https://pmc.ncbi.nlm.nih.gov/articles/PMC9020371](https://pmc.ncbi.nlm.nih.gov/articles/PMC9020371)
10. Todd, A., Copeland, A., Husband, A., Kasim, A. and Bambra, C. (2014). *The positive pharmacy care law: an area-level analysis of the relationship between community pharmacy distribution, urbanity and social deprivation in England*. BMJ Open, 4(8). [https://bmjopen.bmj.com/content/4/8/e005764](https://bmjopen.bmj.com/content/4/8/e005764)
11. Halton, St Helens and Knowsley (2025). *Supervised Consumption Service Specification 2025/26*. Accessed 4 November 2026. [https://halton-st-helens-knowsley.communitypharmacy.org.uk/wp-content/uploads/sites/45/2025/04/Supervised-Consumption-Service-Specification-25-26-Final.docx](https://halton-st-helens-knowsley.communitypharmacy.org.uk/wp-content/uploads/sites/45/2025/04/Supervised-Consumption-Service-Specification-25-26-Final.docx)
12. Laird, A., Hunter, C., Montgomery-Sardar, C., Fitzgerald, N. and Lowrie, R. (2016). *Community pharmacy-based opiate substitution treatment and related health services: a study of 508 patients and 111 pharmacies*. Journal of Public Health, 24(3). [https://stir.ac.uk/research/hub/publication/575096](https://stir.ac.uk/research/hub/publication/575096)
13. *Should I stay or should I go? A qualitative exploration of stigma and other factors influencing opioid agonist treatment journeys* (2023). International Journal of Environmental Research and Public Health, 20(2), 1526. [https://mdpi.com/1660-4601/20/2/1526/htm](https://mdpi.com/1660-4601/20/2/1526/htm)
14. Community Pharmacy Avon & Wiltshire (2026). *Pharmacy Supervised Consumption*, drawing on OHID guidance *Community pharmacy: delivering substance misuse services* (2024). Accessed 4 November 2026. [https://avonwilts.communitypharmacy.org.uk/wp-content/uploads/sites/148/2026/03/Pharmacy-Supervised-Consumption.pdf](https://avonwilts.communitypharmacy.org.uk/wp-content/uploads/sites/148/2026/03/Pharmacy-Supervised-Consumption.pdf)
15. Equality Act 2010, Explanatory Notes, Schedule 2: *Services and public functions: reasonable adjustments*. legislation.gov.uk. [https://www.legislation.gov.uk/ukpga/2010/15/notes/division/3/16/19](https://www.legislation.gov.uk/ukpga/2010/15/notes/division/3/16/19)
16. NHS England (n.d.). *Accessible Information Standard (DCB1605)*. Accessed 4 November 2026. [https://adultsocialcare.standards.nhs.uk/published-standards/accessible-information](https://adultsocialcare.standards.nhs.uk/published-standards/accessible-information)
17. The Pharmaceutical Journal (n.d.). *Pharmacy is failing patients with language barriers: we must do better*. Accessed 4 November 2026. [https://pharmaceutical-journal.com/article/opinion/pharmacy-is-failing-patients-with-language-barriers-we-must-do-better](https://pharmaceutical-journal.com/article/opinion/pharmacy-is-failing-patients-with-language-barriers-we-must-do-better)
18. NHS England (2018). *Guidance for commissioners: Interpreting and translation services in primary care*. [https://www.england.nhs.uk/interpreting/](https://www.england.nhs.uk/interpreting/)
19. Worcestershire (2025). *Service Specification: Supervised Methadone and Buprenorphine Consumption in Worcestershire*. Accessed 4 November 2026. [https://hw.communitypharmacy.org.uk/wp-content/uploads/sites/132/2026/03/Supervised-Consumption-Service-Specification.pdf](https://hw.communitypharmacy.org.uk/wp-content/uploads/sites/132/2026/03/Supervised-Consumption-Service-Specification.pdf)
20. Pharmacy Business (2026). *England's community pharmacies fall below 10,000*. Accessed 4 November 2026. [https://www.pharmacy.biz/england-pharmacies-below-10000-report/](https://www.pharmacy.biz/england-pharmacies-below-10000-report/)
21. The Pharmaceutical Journal (2024). *NHS data reveal net loss of more than 400 community pharmacies in England over the past year*. [https://pharmaceutical-journal.com/?p=311220](https://pharmaceutical-journal.com/?p=311220)
22. The Pharmaceutical Journal (2025). *Four pharmacies closed per week in 2024, says National Pharmacy Association*. [https://pharmaceutical-journal.com/?p=343713](https://pharmaceutical-journal.com/?p=343713)
23. Pharmacists' Defence Association (n.d.). *Written evidence to the Public Accounts Committee inquiry: Reducing the harm from illegal drugs*. Accessed 4 November 2026. [https://www.the-pda.org/wp-content/uploads/PDA-written-evidence-to-the-Public-Account-Inquiry-Reducing-the-harm-from-illegal-drugs.pdf](https://www.the-pda.org/wp-content/uploads/PDA-written-evidence-to-the-Public-Account-Inquiry-Reducing-the-harm-from-illegal-drugs.pdf)
24. Community Pharmacy England (2026). *Patient choice of pharmacy for clinical NHS pharmaceutical services*. [https://cpe.org.uk/wp-content/uploads/2026/02/Patient-Choice-.pdf](https://cpe.org.uk/wp-content/uploads/2026/02/Patient-Choice-.pdf)