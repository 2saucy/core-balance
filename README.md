# CoreBalance

CoreBalance is a modern fitness companion app built with Next.js, TypeScript, and TailwindCSS. It helps users track their fitness journey, plan meals, build custom workout routines, and analyze progress—all in one place.

## Features

- **Analytics Dashboard**: Visualize BMI, body fat %, calories, weight trends, workout stats, and recent activity.
- **Calculator Tools**:
  - BMI Calculator
  - Body Fat Percentage (U.S. Navy Method)
  - Daily Calorie Needs (BMR, TDEE, Goal-based)
  - Macro Split Calculator
  - Ideal Weight Estimator
- **Custom Routine Builder**: Create, save, and manage custom workout routines. Add exercises by split, track sets/reps, save routines to local storage.
- **Rep Tracker**: Log exercise sets, weights, durations, rest times, and view workout history.
- **Meal Planner**: Generate personalized meal plans using AI (Gemini API), based on diet type, caloric goals, preferences, allergies, and budget.
- **Shopping List Generator**: Automatically create grocery lists from meal plans.
- **Settings**: Switch units (metric/imperial), clear history, toggle dark/light theme.
- **Progress Pictures**: Track visual progress over time.
- **Daily Tips**: Get helpful fitness and nutrition tips.

## Project Structure

```
src/
  app/                # Next.js routing and pages
    analytics/
    calculators/
    diet/
    workout/
    api/
    globals.css
    layout.tsx
    page.tsx
  components/         # Reusable UI, forms, layout
  hooks/              # Custom hooks (localStorage, analytics, routine, tracker, units)
  lib/                # Calculations, types, constants, validation, utils
  data/               # Sample user/profile/test data
  public/             # Images, assets
```

## Getting Started

1. **Clone the repo**  
   `git clone https://github.com/yourusername/core-balance.git`
2. **Install dependencies**  
   `npm install`
3. **Set up API keys**  
   Add your Google Gemini API key to your environment (see `.env.local.example`)
4. **Run the app**  
   `npm run dev`
5. **Open in browser**  
   Visit `http://localhost:3000`

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/) (validation)
- [React Hook Form](https://react-hook-form.com/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.com/) (toasts)
- [Recharts](https://recharts.org/) (charts)
- [Gemini API](https://ai.google.dev/gemini-api/docs) (meal plan generation)

## Tests

Unit tests for all core calculations are in `src/lib/calculations/__test__/`.  
Run tests with:

```bash
npm test
```

## Contributing

PRs and issues are welcome!  
Please see `CONTRIBUTING.md` for details.

## Roadmap & Improvements

- [ ] Refactor meal planner and routine builder for better usability and code modularity
- [ ] Add drag-and-drop for exercises
- [ ] Improve meal plan editing and saving
- [ ] Internationalization (i18n) support
- [ ] Enhance accessibility and mobile experience
- [ ] Switch persistence from localStorage to backend (optional)
- [ ] Add achievements, streaks, and gamification features

## License

MIT © Gucho
