"use client";

import { AnimatePresence } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { ProposalLanding } from "@/components/ProposalLanding";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { DateTimePicker } from "@/components/DateTimePicker";
import { CategorySelection } from "@/components/CategorySelection";
import { SubcategorySelection } from "@/components/SubcategorySelection";
import { PersonalQuestions } from "@/components/PersonalQuestions";
import { SummaryPage } from "@/components/SummaryPage";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { BackgroundMusic } from "@/components/ui/BackgroundMusic";
import { CreatorBrand } from "@/components/ui/CreatorBrand";
import { StepNav } from "@/components/StepNav";
import { Particles } from "@/components/effects/Particles";

const BOOKING_STEPS = [
  "datetime",
  "category",
  "subcategory",
  "questions",
  "summary",
] as const;

export function BookDateApp() {
  const { step } = useBooking();
  const showNav = BOOKING_STEPS.includes(step as (typeof BOOKING_STEPS)[number]);

  return (
    <div className="romantic-bg relative min-h-screen overflow-x-hidden">
      <BackgroundMusic />
      {step !== "proposal" && <Particles count={10} />}
      <ThemeToggle />
      <MusicToggle />
      {(step === "proposal" || showNav) && <CreatorBrand variant="footer" />}
      {showNav && <StepNav />}

      <AnimatePresence mode="wait">
        {step === "proposal" && <ProposalLanding key="proposal" />}
        {step === "celebration" && <CelebrationScreen key="celebration" />}
        {step === "datetime" && <DateTimePicker key="datetime" />}
        {step === "category" && <CategorySelection key="category" />}
        {step === "subcategory" && <SubcategorySelection key="subcategory" />}
        {step === "questions" && <PersonalQuestions key="questions" />}
        {step === "summary" && <SummaryPage key="summary" />}
      </AnimatePresence>
    </div>
  );
}
