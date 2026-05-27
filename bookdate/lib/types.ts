export type BookingStep =
  | "loading"
  | "proposal"
  | "celebration"
  | "datetime"
  | "category"
  | "subcategory"
  | "questions"
  | "summary";

export interface PersonalAnswers {
  wearColor: string;
  favoriteSnack: string;
  songRequest: string;
  smileMost: string;
  specialRequest: string;
}

export interface BookingData {
  date: string;
  time: string;
  timezone: string;
  categoryId: string;
  categoryLabel: string;
  categoryEmoji: string;
  subcategories: string[];
  photo: string | null;
  answers: PersonalAnswers;
}

export const EMPTY_ANSWERS: PersonalAnswers = {
  wearColor: "",
  favoriteSnack: "",
  songRequest: "",
  smileMost: "",
  specialRequest: "",
};

export const DEFAULT_BOOKING: BookingData = {
  date: "",
  time: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  categoryId: "",
  categoryLabel: "",
  categoryEmoji: "",
  subcategories: [],
  photo: null,
  answers: { ...EMPTY_ANSWERS },
};
