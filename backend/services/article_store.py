"""
Centralized article store for demo topics.
Maps topic_id → list of articles matching existing schema.
"""

ARTICLE_STORE: dict[str, list[dict]] = {

    # ──────────────────────────────────────────
    # Topic 1: RBI Rate Decision (existing)
    # ──────────────────────────────────────────
    "rbi-rates-2026": [
        {
            "article_id": "et-10590",
            "headline": "RBI signals cautious stance ahead of policy review",
            "date": "2026-03-01",
            "author": "Aparna Iyer",
            "content": (
                "The Reserve Bank of India has signaled a cautious approach ahead of its "
                "upcoming monetary policy review, with Governor Shaktikanta Das reiterating "
                "that the central bank will not rush into rate cuts despite global easing "
                "trends. Speaking at a FICCI event, Das noted that India's inflation "
                "trajectory remains uncertain due to volatile food prices and geopolitical "
                "tensions. Bond traders are pricing in a hold, with the 10-year yield steady "
                "at 7.12%. Economists at SBI and ICICI Bank both predict the status quo will "
                "continue through Q2 2026."
            ),
        },
        {
            "article_id": "et-10597",
            "headline": "Food inflation rises to 7.2%, complicating RBI calculus",
            "date": "2026-03-15",
            "author": "Rajesh Mascarenhas",
            "content": (
                "India's food inflation surged to 7.2% in February, driven by a sharp rise "
                "in vegetable and pulse prices, complicating the Reserve Bank of India's path "
                "to rate cuts. The Consumer Price Index (CPI) headline inflation came in at "
                "5.8%, above the RBI's 4% target. Deputy Governor Michael Patra warned that "
                "premature monetary easing could destabilize inflation expectations. Analysts "
                "at Nomura and Goldman Sachs have pushed their rate cut forecasts to Q3 2026. "
                "The rupee weakened 0.4% against the dollar following the data release."
            ),
        },
        {
            "article_id": "et-10599",
            "headline": "RBI holds repo rate at 6.5%, signals inflation vigilance",
            "date": "2026-03-27",
            "author": "Aashish Aryan",
            "content": (
                "The Reserve Bank of India's Monetary Policy Committee voted 5-1 to keep the "
                "repo rate unchanged at 6.5% for the eighth consecutive meeting. Governor "
                "Shaktikanta Das cited persistent food inflation and global trade "
                "uncertainties as key factors. External MPC member Ashima Goyal dissented, "
                "arguing for a 25 basis point cut to support employment growth. Markets "
                "reacted positively — the Nifty 50 rose 0.6%, banking stocks gained 1.2%, "
                "and the 10-year bond yield fell 4 basis points to 7.08%. The committee "
                "maintained its withdrawal of accommodation stance, signaling no imminent "
                "easing."
            ),
        },
    ],

    # ──────────────────────────────────────────
    # Topic 2: Union Budget 2026
    # ──────────────────────────────────────────
    "budget-2026": [
        {
            "article_id": "et-20101",
            "headline": "FM Sitharaman hikes capex by 15% to Rs 11.1 lakh crore in Budget 2026",
            "date": "2026-02-01",
            "author": "Deepshikha Sikarwar",
            "content": (
                "Finance Minister Nirmala Sitharaman announced a 15% increase in capital "
                "expenditure to Rs 11.1 lakh crore in the Union Budget 2026-27, signaling "
                "the government's commitment to infrastructure-led growth. The allocation "
                "includes Rs 2.5 lakh crore for roads, Rs 1.8 lakh crore for railways, and "
                "Rs 1.2 lakh crore for defence modernization. The fiscal deficit target was "
                "maintained at 4.5% of GDP, reassuring markets about fiscal discipline. "
                "Infrastructure stocks surged 4-6% on the announcement, with L&T and IRB "
                "Infrastructure leading gains."
            ),
        },
        {
            "article_id": "et-20102",
            "headline": "Middle class gets income tax relief as new slab rates unveiled",
            "date": "2026-02-01",
            "author": "Rajesh Mascarenhas",
            "content": (
                "The Union Budget 2026-27 brought significant relief to the middle class "
                "with revised income tax slabs under the new tax regime. The zero-tax "
                "threshold was raised from Rs 7 lakh to Rs 9 lakh, while the 30% slab now "
                "kicks in at Rs 18 lakh instead of Rs 15 lakh. The standard deduction was "
                "increased to Rs 75,000. FM Sitharaman estimated the move would put Rs "
                "35,000 crore annually back in consumers' pockets. Consumer discretionary "
                "stocks rallied, with Titan and Avenue Supermarts gaining 3-4%."
            ),
        },
        {
            "article_id": "et-20103",
            "headline": "Budget 2026 sectoral impact: infra surges, FMCG takes a hit",
            "date": "2026-02-02",
            "author": "Krishna Merchant",
            "content": (
                "The Union Budget 2026-27 created clear winners and losers across sectors. "
                "Infrastructure, defence, and railway stocks surged 4-6% on record capex "
                "allocation. Cement companies like UltraTech and Ambuja jumped 5% on "
                "expected demand boost. However, consumer staples stocks like HUL and "
                "Nestle fell 2-3% as the budget offered no specific relief for the FMCG "
                "sector. Analysts at Motilal Oswal noted that the consumption push through "
                "tax cuts would take 2-3 quarters to translate into higher FMCG volumes. "
                "The Nifty 50 closed up 1.2% overall."
            ),
        },
    ],

    # ──────────────────────────────────────────
    # Topic 3: Reliance Jio 5G
    # ──────────────────────────────────────────
    "reliance-jio-5g": [
        {
            "article_id": "et-30201",
            "headline": "Jio launches 5G in 1,000 cities, targets 500M subscribers by 2027",
            "date": "2026-01-20",
            "author": "Kalyan Parbat",
            "content": (
                "Reliance Jio announced the commercial launch of its 5G services across "
                "1,000 cities, offering speeds up to 1 Gbps at no extra cost to existing "
                "subscribers. Chairman Mukesh Ambani set an ambitious target of 500 million "
                "5G subscribers by 2027, up from the current base of 450 million. The "
                "company has invested Rs 2.5 lakh crore in network infrastructure over the "
                "past three years. Jio's aggressive pricing — unlimited 5G data at Rs 299 "
                "per month — puts pressure on rivals to match or risk subscriber churn. "
                "Analysts at Bernstein called it the most disruptive telecom launch since "
                "Jio's original 2016 entry."
            ),
        },
        {
            "article_id": "et-30202",
            "headline": "Jio ARPU rises to Rs 203 in Q3, narrowing gap with Airtel",
            "date": "2026-01-24",
            "author": "Kalyan Parbat",
            "content": (
                "Reliance Jio reported a strong Q3 FY26 with average revenue per user (ARPU) "
                "rising to Rs 203, up from Rs 189 in the previous quarter. The improvement "
                "was driven by tariff hikes in mid-2025 and growing uptake of premium 5G "
                "plans. Jio's ARPU now trails Bharti Airtel's Rs 213 by just Rs 10, the "
                "narrowest gap in five years. Net profit for the quarter stood at Rs 5,400 "
                "crore, up 18% year-on-year. CFO Srikanth Venkatesh attributed the growth "
                "to higher data consumption, which rose 35% per user after 5G adoption. "
                "The stock rose 2.3% on the results."
            ),
        },
        {
            "article_id": "et-30203",
            "headline": "Jio's 5G push threatens Airtel's premium subscriber base in tier-2 cities",
            "date": "2026-02-05",
            "author": "Raghavendra Kamath",
            "content": (
                "Reliance Jio's aggressive 5G rollout in tier-2 and tier-3 cities is "
                "eroding Bharti Airtel's premium subscriber base, according to telecom "
                "industry analysts. Airtel has traditionally dominated higher-ARPU urban "
                "markets, but Jio's free 5G upgrade offer is drawing subscribers who "
                "previously paid Airtel a premium for 4G quality. Credit Suisse estimates "
                "Airtel could lose 8-10 million subscribers in tier-2 cities over the next "
                "two quarters if it doesn't respond with competitive pricing. Airtel CEO "
                "Gopal Vittal countered that the company's focus on network quality over "
                "volume would protect margins. Airtel shares fell 1.8% on the report."
            ),
        },
    ],
}


def get_articles(topic_id: str) -> list[dict]:
    """Get articles for a topic. Falls back to RBI if topic not found."""
    return ARTICLE_STORE.get(topic_id, ARTICLE_STORE["rbi-rates-2026"])


def format_articles_for_prompt(articles: list[dict]) -> str:
    """Format articles into a string for Gemini prompts."""
    parts = []
    for a in articles:
        parts.append(
            f"Article ID: {a['article_id']}\n"
            f"Headline: {a['headline']}\n"
            f"Date: {a['date']}\n"
            f"Author: {a['author']}\n"
            f"Content: {a['content']}"
        )
    return "\n\n".join(parts)


def get_topic_title(topic_id: str) -> str:
    """Get a display title for a topic."""
    titles = {
        "rbi-rates-2026": "RBI Holds Repo Rate at 6.5%",
        "budget-2026": "Union Budget 2026: Key Highlights",
        "reliance-jio-5g": "Reliance Jio 5G Launches Nationwide",
    }
    return titles.get(topic_id, topic_id.replace("-", " ").title())


def get_article_count(topic_id: str) -> int:
    """Get article count for a topic."""
    return len(ARTICLE_STORE.get(topic_id, []))
