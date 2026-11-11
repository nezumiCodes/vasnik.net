---
title: "Measuring \"closest\": tools for matching people to pharmacies"
description: "What \"closest\" can mean, the tools for measuring it, how to allocate a caseload with capacity in mind, and the data protection questions to ask first."
pubDate: 2026-11-18
tags:
  - health-and-care
  - data-analysis
  - geospatial
  - data-protection
  - pharmacy-access
heroImage: ../../assets/blog/measuring-tools-for-matching-people-to-pharmacies/hero.png
heroAlt: "\"People aren't crows.\" beside a map where a crow flies a straight 0.4-mile line from home across a river to the nearest pharmacy, while the real route crosses a bridge and passes a bus stop to a different pharmacy 2.3 miles away."
heroCredit:
  author: Crow Vectors
  authorUrl: https://www.vecteezy.com/free-vector/crow
  source: Vecteezy
  sourceUrl: https://www.vecteezy.com
draft: true
---

In Part 1 I argued that a client not using their nearest pharmacy is a question to ask, not an error to fix. But to even ask the question, you need to know which pharmacy *is* nearest. I assumed that would be the easy bit. It took me about a day (not long, I know, but even a day can be too long when some things are urgent) to realise that "nearest" depends entirely on how you measure, and about a week to stop finding new ways it could be wrong.

This post covers what "closest" can mean, the free, self-hosted and commercial tools for measuring it, how to go from "nearest pharmacy" to an allocation that respects capacity, client restrictions, and the data protection questions to ask before you send anyone's postcode anywhere.

There isn't any code in this post, as the aim is to help you choose an approach that fits your own service. Part 3 will include a self-hosted implementation that anyone can use and adjust for their service's needs.

## What does "closest" actually mean?

There are at least four reasonable answers, and they don't always agree:

- **As the crow flies.** The straight-line (geodesic) distance between two points. Quick to calculate and needs nothing but coordinates, meaning it's also blissfully unaware of rivers, railway lines, motorways and that one footbridge that's been closed since 2019.
- **Walking route.** Distance along real streets and footpaths. Much closer to what someone on foot experiences, but it depends on how good the map data is.
- **Driving.** Useful for some rural areas, but many people collecting daily doses don't drive, so on its own it can flatter the picture.
- **Public transport.** Often the most realistic for daily journeys of more than a mile or so, and by far the hardest to calculate. It depends on the time of day, the day of the week, weather and traffic conditions, and whether the 8.10 bus actually turns up, even on a sunny day.

