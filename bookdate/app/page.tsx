import { BookingProvider } from "@/context/BookingContext";
import { BookDateApp } from "@/components/BookDateApp";

export default function Home() {
  return (
    <BookingProvider>
      <BookDateApp />
    </BookingProvider>
  );
}
