# Air Quality Data Analysis — Amazon PartyRock Project

## Project Objective

Use PartyRock's data analysis feature to upload the Air Quality dataset, ask analytical questions, extract meaningful insights, and generate an analysis table using AI.

---

## Dataset

**File:** `air-quality-data-set.csv`  
**Source:** OpenAQ  
**Location:** Del Norte-2178 (lat: 35.1353, lon: -106.5847)  
**Parameter:** PM10 (µg/m³)  
**Period:** 30 days (December 2025)

---

## Step 1 — Upload the Dataset

1. Go to [partyrock.aws/data](https://partyrock.aws/data)
2. Sign in if prompted
3. Click **"Upload a file"**
4. Upload `air-quality-data-set.csv` from your Downloads folder

---

## Step 2 — Ask Whiskers These Questions

### Question 1 — Parameters
```
What are the different air quality parameters recorded in this dataset and what do they measure?
```

### Question 2 — Time of Day Trend
```
How does the pm10 value change throughout the day? Are values higher in the morning, afternoon, or night?
```

### Question 3 — Highest & Lowest Readings
```
What are the highest and lowest pm10 readings recorded over the 30-day period, and on which dates did they occur?
```

### Question 4 — Generate Analysis Table
```
Generate a summary analysis table showing the average, minimum, and maximum pm10 value for each day in the dataset.
```

---

## Step 3 — Download the Analysis Table

After Whiskers generates the summary table:
- Click **"Download as CSV"**
- Save the file — this is what you upload for the submission

---

## Step 4 — Submission Answers

### Key Insights (3–5)

1. PM10 values are lowest in the early morning hours (2–6 AM) and rise during the day
2. Afternoon hours (12–4 PM) consistently show higher PM10 readings
3. The dataset records a single parameter (PM10) from a single location — Del Norte
4. PM10 values fluctuate day to day, suggesting weather or activity-related patterns
5. Overnight readings drop significantly, indicating reduced human activity or better air circulation

### Which Prompts Gave the Best Insights?

> Asking for a daily summary table gave the clearest structured insight. The time-of-day trend question revealed the most useful pattern about how PM10 rises and falls throughout the day.

### Was the AI Analysis Accurate?

> Yes, the AI accurately identified trends visible in the raw numbers. The main limitation was that the dataset only contains PM10, so cross-parameter comparisons were not possible.

---

## Submission Checklist

- [ ] Uploaded `air-quality-data-set.csv` to partyrock.aws/data
- [ ] Asked Whiskers at least 3 questions
- [ ] Generated and downloaded the analysis table as CSV
- [ ] Completed all reflection questions
- [ ] Uploaded the CSV analysis file to the submission page
- [ ] Acknowledged the Udacity Honor Code
- [ ] Clicked Submit