The research is mixed on how much this matters. Straight-line distance [consistently underestimates real road distance and travel time](https://flore.unifi.it/retrieve/e398c37d-1aae-179a-e053-3705fe0a4cff/BMC_09_Shahid_et_al.pdf) [1]. A Cardiff University study found that [network distances assigned a larger share of households to the correct GP](https://orca.cardiff.ac.uk/id/eprint/88517/1/201504746.pdf) than straight lines did, especially outside cities [2]. On the other hand, a nationwide US comparison concluded that for non-emergency trips to hospital, [switching from straight-line to travel distance made little practical difference](https://www.ingentaconnect.com/content/routledg/rtpg20/2012/00000064/00000002/art00003) [3].

Even well-known UK figures lean on the simple version. The often-quoted finding that [89% of people in England live within a 20-minute walk of a community pharmacy](https://bmjopen.bmj.com/content/4/8/e005764) was calculated with 1.6 km straight-line circles around each pharmacy, and the authors are upfront that this is a limitation [4].

In my own analysis, I ran only straight-line and walking-route distances; the areas I was investigating have a good distribution of approved pharmacies with an average walking distance of about 0.5 miles.

For most clients the two methods agreed on the nearest pharmacy. For a noticeable minority they didn't: a pharmacy that looked closest on the map turned out to be further on foot, usually because something was in the way. Those were exactly the cases where a straight-line answer would have given a keyworker the wrong suggestion.

### A lesson from school admissions

If we want to see what happens when distance decides something people care about, let's take a look at schools. Councils use distance as a tie-breaker for admissions and to decide who gets free school transport, and they don't all measure it the same way.

Some use the shortest walking route. Others use a straight line, and some use both for different purposes. Kingston council consulted on switching its admissions measure from the shortest walking route to a straight line, partly because walking routes are [open to interpretation and left some parents feeling they'd been unfairly denied a place](https://kingston.moderngov.co.uk/ieDecisionDetails.aspx?AIId=19570). At the time, 20 of the 32 London boroughs already used straight-line measurement [5]. Ombudsman decisions show the arguments people have about the detail: which entrance counts, whether the coordinates were right, and whether a route is [safe to walk at all](https://www.lgo.org.uk/decisions/education/school-transport/25-021-591) [6].

The trade-off carries straight over to pharmacies. A straight line is simple and easy to explain. A walking or bus route is more realistic, but harder to check, and it depends on choices (which route, which time, which data) that someone can reasonably question.

Whichever you pick, write down what you measured and why, so that the result can be explained to the person it affects.

## The building blocks

Whatever tools you choose, the job breaks down into the same few steps: turn postcodes into coordinates, work out travel between every client and every approved pharmacy, then rank the options and flag the cases worth a conversation.

<figure class="figure-diagram">
<img src="/blog/measuring-tools-for-matching-people-to-pharmacies/postcodes_matching.drawio.svg" width="800" height="372" alt="Pipeline diagram titled 'Postcodes in, a shortlist out: the model suggests, people decide', inside a panel noting that every step can run on your own server. Two inputs, client postcodes (unique postcodes, no names attached) and a pharmacy list (the NHSBSA list joined to the approved list), feed a geocoding step (self-hosted postcodes.io). That feeds a travel matrix (walk, drive or bus, using OSRM, openrouteservice or r5py), which splits into two outputs: a shortlist with flags for the keyworker (top 3 approved options and gaps), and what-if planning (capacity-aware scenarios for service planning)." loading="lazy" decoding="async">
<figcaption>From postcodes to a shortlist and planning scenarios</figcaption>
</figure>

The same travel matrix feeds two outputs: a shortlist for each client's keyworker, and capacity-aware scenarios for people planning the service.

## The toolbox

I hoped there would be an off-the-shelf tool that takes a list of client postcodes and an approved pharmacy list and gives a sensible shortlist for each person. I couldn't find one built for drug and alcohol services. Instead there are good building blocks, free and paid, that each do part of the job.

<figure class="figure-diagram">
<img src="/blog/measuring-tools-for-matching-people-to-pharmacies/toolbox-table.png" width="1200" height="860" alt="Table comparing nine tools by use, cost and limits, whether they can be self-hosted, and what to watch out for. postcodes.io: geocoding UK postcodes, free and open source, self-hostable with Docker; the public API receives every postcode you send. NHSBSA Consolidated Pharmaceutical List: every pharmacy in England with ODS code, address and hours, free and updated quarterly; it doesn't say who offers supervised consumption. OSRM public server: walking, cycling and driving matrices, free for reasonable non-commercial use at 1 request a second, self-hostable; no uptime guarantee and requests are logged. openrouteservice: matrices, isochrones and a QGIS plugin, 500 matrix requests a day free or 2,500 on the non-profit plan, self-hostable without limits. Bus Open Data Service with r5py or OpenTripPlanner: public transport times, free, self-hostable; setup takes effort and timetables show what should run, not what did. Google Routes API: all modes, 10,000 free elements a month then about $5 per 1,000, not self-hostable; costs grow fast. TravelTime: all modes including UK public transport, public sector counts as commercial so a paid licence is needed. SHAPE Place Atlas: area-level travel-time maps for planning, shows catchments rather than per-client answers. QGIS or ArcGIS Network Analyst: point-and-click matrices and location-allocation, still needs a routing service." loading="lazy" decoding="async">
<figcaption>The toolbox: building blocks for matching people to pharmacies. Numbers in brackets refer to the sources list.</figcaption>
</figure>

To put the costs in context, take 500 clients and 80 pharmacies: that's 40,000 origin-destination pairs. On Google, about 30,000 of those would be billable after the free allowance (10,000), roughly $150 for a single run, before any re-runs when the approved list changes. That's not a fortune. Still, on a tight budget it's hard to justify when the free and self-hosted options do the same job for walking and driving.

For what it's worth, my own script used a self-hosted copy of postcodes.io for geocoding and OSRM for walking distances, with a local cache so each postcode and route was only looked up once.

## From "nearest" to "allocation"

Finding the nearest pharmacy for one person is easy once you have a distance matrix: sort, pick the top. Allocating a whole caseload is a different problem, because pharmacies aren't infinitely elastic.

A few constraints change the answer:

- **Approved only.** The nearest pharmacy and the nearest *approved* pharmacy are separate columns in my output, because they're separate questions. If the overall nearest isn't approved, that's useful information for whoever manages the pharmacy contracts.
- **Capacity.** If one popular pharmacy is everyone's nearest, "send everyone to their nearest" fails on day one. Each pharmacy can only supervise so many people.
- **Opening hours.** A pharmacy that's closed on Sundays can't serve someone who needs a daily supervised dose seven days a week, unless other arrangements are in place.

The moment capacity comes in, you're into what operational researchers call a **location-allocation** problem. Its classic version is the p-median problem, which assigns people to facilities to keep the total travel as low as possible. Its capacitated cousin adds a limit on how many people each facility can take. To put it plainly: "get everyone as close as you can, without overfilling any pharmacy".

I think this topic is close to my heart because of Mini Metro and Mini Motorways. If you've played either game, you've already solved a rough version of this by hand. The game decides where the houses and destinations appear, and every passenger or car takes the shortest route through whatever network you've built. The job is to lay out the lines and roads so journeys stay short and nothing overflows. An overcrowded station is the game's version of a pharmacy over capacity, and the game ends when you get it wrong. Thankfully, a pharmacy allocation doesn't come with a countdown timer, which is exactly why I never made the top 50% on some cities.

Back to what I was saying, you don't need specialist software to solve a capacitated allocation. Python libraries such as PuLP and Google's OR-Tools solve it as an optimisation problem, and the PySAL spatial library's spopt package now includes a capacitated p-median model. Researchers at UCL used it to [place student teachers in schools using public transport travel times](https://eprints.gla.ac.uk/300535/1/300535.pdf), and found that getting usable public transport data was the hardest part [17], which matched my experience.

### Why the output should be a shortlist, not an instruction

Here Part 1 comes back in. An optimiser will happily tell you the arrangement with the shortest total travel, but it knows nothing about who works where, who wants privacy, or which pharmacist someone trusts.

So I'd use the two tools for different jobs:

- **For individuals:** a shortlist of the two or three nearest approved pharmacies by the most realistic mode, next to the current one, with a flag when the gap is large. That's something a keyworker can bring into a conversation.
- **For planning:** the capacity-aware optimiser, run as "what if" scenarios. What happens if this pharmacy closes? Where would one more approved pharmacy help most? Which pharmacies are close to full? Those are questions for managers and commissioners, and no client gets moved by a model run.

Access needs from Part 1, such as disability, mobility and language, fit in at a few points. Some work as filters, so the shortlist only shows pharmacies with step-free access or a staff member who speaks the client's language. The NHSBSA list doesn't hold that information, so it means adding your own columns to the approved list and checking them with each pharmacy.

Mobility can also change how you measure travel: openrouteservice has a wheelchair profile, or you can set a shorter maximum walking distance. Anything that doesn't fit neatly into a column belongs in the keyworker's conversation.

Disability and health needs are special category data under UK GDPR, so keep them on your side of the process and never send them to a routing service.

## Data protection: think before you geocode

This is a short section, but it's the most important one.

A postcode feels harmless, but in health and care it's personal data. NHS information governance policies list it as an identifier, and note that a single postcode, [especially an isolated one, can identify someone](https://royalwolverhampton.nhs.uk/wp-content/uploads/2024/10/17694_OP_111_PUBLIC_REDACTED_Policy_Printable_Version_Redacted.pdf) on its own or combined with other details [18]. A list of postcodes sent from a health or care service is, by context alone, a list of people in treatment.

Researchers have flagged that common geocoding approaches send patient addresses over the internet to third-party services, which [discloses personally identifiable information](https://doaj.org/article/d975d9c74fdb4f3b91caca4a3f20a170) [19]. Free public services are generous, but they aren't private: the FOSSGIS routing server, for example, [saves route requests in its server logs](https://map.project-osrm.org/about.html) [21].

Pseudonymising the client list (swapping names for IDs) helps, but it doesn't take you outside the law. Under UK GDPR, pseudonymisation is [a safeguard, not anonymisation](https://digitalregulations.innovation.nhs.uk/regulations-and-guidance-for-adopters/all-adopters-guidance/data-access-and-re-identification-risk-intervention/pdf/), so the data is still personal data [20].

Some practical steps:

1. **Talk to your information governance lead first.** A short data protection impact assessment is much easier before you've built anything.
2. **Send as little as possible.** Send unique postcodes only, with no IDs, names or anything else attached. The routing service doesn't need to know who lives there.
3. **Self-host where you can.** postcodes.io, OSRM and openrouteservice all run in Docker on a modest server or laptop, so client postcodes never leave your network.
4. **Use coarser locations when precision doesn't matter.** For planning questions, a postcode sector or neighbourhood centroid is often good enough.
5. **Cache and tidy up.** Cache results so you're not sending the same data again, and store the cache with the same care as the source data.

## What's next: a tool any service can run

Working on this, I realised that every drug and alcohol service (and plenty of other health and care services) faces the same question, and most are probably building their own spreadsheet or script from scratch.

So my next project, and the last part of this series, is an open, self-hostable version that any service can run on its own infrastructure. The plan is:

- postcodes.io and a routing engine running locally in Docker, so no client data leaves the building
- the NHSBSA pharmacy list loaded automatically, joined to the service's own approved list and capacity
- walking and driving distances as standard, with public transport as an option for areas where it matters
- a shortlist per client and flags for large gaps, missing addresses and pharmacies that have closed or changed hours
- optional "what if" planning scenarios with a capacity-aware optimiser

If your service has tackled this, or you'd like to test it when it's ready, I'd love to hear from you.

## Sources

1. Shahid, R., Bertazzon, S., Knudtson, M.L. and Ghali, W.A. (2009). *Comparison of distance measures in spatial analytical modeling for health service planning*. BMC Health Services Research. [https://flore.unifi.it/retrieve/e398c37d-1aae-179a-e053-3705fe0a4cff/BMC_09_Shahid_et_al.pdf](https://flore.unifi.it/retrieve/e398c37d-1aae-179a-e053-3705fe0a4cff/BMC_09_Shahid_et_al.pdf)
2. Cardiff University ORCA (n.d.). *Quantifying the error associated with Euclidean and network distance accessibility methods*. Accessed 4 November 2026. [https://orca.cardiff.ac.uk/id/eprint/88517/1/201504746.pdf](https://orca.cardiff.ac.uk/id/eprint/88517/1/201504746.pdf)
3. Boscoe, F.P., Henry, K.A. and Zdeb, M.S. (2012). *A nationwide comparison of driving distance versus straight-line distance to hospitals*. The Professional Geographer, 64(2). [https://www.ingentaconnect.com/content/routledg/rtpg20/2012/00000064/00000002/art00003](https://www.ingentaconnect.com/content/routledg/rtpg20/2012/00000064/00000002/art00003)
4. Todd, A., Copeland, A., Husband, A., Kasim, A. and Bambra, C. (2014). *The positive pharmacy care law: an area-level analysis of the relationship between community pharmacy distribution, urbanity and social deprivation in England*. BMJ Open, 4(8). [https://bmjopen.bmj.com/content/4/8/e005764](https://bmjopen.bmj.com/content/4/8/e005764)
5. Royal Borough of Kingston upon Thames (n.d.). *Decision details: method of measuring home to school distance*. Accessed 4 November 2026. [https://kingston.moderngov.co.uk/ieDecisionDetails.aspx?AIId=19570](https://kingston.moderngov.co.uk/ieDecisionDetails.aspx?AIId=19570)
6. Local Government and Social Care Ombudsman (2025). *North Yorkshire Council (25 021 591)*. [https://www.lgo.org.uk/decisions/education/school-transport/25-021-591](https://www.lgo.org.uk/decisions/education/school-transport/25-021-591)
7. Postcodes.io (n.d.). *Self host (Docker)*. Accessed 4 November 2026. [https://api.postcodes.io/docs/self-host](https://api.postcodes.io/docs/self-host)
8. NHS Business Services Authority (2024). *Consolidated Pharmaceutical List*. Accessed 4 November 2026. [https://opendata.nhsbsa.net/dataset/consolidated-pharmaceutical-list/resource/60da93f7-3100-4ce1-995f-f2dcfb766949](https://opendata.nhsbsa.net/dataset/consolidated-pharmaceutical-list/resource/60da93f7-3100-4ce1-995f-f2dcfb766949)
9. Project OSRM (n.d.). *Demo server*. Accessed 4 November 2026. [https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server](https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server)
10. FOSSGIS e.V. (n.d.). *Nutzungsbedingungen / Terms of use*. Accessed 4 November 2026. [https://fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen](https://fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen)
11. openrouteservice (n.d.). *Plans*. Accessed 4 November 2026. [https://openrouteservice.org/plans/](https://openrouteservice.org/plans/)
12. Department for Transport (2020). *Find and use bus open data*. GOV.UK. [https://www.gov.uk/guidance/find-and-use-bus-open-data](https://www.gov.uk/guidance/find-and-use-bus-open-data)
13. r5py (n.d.). *Quickstart*. Accessed 4 November 2026. [https://r5py-fork.readthedocs.io/en/main/user-guide/user-manual/quickstart.html](https://r5py-fork.readthedocs.io/en/main/user-guide/user-manual/quickstart.html)
14. Woosmap (2026). *Google Maps API pricing in 2026: what your UK store locator actually costs*. Accessed 4 November 2026. [https://www.woosmap.com/en-gb/blog/google-maps-api-pricing-breakdown](https://www.woosmap.com/en-gb/blog/google-maps-api-pricing-breakdown)
15. TravelTime (n.d.). *API pricing*. Accessed 4 November 2026. [https://traveltime.com/analytics/api-pricing](https://traveltime.com/analytics/api-pricing)
16. Medway Council (2018). *Pharmaceutical Needs Assessment 2018: Appendix D, travel time analysis*. [https://www.medway.gov.uk/download/downloads/id/2212/appendix_d_travel_time_analysis.pdf](https://www.medway.gov.uk/download/downloads/id/2212/appendix_d_travel_time_analysis.pdf)
17. Bearman, N., Xu, R., Roddy, P.J., Gaboardi, J.D. and Zhao, Q. (n.d.). *Developing capacitated p-median location-allocation model in the spopt library to allow UCL student teacher placements using public transport*. University of Glasgow Enlighten. [https://eprints.gla.ac.uk/300535/1/300535.pdf](https://eprints.gla.ac.uk/300535/1/300535.pdf)
18. The Royal Wolverhampton NHS Trust (2022). *OP111 Anonymisation and pseudonymisation policy*. [https://royalwolverhampton.nhs.uk/wp-content/uploads/2024/10/17694_OP_111_PUBLIC_REDACTED_Policy_Printable_Version_Redacted.pdf](https://royalwolverhampton.nhs.uk/wp-content/uploads/2024/10/17694_OP_111_PUBLIC_REDACTED_Policy_Printable_Version_Redacted.pdf)
19. Rundle, A.G., Bader, M.D.M. and Mooney, S.J. (2022). *The disclosure of personally identifiable information in studies of neighborhood contexts and patient outcomes*. Journal of Medical Internet Research, 24(3), e30619. [https://doaj.org/article/d975d9c74fdb4f3b91caca4a3f20a170](https://doaj.org/article/d975d9c74fdb4f3b91caca4a3f20a170)
20. NHS AI and Digital Regulations Service (n.d.). *Data access and re-identification risk intervention*. Accessed 4 November 2026. [https://digitalregulations.innovation.nhs.uk/regulations-and-guidance-for-adopters/all-adopters-guidance/data-access-and-re-identification-risk-intervention/pdf/](https://digitalregulations.innovation.nhs.uk/regulations-and-guidance-for-adopters/all-adopters-guidance/data-access-and-re-identification-risk-intervention/pdf/)
21. FOSSGIS (n.d.). *OSRM routing server using OpenStreetMap data: about*. Accessed 4 November 2026. [https://map.project-osrm.org/about.html](https://map.project-osrm.org/about.html)
