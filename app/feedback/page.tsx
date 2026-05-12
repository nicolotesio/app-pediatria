import { FeedbackForm } from "@/components/FeedbackForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function FeedbackPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="FEEDBACK"
        description="Lascia un messaggio con migliorie, errori o contenuti da aggiungere all'app."
      />
      <FeedbackForm />
    </div>
  );
}
