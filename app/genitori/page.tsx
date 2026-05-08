import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { parentSheetCategories, parentSheets } from "@/data/parentSheets";

export default function ParentsPage() {
  return (
    <div className="grid gap-6 pb-16">
      <SectionHeader
        eyebrow="Genitori"
        title="Schede informative"
        description="Materiali semplici e non tecnici, pensati come base modificabile per counselling con i genitori."
      />
      <div className="flex flex-wrap gap-2">
        {parentSheetCategories.map((category) => (
          <Badge key={category} tone="blue">{category}</Badge>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {parentSheets.map((sheet) => (
          <Card
            key={sheet.id}
            title={sheet.title}
            description={sheet.content}
            meta={
              <div className="flex flex-wrap gap-2">
                <Badge tone="teal">{sheet.category}</Badge>
                <Badge>Agg. {sheet.updatedAt}</Badge>
              </div>
            }
          >
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Quando contattare il pediatra / PS</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {sheet.whenToCall.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
