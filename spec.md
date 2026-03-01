# CCPC Admission Analytics

## Current State

- App has static year tabs: HSC 2025, HSC 2024 (hardcoded components)
- Submission form stores new students via `submitStudent` backend call with a `year` field (bigint)
- Currently `year` dropdown in the form only offers 2024 and 2025
- OverviewTab has hardcoded YoY charts and trend line for 2024/2025 only
- ProfilesTab has hardcoded year filter options (2024, 2025)
- Submitted students appear in ProfilesTab/Student Profiles only; they do NOT feed into HSC year tabs or charts
- No dynamic tabs, charts, or tables are created for future years (2026, 2027, 2028)

## Requested Changes (Diff)

### Add

- **Dynamic year tab creation**: When submissions arrive for a year (2026, 2027, 2028...) that doesn't have a dedicated tab, a new tab "HSC 2026", "HSC 2027", etc. is automatically created in the main tab bar
- **DynamicHSCTab component**: A reusable tab that renders for any submitted year — shows:
  - Summary stat cards (total, by exam type, unique institutions)
  - Bar chart: students by institution
  - Pie chart: share by institution
  - Section distribution bar chart
  - Sortable/filterable table of students for that year
- **Submission form year options extended**: Add HSC 2026, HSC 2027, HSC 2028 to the year selector dropdown
- **OverviewTab dynamic**: YoY bar chart and trend line chart dynamically include any year that has submitted students (not just hardcoded 2024/2025). Summary stats also update to include submitted students from all years.
- **ProfilesTab year filter dynamic**: Year dropdown includes all years present in combined student dataset (including submitted years beyond 2025)

### Modify

- `App.tsx`: Fetch submitted students at app level (or pass down) to detect which future years have data. Render dynamic tab triggers and content for any year > 2025 that has submitted students.
- `SubmitStudentForm.tsx`: Extend year select to include 2026, 2027, 2028
- `OverviewTab.tsx`: Accept submitted students as prop or fetch from backend; include submitted years in YoY chart data
- `ProfilesTab.tsx`: Dynamically build year filter options from all available years in data

### Remove

- Nothing removed

## Implementation Plan

1. Modify `SubmitStudentForm.tsx`: add 2026, 2027, 2028 to year select options
2. Modify `App.tsx`:
   - Fetch submitted students at app level using `useActor`
   - Compute `dynamicYears` = unique years from submitted students that are > 2025
   - Pass `submittedStudents` (converted to `Student[]`) down as a prop to `OverviewTab` and to dynamic year tabs
   - Add dynamic `TabsTrigger` entries for each future year found
   - Add dynamic `TabsContent` entries using a new `DynamicHSCTab` component
3. Create `DynamicHSCTab.tsx`: accepts `year: number` and `students: Student[]`, renders:
   - Header with year label and total count badges
   - 3 stat cards: total, exam types breakdown, unique institutions
   - Bar chart (by institution) + Pie chart (share)
   - Section distribution bar chart
   - Sortable, filterable table (name, section, exam, institution, rank/dept)
4. Modify `OverviewTab.tsx`: accept `submittedStudents?: Student[]` prop; merge into YoY chart data so any submitted future year appears on charts and trend line
5. Modify `ProfilesTab.tsx`: derive year filter options dynamically from the full combined student list (including submitted students) instead of hardcoded 2024/2025
6. After submission, App re-fetches to trigger any new tab creation automatically
