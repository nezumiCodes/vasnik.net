---
title: "Sorry January, it's not you, it's finance: Custom calendars in Power BI"
description: "Teach Power BI that the year doesn't start in January: build an April–March fiscal or 4-4-5 retail date table, then get YTD and prior-year measures right."
pubDate: 2026-11-03
tags:
  - power-bi
  - dax
  - power-query
  - time-intelligence
  - business-intelligence
heroImage: ../../assets/blog/fiscal-and-custom-calendars-in-power-bi/custom-calendars-hero.png
heroAlt: "\"Sorry January, it's not you, it's finance\" beside a grid of the twelve months in fiscal order, with April highlighted as month one and January crossed out as month ten."
# medium:
#   url: https://medium.com/@nezuminet/d6fdbc29d586
#   original: true
---

Every January 1st, most of the world throws a little New Year's party to kick off the upcoming year in a good mood, and Power BI joins in. Except finance departments celebrated back in April and now want to know why your year-to-date figures look like they've been through a time machine.

This post is about teaching Power BI that a year starts whenever your organisation says it does: 1 April, 1 July, or a Monday in a 4-4-5 calendar that nobody outside retail fully understands.

## A brief tour of years that refuse to start in January

The whole world agrees that the year starts on 1 January, right up until someone has to set a budget. Every country's civil calendar turns over on New Year's Day, but governments are far less united about when their *financial* year begins. A few standouts:

- **The UK can't even agree with itself.** [Government and companies start their financial year on April 1st, but personal tax starts on April 6th](https://www.britannica.com/money/fiscal-year) [1]. That odd date [traces back to the 1752 switch from the Julian to the Gregorian calendar](https://modeldiplomat.com/learn/glossary/fiscal-year) [2], and nobody has fancied tidying it up since.
- **The US government is already living in the future.** [Its fiscal year starts on the 1st of October](https://www.britannica.com/money/fiscal-year) [1], so while the rest of us are still in 2026, Washington is busy spending fiscal 2027.
- **Japan, India, Canada and South Africa** [run April to March, like the UK](https://www.mappr.co/?p=60522) [3]. Japan adds a twist: [the government runs April to March, but personal income tax follows the calendar year](https://www.mappr.co/?p=60522) [3].
- **Australia** [starts on July 1st](https://www.mineaction.org/sites/default/files/documents/masg_members_financial_year_-_as_at_17_june_2013_0.pdf) [4], which at least means the financial year ends in the middle of winter rather than the middle of Christmas.
- **Nepal and Ethiopia** don't even use the first of the month. [Nepal's fiscal year ends on the 15th of July and Ethiopia's on the 7th of July](https://unstats.un.org/UNSD/snaama/Metadata/Notes) [5], because they follow their own calendars.
- **Iran and Afghanistan** [start around 21st of March](https://start.csail.mit.edu/mirror/cia.gov/library/publications/the-world-factbook/fields/2080.html) [6], at Nowruz, the Persian new year.

Companies are no better. Retailers often start in February, so the Christmas rush lands neatly at the end of the year. And Microsoft, the company that makes Power BI, starts its own financial year on 1st of July.

So if your reports assume January, they're wrong for a big chunk of the planet, including, awkwardly, the people who wrote the software. Power BI, today I'm coming for *you*!

## Why every new report thinks the year starts in January

Open a new Power BI file, drag a date field onto a visual and you get a tidy Year › Quarter › Month › Day hierarchy.

As we've seen this is also wrong for a lot of organisations. UK public services, charities and most of government report on an April to March financial year. Retailers often use a 4-4-5 calendar built from whole weeks, because months were apparently too easy? Universities run August to July, because of course they do.

Power BI's default hierarchy comes from **Auto date/time**, a setting that builds a hidden Gregorian date table behind every date column in your model, like a well-meaning houseguest reorganising your kitchen. It has no idea what your financial year is, and you can't teach it.

But Power BI isn't actually limited to January to December. Its defaults just behave as if it were.

The fix is the same whichever calendar you need:

1. Switch off Auto date/time.
2. Build one date table that carries every calendar your organisation uses.
3. Tell Power BI how to read that table, either the classic way or with the newer calendar-based time intelligence.

I will walk you through all three steps for two calendars. First comes a standard April - March fiscal year, then a 4-4-5 week-based calendar, for those who like their time measured in weeks and their reporting with a side of suffering.

## Step 1: Get rid of Auto date/time

Go to **File › Options and settings › Options**, then **Current File › Data Load**, and clear **Auto date/time**. You can do the same under **Global › Data Load** so new files start without it.

Existing visuals that used the automatic hierarchy will lose it, but don't panic, that's the point. They'll switch to your own date table once it's related to your data, and nobody will miss the old one.

## Step 2: Build a date table with fiscal columns

You can build a date table in DAX or in Power Query. I use Power Query because the table then lives with the rest of the data preparation, refreshes with it, and can be reused across reports by copying one query. Other ways could be to export in a template, write it as a function or add it to a Power BI dataflow based on your needs.

Create a **Blank query**, open the **Advanced Editor** and paste this:

```m
let
    // Parameters
    StartDate = #date(2021, 4, 1), // start date for calendar
    EndDate = #date(2027, 3, 31), // end date for the calendar
    FiscalStartMonth = 4, // Here you define the start of year, in this case April. Use 7 for July, 10 for October

    // One row per day
    DayCount = Duration.Days(EndDate - StartDate) + 1,
    Dates = List.Dates(StartDate, DayCount, #duration(1, 0, 0, 0)),
    Base = Table.FromList(Dates, Splitter.SplitByNothing(), type table [Date = date]),

    // Standard calendar columns
    AddMonthNumber = Table.AddColumn(Base, "Month Number", each Date.Month([Date]), Int64.Type),
    AddMonthName = Table.AddColumn(AddMonthNumber, "Month Name", each Date.ToText([Date], [Format = "MMM", Culture = "en-GB"]), type text),

    // Fiscal year, numbered by the calendar year it starts in
    AddFYStart = Table.AddColumn(AddMonthName, "Fiscal Year Start", each
        if [Month Number] >= FiscalStartMonth then Date.Year([Date]) else Date.Year([Date]) - 1, Int64.Type),
    AddFY = Table.AddColumn(AddFYStart, "Fiscal Year", each
        "FY" & Text.From([Fiscal Year Start]) & "/" & Text.End(Text.From([Fiscal Year Start] + 1), 2), type text),
    AddFMonthNo = Table.AddColumn(AddFY, "Fiscal Month Number", each
        Number.Mod([Month Number] - FiscalStartMonth + 12, 12) + 1, Int64.Type),
    AddFQuarterNo = Table.AddColumn(AddFMonthNo, "Fiscal Quarter Number", each
        Number.IntegerDivide([Fiscal Month Number] - 1, 3) + 1, Int64.Type),

    // Labels and sort keys that identify one period on their own
    AddFQuarter = Table.AddColumn(AddFQuarterNo, "Fiscal Quarter", each
        [Fiscal Year] & " Q" & Text.From([Fiscal Quarter Number]), type text),
    AddFQuarterKey = Table.AddColumn(AddFQuarter, "Fiscal Quarter Key", each
        [Fiscal Year Start] * 10 + [Fiscal Quarter Number], Int64.Type),
    AddFMonth = Table.AddColumn(AddFQuarterKey, "Fiscal Month", each
        [Month Name] & " " & Text.From(Date.Year([Date])), type text),
    AddFMonthKey = Table.AddColumn(AddFMonth, "Fiscal Month Key", each
        [Fiscal Year Start] * 100 + [Fiscal Month Number], Int64.Type)
in
    AddFMonthKey
```

> **You can also let the end date move on its own.** If you only need dates up to the end of the current month, replace the `EndDate` line with this. The table then grows by itself on every refresh, so you never have to remember to edit it each April:
>
> ```m
>     EndDate = Date.EndOfMonth(Date.From(DateTime.LocalNow())),
> ```
>
> The Power BI service refreshes in UTC, which makes no difference when you're working at month level.
>
> One catch: anything dated after this month (booked appointments, targets, forecasts) has no matching date row and quietly vanishes from your visuals, so if you need those, end the table at the end of the current fiscal year instead.

Rename the query to **Date** and load it. A few decisions in there deserve a closer look *before anyone in finance spots them*.

- **Name the fiscal year explicitly.** "FY2025" is ambiguous: some organisations mean the year that *starts* in 2025, others the one that *ends* in 2025. A label such as `FY2025/26` ends the argument before it starts. The numeric `Fiscal Year Start` column sits behind it for sorting and arithmetic.
- **Fiscal month 1 is April.** `Fiscal Month Number` runs 1–12 from the start month, so a matrix sorted by it reads April to March. The modulo formula works for any start month.
- **Give each period a column that identifies it on its own.** `Fiscal Month Number` = 1 occurs once in every year, so on its own it can't tell April 2024 from April 2025. `Fiscal Month Key` (`202501`, `202502`, …) and `Fiscal Quarter Key` can. You'll need these for sorting now and for calendar-based time intelligence later.
- **Cover whole fiscal years.** Start the table on the first day of a fiscal year and end it on the last day of one, wide enough to cover every date in your data. Partial years make year-to-date and prior-year figures look broken at the edges, and someone will email you about it at 4.55pm on a Friday.

## Step 3: Set sort orders, mark the table and relate it

Text columns sort alphabetically by default, which puts August before April. Power BI knows the alphabet very well (hoorah!) and the calendar not at all (not hoorah?). In the **Table view** pane, select each label column and use **Column tools › Sort by column**:

<figure class="figure-table">
<table>
<caption>Sort-by-column settings for the fiscal date table</caption>
<thead><tr><th scope="col">Column</th><th scope="col">Sort by</th></tr></thead>
<tbody>
<tr><th scope="row"><code>Month Name</code></th><td><code>Fiscal Month Number</code></td></tr>
<tr><th scope="row"><code>Fiscal Year</code></th><td><code>Fiscal Year Start</code></td></tr>
<tr><th scope="row"><code>Fiscal Quarter</code></th><td><code>Fiscal Quarter Key</code></td></tr>
<tr><th scope="row"><code>Fiscal Month</code></th><td><code>Fiscal Month Key</code></td></tr>
</tbody>
</table>
</figure>

Sorting `Month Name` by the fiscal month number makes it a fiscal-order column. If some reports also need January to December, add a second month name column sorted by `Month Number` rather than sharing one.

Then select the table and use **Table tools › Mark as date table**, choosing `Date` as the date column. Finally, create a **one-to-many relationship** from `Date[Date]` to the date column in each fact table.

At this point slicers, axes and matrices already show the fiscal year correctly.

Enjoy the moment. Then get back to work, because your measures are still lying to you... trust me, I know.

## Option A: Classic time intelligence

The classic DAX time intelligence functions assume a Gregorian calendar, but several of them accept a year-end date. That's all an April–March year needs: it's still the ordinary calendar, just running three months late, like most projects.

Assuming a base measure such as:

```dax
Referrals = COUNTROWS ( Referrals )
```

the fiscal measures are:

```dax
Referrals FYTD =
TOTALYTD ( [Referrals], 'Date'[Date], "31/3" )

Referrals PY =
CALCULATE ( [Referrals], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

Referrals FYTD PY =
CALCULATE ( [Referrals FYTD], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

Referrals vs PY % =
DIVIDE ( [Referrals] - [Referrals PY], [Referrals PY] )
```

The last argument of `TOTALYTD` is the fiscal year-end as text. Yes, a date, as text... in 2026 (!). The year part is ignored, and the string is read in the model's locale: `"31/3"` suits a UK model, while a US-locale model expects `"3/31"`. Check the result against a known figure before trusting it. `DATESYTD` takes the same argument.

The classic approach has limits:

- **Quarters only line up for some start months.** `TOTALQTD` uses calendar quarters. That's fine for April, July or October starts, whose fiscal quarters match calendar quarters, and wrong for a year starting in, say, February.
- **There's no concept of a week.** Week-to-date and week-on-week comparisons need hand-written DAX.
- **It can't represent calendars that aren't shifted Gregorian.** A 4-4-5 calendar's periods don't start on the first of a month, so the classic functions return the wrong dates.

For an April – March year with monthly reporting, Option A is reliable, stable and pleasantly boring. For anything else, read on.

## Option B: Calendar-based time intelligence

The September 2025 release of Power BI Desktop added **calendar-based time intelligence**, also called Enhanced DAX Time Intelligence. Instead of passing a date column and a year-end string to each function, you define a calendar *once* on your date table, mapping its columns to categories such as Year, Quarter, Month, Week and Date. Time intelligence functions then take the calendar as their argument and follow whatever structure it describes.

It works with fiscal, retail, ISO-week, 13-month and lunar calendars, allows gaps in the date table, and finally adds proper week functions. At the time of writing (October 2026) it is still in **preview**, which is Microsoft for "works on our machine". Test it before you rely on it in production reports.

### Turn it on

Go to **File › Options and settings › Options › Preview features**, tick **Enhanced DAX Time Intelligence** and restart Power BI Desktop.

### Define the fiscal calendar

Select the `Date` table and open **Table tools › Calendar options** (or right-click the table in the Table view pane). Create a new calendar named **Fiscal** and add these categories:

<figure class="figure-table">
<table>
<caption>Category mapping for the Fiscal calendar</caption>
<thead><tr><th scope="col">Category</th><th scope="col">Primary column</th><th scope="col">Type</th></tr></thead>
<tbody>
<tr><th scope="row">Year</th><td><code>Fiscal Year</code></td><td>Complete</td></tr>
<tr><th scope="row">Quarter</th><td><code>Fiscal Quarter</code></td><td>Complete</td></tr>
<tr><th scope="row">Month</th><td><code>Fiscal Month</code></td><td>Complete</td></tr>
<tr><th scope="row">Month of Year</th><td><code>Month Name</code></td><td>Partial</td></tr>
<tr><th scope="row">Date</th><td><code>Date</code></td><td>Complete</td></tr>
</tbody>
</table>
</figure>

Categories come in two kinds. **Complete** categories identify a single period on their own: `Apr 2025` or `FY2025/26 Q2` can only mean one month or one quarter. **Partial** categories need another category to do that: `Apr` or `Q2` alone could be any year, so they belong in Month of Year and Quarter of Year.

What makes a category complete is what its values contain, not its name. Year is always complete, because `FY2025/26` only ever means one year. A quarter or month is complete only when its values include the year. That's why Step 2 built columns like `Fiscal Quarter` and the key columns, whose values never repeat across years. Their sort-by columns are picked up automatically as associated columns.

### Write the measures

The measures now **reference the calendar instead of a date column**, and the year-end string disappears:

```dax
Referrals FYTD =
TOTALYTD ( [Referrals], 'Fiscal' )

Referrals PY =
CALCULATE ( [Referrals], SAMEPERIODLASTYEAR ( 'Fiscal' ) )

Referrals FQTD =
TOTALQTD ( [Referrals], 'Fiscal' )
```

`TOTALQTD` now uses fiscal quarters whatever month the year starts in, because the calendar says what a quarter is and DAX has stopped guessing.

## Custom calendars: a 4-4-5 example (the most wicked one)

A 4-4-5 calendar builds each year from 52 whole weeks. Each quarter has 13 weeks, split into periods of 4, 4 and 5 weeks. Every period ends on the same weekday, so weeks compare like-for-like across years.

**The catch:** 52 weeks is 364 days, so the calendar drifts by a day a year (two in a leap year), and every five or six years it quietly absorbs a 53rd week. Nobody warns the new analyst about this. Now consider yourself warned.

There are several conventions for where the year starts. The version below starts each year on the **Monday nearest 1 April** and puts any 53rd week into the final period. It's the complete date table query: everything from Step 2, with the retail calendar columns added at the end. Paste it into the **Advanced Editor** in place of the Step 2 version:

```m
let
    // Parameters
    StartDate = #date(2021, 4, 1), // start date for calendar
    EndDate = #date(2027, 3, 31), // end date for the calendar
    FiscalStartMonth = 4, // Here you define the start of year, in this case April. Use 7 for July, 10 for October

    // One row per day
    DayCount = Duration.Days(EndDate - StartDate) + 1,
    Dates = List.Dates(StartDate, DayCount, #duration(1, 0, 0, 0)),
    Base = Table.FromList(Dates, Splitter.SplitByNothing(), type table [Date = date]),

    // Standard calendar columns
    AddMonthNumber = Table.AddColumn(Base, "Month Number", each Date.Month([Date]), Int64.Type),
    AddMonthName = Table.AddColumn(AddMonthNumber, "Month Name", each Date.ToText([Date], [Format = "MMM", Culture = "en-GB"]), type text),

    // Fiscal year, numbered by the calendar year it starts in
    AddFYStart = Table.AddColumn(AddMonthName, "Fiscal Year Start", each
        if [Month Number] >= FiscalStartMonth then Date.Year([Date]) else Date.Year([Date]) - 1, Int64.Type),
    AddFY = Table.AddColumn(AddFYStart, "Fiscal Year", each
        "FY" & Text.From([Fiscal Year Start]) & "/" & Text.End(Text.From([Fiscal Year Start] + 1), 2), type text),
    AddFMonthNo = Table.AddColumn(AddFY, "Fiscal Month Number", each
        Number.Mod([Month Number] - FiscalStartMonth + 12, 12) + 1, Int64.Type),
    AddFQuarterNo = Table.AddColumn(AddFMonthNo, "Fiscal Quarter Number", each
        Number.IntegerDivide([Fiscal Month Number] - 1, 3) + 1, Int64.Type),

    // Labels and sort keys that identify one period on their own
    AddFQuarter = Table.AddColumn(AddFQuarterNo, "Fiscal Quarter", each
        [Fiscal Year] & " Q" & Text.From([Fiscal Quarter Number]), type text),
    AddFQuarterKey = Table.AddColumn(AddFQuarter, "Fiscal Quarter Key", each
        [Fiscal Year Start] * 10 + [Fiscal Quarter Number], Int64.Type),
    AddFMonth = Table.AddColumn(AddFQuarterKey, "Fiscal Month", each
        [Month Name] & " " & Text.From(Date.Year([Date])), type text),
    AddFMonthKey = Table.AddColumn(AddFMonth, "Fiscal Month Key", each
        [Fiscal Year Start] * 100 + [Fiscal Month Number], Int64.Type),

    // 4-4-5 retail calendar: each year starts on the Monday nearest 1 April
    RetailYearStartDate = (y as number) as date =>
        Date.StartOfWeek(Date.AddDays(#date(y, 4, 1), 3), Day.Monday),

    AddRYStart = Table.AddColumn(AddFMonthKey, "Retail Year Start", each
        if [Date] >= RetailYearStartDate(Date.Year([Date])) then Date.Year([Date]) else Date.Year([Date]) - 1, Int64.Type),
    AddRY = Table.AddColumn(AddRYStart, "Retail Year", each
        "RY" & Text.From([Retail Year Start]) & "/" & Text.End(Text.From([Retail Year Start] + 1), 2), type text),
    AddRWeekNo = Table.AddColumn(AddRY, "Retail Week of Year", each
        Number.IntegerDivide(Duration.Days([Date] - RetailYearStartDate([Retail Year Start])), 7) + 1, Int64.Type),
    AddRPeriodNo = Table.AddColumn(AddRWeekNo, "Retail Period of Year", each
        (
            let
                Quarter = List.Min({4, Number.IntegerDivide([Retail Week of Year] - 1, 13) + 1}),
                WeekInQuarter = [Retail Week of Year] - (Quarter - 1) * 13
            in
                (Quarter - 1) * 3 + (if WeekInQuarter <= 4 then 1 else if WeekInQuarter <= 8 then 2 else 3)
        ), Int64.Type),
    AddRQuarterNo = Table.AddColumn(AddRPeriodNo, "Retail Quarter of Year", each
        Number.IntegerDivide([Retail Period of Year] - 1, 3) + 1, Int64.Type),

    // Keys that identify one period on their own
    AddRWeekKey = Table.AddColumn(AddRQuarterNo, "Retail Week Key", each
        [Retail Year Start] * 100 + [Retail Week of Year], Int64.Type),
    AddRPeriodKey = Table.AddColumn(AddRWeekKey, "Retail Period Key", each
        [Retail Year Start] * 100 + [Retail Period of Year], Int64.Type),
    AddRQuarterKey = Table.AddColumn(AddRPeriodKey, "Retail Quarter Key", each
        [Retail Year Start] * 10 + [Retail Quarter of Year], Int64.Type)
in
    AddRQuarterKey
```

The `RetailYearStartDate` helper moves forward three days from 1 April and then back to the Monday of that week, which always lands within three days of 1 April. The period formula counts weeks within each 13-week quarter and maps them to periods of 4, 4 and 5 weeks. Week 53, when it occurs, falls into period 12.

Sort `Retail Year` by `Retail Year Start`. Because a 4-4-5 year starts a few days either side of 1 April, the first and last days of the date table belong to neighbouring retail years; widen the date range if those edges matter to you.

The same day can sit in different years, quarters and periods depending on the calendar:

<figure class="figure-table">
<table>
<caption>Two dates labelled under each of the three calendars</caption>
<thead><tr><th scope="col">Date</th><th scope="col">Jan – Dec</th><th scope="col">Fiscal (Apr – Mar)</th><th scope="col">4-4-5 retail</th></tr></thead>
<tbody>
<tr><th scope="row">Mon 30 Mar 2026</th><td>2026, Q1, March</td><td>FY2025/26, Q4, month 12</td><td>RY2026/27, Q1, period 1, week 1</td></tr>
<tr><th scope="row">Mon 1 Jun 2026</th><td>2026, Q2, June</td><td>FY2026/27, Q1, month 3</td><td>RY2026/27, Q1, period 3, week 10</td></tr>
</tbody>
</table>
</figure>

### Define the retail calendar

Create a second calendar on the same table, named **Retail 445**:

<figure class="figure-table">
<table>
<caption>Category mapping for the Retail 445 calendar</caption>
<thead><tr><th scope="col">Category</th><th scope="col">Primary column</th><th scope="col">Type</th></tr></thead>
<tbody>
<tr><th scope="row">Year</th><td><code>Retail Year</code></td><td>Complete</td></tr>
<tr><th scope="row">Quarter</th><td><code>Retail Quarter Key</code></td><td>Complete</td></tr>
<tr><th scope="row">Month</th><td><code>Retail Period Key</code></td><td>Complete</td></tr>
<tr><th scope="row">Week</th><td><code>Retail Week Key</code></td><td>Complete</td></tr>
<tr><th scope="row">Week of Year</th><td><code>Retail Week of Year</code></td><td>Partial</td></tr>
<tr><th scope="row">Date</th><td><code>Date</code></td><td>Complete</td></tr>
</tbody>
</table>
</figure>

The numeric keys work as primary columns. If you want friendlier labels in visuals, such as `P03 RY2026/27`, add text columns sorted by the keys and use those as the primary columns instead.

A column can only carry one category across all calendars on a table, which is another reason to keep separate fiscal and retail columns rather than reusing them.

### Week-based measures

The week functions only work with calendar-based time intelligence, and they are the main reason to use it for a retail calendar:

```dax
Referrals WTD =
TOTALWTD ( [Referrals], 'Retail 445' )

Referrals Period TD =
TOTALMTD ( [Referrals], 'Retail 445' )

Referrals Same Week LY =
CALCULATE ( [Referrals], DATEADD ( 'Retail 445', -52, WEEK ) )
```

`TOTALMTD` follows the calendar's Month category, so here it returns period-to-date over 4- or 5-week periods.

The last measure is a real decision, not a technicality. In a 53-week year, `SAMEPERIODLASTYEAR ( 'Retail 445' )` maps week 53 to a week that doesn't exist in the previous year. Shifting by exactly 52 weeks with `DATEADD` always compares like-for-like weekdays. Agree which rule your organisation uses before the first year-on-year report goes out.

## Which approach to use

- **April–March (or any shifted year), monthly reporting, production reports today:** the fiscal date table with classic time intelligence. It's simple, fully supported and won't surprise you at year end.
- **Fiscal quarters that don't match calendar quarters, week-based reporting, or several calendars in one model:** calendar-based time intelligence, once you're comfortable living on the preview edge.
- **Either way:** switch off Auto date/time and keep one date table that holds every calendar. Finance, operations and commissioners can then each see the year they recognise from the same model, and you can stop maintaining three versions of the same report.

## Sources

1. Encyclopaedia Britannica (n.d.). *Fiscal year*. Accessed 28 October 2026. [https://www.britannica.com/money/fiscal-year](https://www.britannica.com/money/fiscal-year)
2. Model Diplomat (n.d.). *Fiscal year* (glossary). Accessed 28 October 2026. [https://modeldiplomat.com/learn/glossary/fiscal-year](https://modeldiplomat.com/learn/glossary/fiscal-year)
3. Mappr (n.d.). *Countries whose fiscal year isn't the calendar year*. Accessed 28 October 2026. [https://www.mappr.co/?p=60522](https://www.mappr.co/?p=60522)
4. Mine Action Support Group (2013). *MASG members' financial year*, as at 17 June 2013. [https://www.mineaction.org/sites/default/files/documents/masg_members_financial_year_-_as_at_17_june_2013_0.pdf](https://www.mineaction.org/sites/default/files/documents/masg_members_financial_year_-_as_at_17_june_2013_0.pdf)
5. United Nations Statistics Division (n.d.). *National Accounts Main Aggregates Database: country notes*. Accessed 28 October 2026. [https://unstats.un.org/UNSD/snaama/Metadata/Notes](https://unstats.un.org/UNSD/snaama/Metadata/Notes)
6. Central Intelligence Agency (n.d.). *The World Factbook: Fiscal year field listing* (archived copy). Accessed 28 October 2026. [https://start.csail.mit.edu/mirror/cia.gov/library/publications/the-world-factbook/fields/2080.html](https://start.csail.mit.edu/mirror/cia.gov/library/publications/the-world-factbook/fields/2080.html)

